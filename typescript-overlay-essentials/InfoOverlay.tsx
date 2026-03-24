import { useEffect, useState, CSSProperties } from 'react';
import * as React from 'react';
import './InfoOverlay.css';

// Um das OnfoOverlay zu nutzen, muss der State die folgende Struktur haben:
export interface InfoOverlayState {
    headline?: string | undefined;
    message?: string | undefined;
    proceedButtonText?: string | undefined;
    handler?: ((args?: unknown) => void) | undefined;
    handlerArgs?: unknown;
    addCloseButton?: boolean | undefined;
    style?: CSSProperties | undefined;
}

// Der standard InfoOverlay Status, der zur Initialisierung genutzt werden kann
export const defaultInfoOverlayState: InfoOverlayState = {
    headline: undefined,
    message: undefined,
    proceedButtonText: undefined,
    handler: undefined,
    handlerArgs: undefined,
    addCloseButton: false,
    style: undefined,
};

// Wobei alle Attribute grundsätzlich optional sind:
// - headline: ist die Überschrift und wird fett hinterlegt
// - message: ist die angezeigte Nachricht
// - proceedButtonText: ist der Text der auf dem Procceed Button stehen soll (ohne Angabe wird "OK" verwendet)
// - handler: Funktion, die optional beim Bestätigen ausgeführt werden kann (Struktur: handler(args))
// - handlerArgs: kann im handler als Argumente genutzt werden
// - addCloseButton: boolscher Wert, der angibt, ob ein x oben rechts als close-Button verfügbar sein soll (bricht die Aktion ohne handler ab, standardmäßig false)
// - style: ist der Style der Information-Box (Standardmäßig unverändert)

export function InfoOverlay({ state, setState }: { state: InfoOverlayState, setState: (state: InfoOverlayState) => void }): React.ReactElement {

    // Wird verwendet um das Infoverlay ein- und auszublenden
    const [showOverlay, setShowOverlay] = useState(false);

    // Sobald der State von außen aktualisiert wird triggert diese Funktion
    // Die setzt showOverlay auf true
    useEffect(() => {
        if (state?.message !== undefined || state?.headline !== undefined) {
            setShowOverlay(true);
            setTimeout(() => { document.getElementById("infoButton")?.focus(); }, 5);
        }
    }, [state]);

    const handleAction = () : void => {
        setShowOverlay(false);
        const tempState = {
            handler: state.handler,
            handlerArgs: state.handlerArgs
        };
        setState(defaultInfoOverlayState);
        if (typeof tempState.handler === 'function')
            tempState.handler(tempState.handlerArgs);
    }

    return showOverlay ?
        <div className="information-overlay"
            tabIndex={0}>
            <div className="information-box" style={state?.style !== undefined ? state.style : {}}>
                {state.addCloseButton?
                    <span className="closeButton">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            tabIndex={0}
                            className="close-icon"
                            onClick={() => setShowOverlay(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault(); // Verhindert Scroll bei Space
                                    setShowOverlay(false);
                                }
                            }}
                            role="button" aria-label="Dialog schließen"
                            width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </span> : 
                <></>}
                <p className="headline" tabIndex={0} style={{ whiteSpace: "pre-line" }}><strong>{state?.headline !== undefined ? state.headline : ""}</strong></p>
                <p tabIndex={0} style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>{state?.message !== undefined ? state.message : ""}</p>
                <div className="information-buttons">
                    <button onClick={() => handleAction()}
                        onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault(); // Verhindert Scroll bei Space
                                    handleAction();
                                }
                            }}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        id="infoButton">
                        {state?.proceedButtonText !== undefined ? state.proceedButtonText : "OK"}
                    </button>
                </div>
            </div>
        </div> : <></>;
}