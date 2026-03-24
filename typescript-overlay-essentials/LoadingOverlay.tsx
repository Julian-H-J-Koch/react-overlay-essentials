import { useEffect, useState, ReactElement } from 'react';
import * as React from 'react';
import './LoadingOverlay.css';

// Um das LoadingOverlay zu nutzen, muss der State die folgende Struktur haben:
export interface LoadingOverlayState {
    isActive?: boolean;
    message?: string | undefined;
    color?: string | undefined;
    showSuccess?: boolean | undefined;
}

// Der standard LoadingOverlay Status, der zur Initialisierung genutzt werden kann
export const defaultLoadingOverlayState: LoadingOverlayState = {
    isActive: false,
    message: undefined,
    color: undefined,
    showSuccess: undefined,
};

// Wobei alle Attribute grundsätzlich optional sind:
// - isActive: gibt an ob das Overlay gerade aktiv sein soll oder nicht
// - message: ist die angezeigte Nachricht
// - color: ist dir Farbe des Loading icons (ohne Angabe HSD rot)
// - showSuccess: zeigt bei "true" ein grünes Häkchen an und bei "false" ein rot hinterlegtes X. Bei "undefined" wird die normale Ladeanimation gezeigt.

export function LoadingOverlay({ state, setState }: { state: LoadingOverlayState, setState: (state: LoadingOverlayState) => void }): ReactElement {
    // Wird verwendet um das LoadingOverlay ein- und auszublenden
    const [showOverlay, setShowOverlay] = useState(false);

    // Sobald der State von außen aktualisiert wird triggert diese Funktion
    // Die setzt showOverlay auf true
    useEffect(() => {
        if (state?.isActive) {
            setShowOverlay(true);
        }
        else {
            setState(defaultLoadingOverlayState);
            setShowOverlay(false);
        }
    }, [state, setState]);
    
    return showOverlay ? (
        <div className="loading-overlay">
            <div className="loading-box">
                <div className={"spinner " + (state.showSuccess === undefined ? "is-loading" : (state.showSuccess ? "is-success" : "is-error"))}
                    style={{
                        "--spinner-color": state.color ?? "#e60028",
                        "--success-bg": state.color ?? "#42ab34",
                        "--error-bg": state.color ?? "#e60028",
                    } as React.CSSProperties }
                />
                {state.message && <p className="loading-message">{state.message}</p>}
            </div>
        </div>
    ) : <></>;
}