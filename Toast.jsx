import { useEffect, useState } from 'react';
import './Toast.css'

// Zeigt einen kleinen Toast in der oberen rechten Ecke an, der nach 2,5 Sekunden wieder verschwindet
export function Toast({ state, setState }) {
    // Wird verwendet um die Toast-Notification ein-/auszublenden
    const [showToast, setShowToast] = useState(false);
    // Wird verwendet um den Inhalt der Toast-Notification zu bestimmen
    const [toastContent, setToastContent] = useState(null);

    useEffect(() => {
        setToastContent(state)
    }, [state]);

    useEffect(() => {
        if (toastContent && toastContent !== "") {
            setShowToast(true);
            setTimeout(() => { setState(null); }, 2500); // Hinweis nach 2,5 Sekunden wieder ausblenden
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