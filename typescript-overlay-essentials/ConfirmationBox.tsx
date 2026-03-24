import { useEffect, useState, useRef, CSSProperties } from 'react';
import * as React from 'react';
import './ConfirmationBox.css';

// Um die ConfirmationBox zu nutzen, muss der State die folgende Struktur haben:
export interface ConfirmationBoxState {
    headline?: string | undefined;
    message?: string | undefined;
    message1?: string | undefined;
    message2?: string | undefined;
    cancelButtonText?: string | undefined;
    proceedButtonText?: string | undefined;
    handlerOk?: ((args?: unknown) => void) | undefined;
    handlerCancel?: ((args?: unknown) => void) | undefined;
    handlerArgs?: unknown;
    addCloseButton?: boolean | undefined;
    activateConfirm?: boolean | undefined;
    proceedButtonStyle?: CSSProperties | undefined;
    cancelButtonStyle?: CSSProperties | undefined;
}

// Der standard ComfirmationBox Status, der zur Initialisierung genutzt werden kann
export const defaultConfirmationState: ConfirmationBoxState = {
    headline: undefined,
    message: undefined,
    message1: undefined,
    message2: undefined,
    cancelButtonText: undefined,
    proceedButtonText: undefined,
    handlerOk: undefined,
    handlerCancel: undefined,
    handlerArgs: undefined,
    addCloseButton: false,
    activateConfirm: undefined,
    proceedButtonStyle: undefined,
    cancelButtonStyle: undefined,
};

// Wobei alle Attribute grundsätzlich optional sind:
// - headline: Eine fett hinterlegte Überschrift (optional)
// - message1: ist die angezeigte Nachricht
// - message2: ist optional und wird fett hinterlegt (z.B. ein wichtiger Hinweis oder ähnliches)
// - message: ist optional und wird nur angezeigt, wenn message1 nicht gesetzt ist (damit message oder message1 genutzt werden kann)
// - cancelButtonText: ist der Text der auf dem Cancel Button stehen soll (ohne Angabe wird "Abbrechen" verwendet)
// - proceedButtonText: ist der Text der auf dem Proceed Button stehen soll (ohne Angabe wird "OK" verwendet)
// - handlerOk: ist die Funktion die bei Bestätigung der Box ausgeführt wird (nutzt handlerargs, erwartet also nur 1 Argument!)
// - handlerCancel: ist die Funktion die bei Ablehnung der Box ausgeführt wird (nutzt handlerargs, erwartet also nur 1 Argument!)
// - addCloseButton: boolscher Wert, der angibt, ob ein x oben rechts als close-Button verfügbar sein soll (bricht die Aktion ohne handler ab, standardmäßig false)
// - handlerArgs: kann im handler als weitere Argumente genutzt werden
// - activateConfirm: ist ein Boolean, der angibt ob die ConfirmationBox angezeigt werden soll oder nicht (wenn false, wird direkt handlerOk aufgerufen) (Standardmäßig true wenn nicht anders angegeben)
// - proceedButtonStyle: ist der Style des Bestätigungsbuttons (Standardmäßig unverändert)
// - cancelButtonStyle: ist der Style des Abbrechenbuttons (Standardmäßig unverändert)

export function ConfirmationBox({ state, setState }: { state: ConfirmationBoxState, setState: (state: ConfirmationBoxState) => void }): React.ReactElement {

    // Wird verwendet um die Confirmation Boxen ein- und auszublenden
    const [showConfirm, setShowConfirm] = useState(false);

    // Damit der Fokus auf die Confirmation Box gesetzt wird, wenn sie geöffnet wird
    // Und man sie mit Enter bestätigen kann
    const overlayRef = useRef<HTMLDivElement>(null);

    // Sobald der State von außen aktualisiert wird triggert diese Funktion
    // Die setzt showConfirm auf true (oder ruft die übergebene Funktion auf wenn confirmationBoxen disabled sind)
    useEffect(() => {
        if (state?.handlerOk) {
            if (state.activateConfirm ?? true) {
                setShowConfirm(true);
                setTimeout(() => { document.getElementById("confirmButton")?.focus(); }, 1);
            }
            else {
                // Wenn activateConfirm explizit false ist, dann wird die übergebene Funktion direkt ausgeführt ohne ConfirmationBox
                if (typeof state.handlerOk === 'function')
                    state.handlerOk(state.handlerArgs);
            }
        }
        setTimeout(() => {
            overlayRef.current?.focus();
        }, 0);
    }, [state]);

    const handleAction = (handler: ((args?: unknown) => void) | undefined) : void => {
        setShowConfirm(false);
        const tempState = {
            handler: handler,
            handlerArgs: state.handlerArgs
        };
        setState(defaultConfirmationState);
        if (typeof tempState.handler === 'function')
            tempState.handler(tempState.handlerArgs);
    }

    return showConfirm ?
        <div className="confirmation-overlay"
            tabIndex={0}
            ref={overlayRef}>
            <div className="confirmation-box">
                {state.addCloseButton?
                    <span className="closeButton">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            tabIndex={0}
                            className="close-icon"
                            onClick={() => handleAction(undefined)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault(); // Verhindert Scroll bei Space
                                    handleAction(undefined);
                                }
                            }}
                            role="button" aria-label="Dialog schließen"
                            width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </span> : 
                <></>}
                {state?.headline !== undefined ? <p className="headline" style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}><strong>{state?.headline}</strong></p> : <></>}
                <p style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>{state.message1 ?? state.message ?? ""}</p>
                <p style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}><strong>{state.message2 ?? ""}</strong></p>
                <div className="confirmation-buttons">
                    <button
                        onClick={() => handleAction(state.handlerCancel)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault(); // Verhindert Scroll bei Space
                                handleAction(state.handlerCancel);
                            }
                        }}
                        className="px-4 py-2 bg-gray-300 rounded"
                        style={state?.cancelButtonStyle !== undefined ? state.cancelButtonStyle : {}}>
                        {state.cancelButtonText ? state.cancelButtonText : "Abbrechen"}
                    </button>
                    <button onClick={() => handleAction(state.handlerOk)}
                        id="confirmButton"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault(); // Verhindert Scroll bei Space
                                handleAction(state.handlerOk);
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        style={state?.proceedButtonStyle !== undefined ? state.proceedButtonStyle : {}}>
                        {state.proceedButtonText ? state.proceedButtonText : "OK"}
                    </button>
                </div>
            </div>
        </div> : <></>;
}