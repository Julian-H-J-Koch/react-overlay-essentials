// Restricts input for the given textbox (HTMLElement) to the given inputFilter ((string) => bool) function.
// Shows the given errorMessage (string) when inputFilter returns false
export function setInputFilter(textbox, inputFilter, errMsg) {
    [ "input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout" ].forEach(function(event) {
        if(textbox) {
            textbox.addEventListener(event, function(e) {
                const target = e.currentTarget;
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