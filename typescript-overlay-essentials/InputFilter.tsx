// Restricts input for the given textbox to the given inputFilter function.
export function setInputFilter(textbox: HTMLElement | undefined, inputFilter: (value: string) => boolean, errMsg: string) : void {
    [ "input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout" ].forEach(function(event) {
        if(textbox) {
            textbox.addEventListener(event, function(e: Event) {
                const target = e.currentTarget as HTMLInputElement;
                if (inputFilter(target.value)) {
                    // Accepted value.
                    if ([ "keydown", "mousedown", "focusout" ].indexOf(e.type) >= 0){
                    target.classList.remove("input-error");
                    target.setCustomValidity("");
                    }

                    target.dataset.oldValue = target.value;
                    target.dataset.oldSelectionStart = target.selectionStart?.toString() ?? "";
                    target.dataset.oldSelectionEnd = target.selectionEnd?.toString() ?? "";
                }
                else if (target.dataset.oldValue !== undefined) {
                    // Rejected value: restore the previous one.
                    target.classList.add("input-error");
                    target.setCustomValidity(errMsg);
                    target.reportValidity();
                    target.setAttribute("aria-invalid", "true");
                    target.value = target.dataset.oldValue;
                    const start = target.dataset.oldSelectionStart ? parseInt(target.dataset.oldSelectionStart) : 0;
                    const end = target.dataset.oldSelectionEnd ? parseInt(target.dataset.oldSelectionEnd) : start;
                    target.setSelectionRange(start, end);
                }
                else {
                    // Rejected value: nothing to restore.
                    target.value = "";
                }
            });
        }
    });
    }