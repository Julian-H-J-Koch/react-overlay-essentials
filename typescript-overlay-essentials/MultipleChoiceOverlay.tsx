import { useEffect, useState, CSSProperties } from 'react';
import './MultipleChoiceOverlay.css';


// Um das MultipleChoiceOverlay zu nutzen, muss der State die folgende Struktur haben:
export interface MultipleChoiceOverlayState {
    headline?: string | undefined;
    message?: string | undefined;
    choices: string[] | [];
    preInput?: string[] | undefined;
    cancelButtonText?: string | undefined;
    proceedButtonText?: string | undefined;
    handlerOk?: ((userInput: string[], args?: unknown) => void) | undefined;
    handlerCancel?: ((args?: unknown) => void) | undefined;
    handlerArgs?: unknown;
    addCloseButton?: boolean | undefined;
    proceedButtonStyle?: CSSProperties | undefined;
    cancelButtonStyle?: CSSProperties | undefined;
}

// Der standard MultipleChoiceOverlay Status, der zur Initialisierung genutzt werden kann
export const defaultMultipleChoiceState: MultipleChoiceOverlayState = {
    headline: undefined,
    message: undefined,
    choices: [],
    preInput: undefined,
    cancelButtonText: undefined,
    proceedButtonText: undefined,
    handlerOk: undefined,
    handlerCancel: undefined,
    handlerArgs: undefined,
    addCloseButton: false,
    proceedButtonStyle: undefined,
    cancelButtonStyle: undefined,
};

// Wobei alle Attribute grundsätzlich optional sind:
// - headline: ist die Überschrift und wird fett hinterlegt
// - message: ist die angezeigte Nachricht
// - choices: Ein String-Array mit den Optionen die ausgewählt werden können (ohne Angabe gibt es keine Auswahl)
// - preInput: Ein String-Array: Die Einträge sind stadardmäßig ausgewählt alle anderen nicht ausgewählt
// - cancelButtonText: ist der Text der auf dem Cancel Button stehen soll (ohne Angabe wird "Abbrechen" verwendet)
// - proceedButtonText: ist der Text der auf dem Proceed Button stehen soll (ohne Angabe wird "OK" verwendet)
// - handlerOk: ist die Funktion die bei Bestätigung des Inputs ausgeführt wird (Struktur: handlerOk(userInput, handlerArgs)
// - handlerCancel: ist die Funktion die bei Ablehnung des Inputs ausgeführt wird (Struktur: handlerCancel(handlerArgs)
// - handlerArgs: kann im handler als Argumente genutzt werden
// - addCloseButton: boolscher Wert, der angibt, ob ein x oben rechts als close-Button verfügbar sein soll (bricht die Aktion ohne handler ab, standardmäßig false)
// - proceedButtonStyle: ist der Style des Bestätigungsbuttons (Standardmäßig unverändert)
// - cancelButtonStyle: ist der Style des Abbrechenbuttons (Standardmäßig unverändert)

// Output: Der Input vom User wird am Ende an den handlerOk übergeben (oder bei handlerCancel ignoriert)!
// Somit wird der handler so aufgerufen: handlerOk(UserInput, handlerArgs) oder handlerCancel(handlerArgs)
export function MultipleChoiceOverlay({ state, setState }: { state: MultipleChoiceOverlayState, setState: (state: MultipleChoiceOverlayState) => void }): React.ReactElement {

    // Wird verwendet um das Infoverlay ein- und auszublenden
    const [showOverlay, setShowOverlay] = useState(false);

    // Wird verwendet um die ausgewählten Choices aktuell zu halten
    const [input, setInput] = useState<string[]>([]);

    // Sobald der State von außen aktualisiert wird triggert diese Funktion
    // Die setzt showOverlay auf true
    useEffect(() => {
        if (state?.message != null || state?.headline != null) {
            setInput(state?.preInput != null ? state.preInput : []);
            setShowOverlay(true);
            setTimeout(() => { document.getElementById("confirmButton")?.focus(); }, 1);
        }
    }, [state]);

    // Toggled die Auswahl eines Choices
    // Setzt dafür den aktuellen Input auf den neuen Input + Choice
    const toggle = (choice : string) : void => {
        if (input.includes(choice)) {
            setInput(input.filter(item => item !== choice)); // Entfernt den Choice wenn er schon ausgewählt ist
        }
        else {
            setInput([...input, choice]); // Fügt den Choice hinzu wenn er noch nicht ausgewählt ist
        }
    }

    const handleAction = (
        handler: ((args?: unknown) => void) | ((userInput: string[], args?: unknown) => void) | undefined,
        useInput: boolean
    ): void => {
        setShowOverlay(false);
        var tempState = {
            handler: handler,
            handlerArgs: state.handlerArgs
        };
        setState(defaultMultipleChoiceState);
        if (typeof tempState.handler === 'function' && useInput)
            (tempState.handler as ((userInput: string[], args?: unknown) => void))(input, tempState.handlerArgs);
        else if (typeof tempState.handler === 'function')
            (tempState.handler as ((args?: unknown) => void))(tempState.handlerArgs);
    }

    return showOverlay ?
        <div className="multiplechoice-overlay">
            <div className="multiplechoice-box">
                {state.addCloseButton?
                    <span className="closeButton">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            tabIndex={0}
                            className="close-icon"
                            onClick={() => handleAction(undefined, false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault(); // Verhindert Scroll bei Space
                                    handleAction(undefined, false);
                                }
                            }}
                            role="button" aria-label="Dialog schließen"
                            width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </span> : 
                <></>}
                <p className="headline" id="theHeadline" tabIndex={0} style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}><strong>{state?.headline != null ? state.headline : ""}</strong></p>
                <p tabIndex={0} style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>{state?.message != null ? state.message : ""}</p>
                <div className="choices-input">
                    <div className="choices-container">
                        {state?.choices.map(choice => (
                            <label className="choice-label" key={choice}>
                                <input
                                    type="checkbox"
                                    checked={input.includes(choice)}
                                    onChange={() => toggle(choice)}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault(); // Verhindert Scroll bei Space
                                            toggle(choice);
                                        }
                                    }}
                                />
                                {choice}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="information-buttons">
                    <button onClick={() => handleAction(state.handlerCancel, false)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === ' ') {
                                event.preventDefault(); // Verhindert Scroll bei Space
                                handleAction(state.handlerCancel, false);
                            }
                        }}
                        className="px-4 py-2 bg-gray-300 rounded"
                        style={state?.cancelButtonStyle != null ? state.cancelButtonStyle : {}}>
                        {state?.cancelButtonText != null ? state.cancelButtonText : "Abbrechen"}
                    </button>
                    <button onClick={() => handleAction(state.handlerOk, true)}
                        id="confirmButton"
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === ' ') {
                                event.preventDefault(); // Verhindert Scroll bei Space
                                handleAction(state.handlerOk, true);
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        style={state?.proceedButtonStyle != null ? state.proceedButtonStyle : {}}>
                        {state?.proceedButtonText != null ? state.proceedButtonText : "OK"}
                    </button>
                </div>
            </div>
        </div> : <></>;
}