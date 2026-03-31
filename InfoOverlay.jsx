import { useEffect, useState } from 'react';
import './InfoOverlay.css';

// Um das InfoOverlay zu nutzen, muss der State die folgende Struktur haben:
const defaultInformationState = {
    headline: null,
    message: null,
    proceedButtonText: null,
    handler: null,
    handlerArgs: null,
    addCloseButton: false,
    style: null,
};

// Wobei alle Attribute grundsätzlich optional sind:
// - headline: ist die Überschrift und wird fett hinterlegt
// - message: ist die angezeigte Nachricht
// - proceedButtonText: ist der Text der auf dem Procceed Button stehen soll (ohne Angabe wird "OK" verwendet)
// - handler: Funktion, die optional beim Bestätigen ausgeführt werden kann (Struktur: handler(args))
// - handlerArgs: kann im handler als Argumente genutzt werden
// - addCloseButton: boolscher Wert, der angibt, ob ein x oben rechts als close-Button verfügbar sein soll (bricht die Aktion ohne handler ab, standardmäßig false)
// - style: ist der Style der Information-Box (Standardmäßig unverändert)

export function InfoOverlay({ state, setState }) {

    // Wird verwendet um das Infoverlay ein- und auszublenden
    const [showOverlay, setShowOverlay] = useState(false);

    // Sobald der State von außen aktualisiert wird triggert diese Funktion
    // Die setzt showOverlay auf true
    useEffect(() => {
        if (state?.message != null || state?.headline != null) {
            setShowOverlay(true);
            setTimeout(() => { document.getElementById("infoButton").focus(); }, 5);
        }
    }, [state]);

    const handleAction = () => {
        setShowOverlay(false);
        var tempState = {
            handler: state.handler,
            handlerArgs: state.handlerArgs
        };
        setState(defaultInformationState);
        if (typeof tempState.handler === 'function')
            tempState.handler(tempState.handlerArgs);
    }

    return showOverlay ?
        <div className="information-overlay"
            tabIndex={0}>
            <div className="information-box" style={state?.style != null ? state.style : {}}>
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
                            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </span> : 
                <></>}
                <p className="headline" tabindex="0" style={{ whiteSpace: "pre-line" }}><strong>{state?.headline != null ? state.headline : ""}</strong></p>
                <p tabindex="0" style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>{state?.message != null ? state.message : ""}</p>
                <div className="information-buttons">
                    <button onClick={() => handleAction()}
                        onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault(); // Verhindert Scroll bei Space
                                    handleAction();
                                }
                            }}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        id = "infoButton">
                        {state?.proceedButtonText != null ? state.proceedButtonText : "OK"}
                    </button>
                </div>
            </div>
        </div> : null;
}