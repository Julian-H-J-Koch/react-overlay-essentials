import { useEffect, useState } from 'react';
import './InfoOverlayWithInput.css';


// Um das InfoOverlayWithInput zu nutzen, muss der State die folgende Struktur haben:
const defaultInformationState = {
    headline: null,
    message: null,
    preInput: null,
    placeholder: null,
    cancelButtonText: null,
    proceedButtonText: null,
    handlerOk: null,
    handlerCancel: null,
    handlerArgs: null,
    addCloseButton: false,
    proceedButtonStyle: null,
    cancelButtonStyle: null,
};
// Wobei alle Attribute grundsätzlich optional sind:
// - headline: ist die Überschrift und wird fett hinterlegt
// - message: ist die angezeigte Nachricht
// - preInput: Beinhaltet den Text der schon vorher im Inputfield stehen soll (ohne Angabe wird nichts angezeigt)
// - placeholder: Was bei leerem Inputfield als Platzhalter angezeigt wird (ohne Angabe wird nichts angezeigt)
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
export function InfoOverlayWithInput({ state, setState }) {

    // Wird verwendet um das Infoverlay ein- und auszublenden
    const [showOverlay, setShowOverlay] = useState(false);

    // Wird verwendet um den Inhalt des InputFields aktuell zu halten
    const [input, setInput] = useState("");

    // Sobald der State von außen aktualisiert wird triggert diese Funktion
    // Die setzt showOverlay auf true
    useEffect(() => {
        if (state?.message != null || state?.headline != null) {
            setInput(state?.preInput != null ? state.preInput : "");
            setShowOverlay(true);
            setTimeout(() => { document.getElementById("information-inputfield").focus(); }, 1);
        }
    }, [state]);

    // Sorgt dafür, dass die Eingabe beim tippen aktualisiert wird
    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    // Sorgt dafür, dass auch bei Enter bestätigt wird
    const handleInputKeyDown = (event) => {
        if (event.key === "Enter") {
            handleAction(state.handlerOk, true);
        }
    };

    const handleAction = (handler, useInput) => {
        setShowOverlay(false);
        var tempState = {
            handler: handler,
            handlerArgs: state.handlerArgs
        };
        setState(defaultInformationState);
        if (typeof tempState.handler === 'function' && useInput)
            tempState.handler(input, tempState.handlerArgs);
        else if (typeof tempState.handler === 'function')
            tempState.handler(tempState.handlerArgs);
    }

    return showOverlay ?
        <div className="information-overlay-with-input">
            <div className="information-box-with-input">
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
                            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </span> : 
                <></>}
                <p className="headline" style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}><strong>{state?.headline != null ? state.headline : ""}</strong></p>
                <p style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>{state?.message != null ? state.message : ""}</p>
                <div className="information-input">
                    <input
                        id="information-inputfield"
                        placeholder={state?.placeholder != null ? state.placeholder : ""}
                        pattern="^[A-Za-z0-9_-~]+$"
                        required={true}
                        type="text"
                        className="form-control"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        tabIndex="0"
                    ></input>
                </div>
                <div className="information-buttons">
                    <button onClick={() => handleAction(state.handlerCancel, false)}
                        className="px-4 py-2 bg-gray-300 rounded"
                        style={state?.cancelButtonStyle != null ? state.cancelButtonStyle : {}}
                        tabIndex="0"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault(); // Verhindert Scroll bei Space
                                handleAction(state.handlerCancel, false);
                            }
                        }}>
                        {state?.cancelButtonText != null ? state.cancelButtonText : "Abbrechen"}
                    </button>
                    <button onClick={() => handleAction(state.handlerOk, true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        style={state?.proceedButtonStyle != null ? state.proceedButtonStyle : {}}
                        tabIndex = "0">
                        {state?.proceedButtonText != null ? state.proceedButtonText : "OK"}
                    </button>
                </div>
            </div>
        </div> : null;
}