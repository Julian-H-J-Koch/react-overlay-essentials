import { useEffect, useState, useRef } from 'react';
import './TutorialOverlay.css';

// Um das TutorialOverlay zu nutzen, muss der State die folgende Struktur haben:
const defaultTutorialState = {
    steps: [
        // {
        // headline: null,
        // message: null,
        // attachToObject: null,
        // command: null,
        // backCommand: null,
        // waitFor: null,
        // dontHighlightObject: null,
        // }
    ],
    currentCommand: null,
    proceedButtonText: null,
    completeButtonText: null,
    backButtonText: null,
    cancelButtonText: null,
    completeCommand: null,
    cancelCommand: null,
    style: null,
};

const TIMEOUT_OVERLAY_WAIT_FOR_COMMAND_EXECUTION_MS = 100;

// Wobei alle Attribute grundsätzlich optional sind:
// - steps: Ist ein Array, welches alle Schritte des Tutorials im Format {message: string, attachToObject: JSX.Element, dontHighlightObject: boolean} angibt.
//          - headline: Eine fett hinterlegte Überschrift für diesen Schritt (optional)
//          - message: Die in diesem Schritt angezeigte Nachricht
//          - attachToObject: Die HTML-ID des Objekts im Dokument oder ein HTMLElement neben dem die Nachricht angezeigt werden soll (optional, sonst in der Mitte des Bildschirms)
//          - command: Ein String, der an einer Stelle gesetzt und an anderer Stelle ausgelesen werden kann, um z.B. Funktionsaufrufe zu triggern beim BETRETEN des steps (optional)
//          - backCommand: Wie command. Aber gedacht für den Fall, dass AUS diesem Schritt ZURÜCKgegangen wird. Soll also rückgängig machen, was in command passiert ist (optional)
//          - waitFor: Ein int, der angibt wie viele ms nach dem ausführen des Commands /bzw. backCommands) gewartet werden soll, bis zum nächsten Step gewechselt wird (optional, standard 100)
//          - dontHighlightObject: Gibt an, ob die standardmäßige hervoerhebung des Objekts aufgehoben werden soll (also das NICHT visuell in den Vordergrund gezogen wird, vor das Overlay) (optional)
// - currentCommand: Wird bei jedem Schritt aktualisiert, damit von außen auf einen Command reagiert werden kann
// - completeCommand: ist der Command, auf den currentCommand nach Bestätigung des "Abschließen" Buttons auf der letzten Seite gesetzt wird
// - cancelCommand: ist der Command, auf den currentCommand nach Abbruch auf der ersten Seite gesetzt wird ODER beim abbrechen in einem beliebigen Step durch ESC-Taste
// - proceedButtonText: ist der Text der auf dem Fortfahren Button stehen soll (ohne Angabe wird "Weiter" verwendet)
// - completeButtonText: ist der Text der auf dem Abschließenden Button stehen soll (ohne Angabe wird "Abschließen" verwendet)
// - backButtonText: ist der Text der auf dem Zurück Button stehen soll (ohne Angabe wird "Zurück" verwendet)
// - cancelButtonText: ist der Text der auf dem Abbrechen Button stehen soll (ohne Angabe wird "Überspringen" verwendet)
// - style: ist der Style des Tutorial-Overlays (Standardmäßig unverändert)



export function TutorialOverlay({ state, setState }) {

    // Wird verwendet um das Tutorial-Overlay ein- und auszublenden
    const [showTutorial, setShowTutorial] = useState(false);
    
    // Wird verwendet um die Position des Textes zu bestimmen
    const [tutorialPos, setTutorialPos] = useState(null);

    const [highlightElementRect, setHighlightElementRect] = useState(null);
    
    // Wird verwendet um zu tracken bei welchem Schritt des Tutorials der Nutzer ist
    const [tutorialStep, setTutorialStep] = useState(0);

    const proceedButtonRef = useRef(null);

    // Sobald der State von außen aktualisiert wird triggert diese Funktion
    // Die setzt showTutorial auf true
    useEffect(() => {
        setTutorialStep(0);
        setHighlightElementRect(null);
        setTutorialPos(null);
        if (state?.steps !== undefined && state.steps.length > 0) {
            const attachElement = typeof state?.steps[0]?.attachToObject === "string"
                    ? document.getElementById(state?.steps[0]?.attachToObject)
                    : state?.steps[0]?.attachToObject;

            if(attachElement instanceof HTMLElement) {
                showTutorialAtElement(attachElement, state.steps[0].dontHighlightObject ?? false);
            }
            else {
                setShowTutorial(true);
            }
            setTimeout(() => { proceedButtonRef.current?.focus(); }, 500);
        }
        else {
            setShowTutorial(false);
        }
    }, [state?.steps]);

    useEffect(() => {
        if (showTutorial) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [showTutorial]);


    const showTutorialAtElement = (e, dontHighlightElement) => {
        var rect = e.getBoundingClientRect();

        const viewportHeight = window.innerHeight;
        // Element ist höher als der sichtbare Bereich
        if (rect.height > viewportHeight) {
            e.scrollIntoView({behavior: "instant", block: "start"});
            // Etwas nach unten scrollen, damit das Element nicht direkt am oberen Rand klebt
            window.scrollBy({top: -viewportHeight * 0.3, behavior: "instant"});
        } else {
            e.scrollIntoView({behavior: "instant", block: "center"});
        }

        rect = e.getBoundingClientRect();

        // 25 rem
        const tooltipWidth = 31 * parseFloat(getComputedStyle(document.documentElement).fontSize);

        const showLeft = rect.right + tooltipWidth > window.innerWidth;

        setTutorialPos({
            showLeft,
            px_left: showLeft
                ? rect.left - tooltipWidth - parseFloat(getComputedStyle(document.documentElement).fontSize)
                : rect.right + parseFloat(getComputedStyle(document.documentElement).fontSize),
            px_top: rect.top
        });

        if(!dontHighlightElement) {
            setHighlightElementRect({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            });
        }
        else {
            setHighlightElementRect(null);
        }

        setShowTutorial(true);
    };

    return showTutorial ?
        <div className={"overlay-essentials-tutorial-overlay" + (highlightElementRect === null ? " overlay-essentials-darken" : "")}>
            <div
                className="overlay-essentials-overlay-essentials-tutorial-highlight-hole"
                style={highlightElementRect === null
                    ? {
                        display: "none"
                    } : {
                        left: `${highlightElementRect?.left ?? 0}px`,
                        top: `${highlightElementRect?.top ?? 0}px`,
                        width: `${highlightElementRect?.width ?? 0}px`,
                        height: `${highlightElementRect?.height ?? 0}px`,
                    }}
            />
            <div className="overlay-essentials-overlay-essentials-tutorial-box" style={{
                    ...(tutorialPos
                            ? {
                                position: "fixed",
                                left: tutorialPos.px_left,
                                top: tutorialPos.px_top,
                                transform: 'none'
                            }
                            : {}
                        ),
                    ...(state?.style != null ? state.style : {})
                    }}
                role="dialog"
                aria-modal="true"
                aria-labelledby={state?.steps[tutorialStep].headline != null ? "tutorial-headline" : undefined}
                aria-label={state?.steps[tutorialStep]?.headline != null ? undefined : "Tutorial"}
                aria-describedby="tutorial-message"
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        const nextCommand = state.cancelCommand ?? null;
                        setState(prev => ({...prev, currentCommand: nextCommand}));
                    }
                }}>
                <div id="overlay-essentials-overlay-essentials-tutorial-headline" className="overlay-essentials-overlay-essentials-tutorial-headline"><strong>{state?.steps[tutorialStep]?.headline ?? ""} {tutorialStep + 1}/{state.steps.length}</strong></div>
                <div id="overlay-essentials-overlay-essentials-tutorial-message" className="overlay-essentials-overlay-essentials-tutorial-message">{state?.steps[tutorialStep]?.message ?? ""}</div>
                <div className="overlay-essentials-tutorial-buttons">
                    <button
                        onClick={() => {
                            if(tutorialStep > 0) {
                                const nextCommand = state.steps[tutorialStep]?.backCommand ?? null;
                                setState(prev => ({...prev, currentCommand: nextCommand}));
                                setTimeout(() => {
                                    const attachElement = typeof state?.steps[tutorialStep - 1]?.attachToObject === "string"
                                            ? document.getElementById(state?.steps[tutorialStep - 1]?.attachToObject)
                                            : state?.steps[tutorialStep - 1]?.attachToObject;

                                    if(attachElement instanceof HTMLElement) {
                                        showTutorialAtElement(attachElement, state.steps[tutorialStep - 1].dontHighlightObject);
                                    }
                                    else {
                                        setTutorialPos(null);
                                        setHighlightElementRect(null);
                                    }
                                    setTutorialStep(prev => prev - 1);
                                }, nextCommand != null ? (state?.steps[tutorialStep - 1].waitFor ?? TIMEOUT_OVERLAY_WAIT_FOR_COMMAND_EXECUTION_MS) : 0);
                            }
                            else {
                                const nextCommand = state.cancelCommand ?? null;
                                setState(prev => ({...prev, currentCommand: nextCommand, steps: []}));
                            }
                        }}
                        type="button"
                        className={"px-4 py-2 bg-gray-300 rounded " + (tutorialStep > 0 ? "overlay-essentials-back-button" : "overlay-essentials-cancel-button")}>
                        {tutorialStep > 0 ? (state?.backButtonText ?? "Zurück") : (state?.cancelButtonText ?? "Überspringen")}
                    </button>
                    <button onClick={() => {
                            if(tutorialStep + 1 < state.steps.length) {
                                const nextCommand = state.steps[tutorialStep + 1]?.command ?? null;
                                setState(prev => ({...prev, currentCommand: nextCommand}));
                                setTimeout(() => {
                                    const attachElement = typeof state?.steps[tutorialStep + 1]?.attachToObject === "string"
                                            ? document.getElementById(state?.steps[tutorialStep + 1]?.attachToObject)
                                            : state?.steps[tutorialStep + 1]?.attachToObject;

                                    if(attachElement instanceof HTMLElement) {
                                        showTutorialAtElement(attachElement, state.steps[tutorialStep + 1].dontHighlightObject);
                                    }
                                    else {
                                        setTutorialPos(null);
                                        setHighlightElementRect(null);
                                    }
                                    setTutorialStep(prev => prev + 1);
                                }, nextCommand != null ? state?.steps[tutorialStep + 1].waitFor ?? TIMEOUT_OVERLAY_WAIT_FOR_COMMAND_EXECUTION_MS : 0);
                            }
                            else {
                                const nextCommand = state.completeCommand ?? null;
                                setState(prev => ({...prev, currentCommand: nextCommand, steps: []}));
                            }
                        }}
                        ref={proceedButtonRef}
                        type="button"
                        className={"px-4 py-2 bg-blue-600 text-white rounded " + (tutorialStep > 0 ? "overlay-essentials-proceed-button" : "overlay-essentials-complete-button")}>
                        {tutorialStep < state.steps.length - 1 ? (state?.proceedButtonText ?? "Weiter") : (state?.completeButtonText ?? "Abschließen")}
                    </button>
                </div>
            </div>
        </div> : null;
}