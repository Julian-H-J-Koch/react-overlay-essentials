import { useEffect, useState } from 'react';
import * as React from 'react';
import './Toast.css'

// Zeigt einen kleinen Toast in der oberen rechten Ecke an, der nach 2,5 Sekunden wieder verschwindet
function Toast({ state, setState }: { state: string, setState: (value: string) => void }) : React.ReactElement {
    // Wird verwendet um die Toast-Notification ein-/auszublenden
    const [showToast, setShowToast] = useState(false);
    // Wird verwendet um den Inhalt der Toast-Notification zu bestimmen
    const [toastContent, setToastContent] = useState("");

    useEffect(() => {
        setToastContent(state)
    }, [state]);

    useEffect(() => {
        if (toastContent && toastContent !== "") {
            setShowToast(true);
            setTimeout(() => { setState(""); }, 2500); // Hinweis nach 2,5 Sekunden wieder ausblenden
        }
        else {
            setShowToast(false);
        }
    }, [toastContent, setState]);

    return <>
        {showToast && (
            <div className="toast-notification">
                {toastContent}
            </div>)}
    </>
}

export default Toast;