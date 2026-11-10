# react-overlay-essentials
## EN:
A small collection of useful tools, which can be used out of the box. All included overlays can be opened as reaction on something by calling the appropriate setState hooks, after interaction they close automatically.
- [ConfirmationBox]: An Overlay with a ConfirmationBox (Proceed / Cancel),
- [InfoOverlay]: A simpel Overlay with an Informationbox, which can be confirmed,
- [InfoOverlayWithInput]: An Overlay with an input field that the user can put information into,
- [LoadingOverlay]: A simple Overlay with a loading-animation and optional loading text,
- [MultipleChoiceOverlay]: A simple Overlay with multiple-choice options for the user to choose from,
- [MultipleRadioOverlay]: A simple Overlay with radio buttons for the user to choose exactly one,
- [TutorialOverlay]: A simple Overlay for step by step tutorials or guided tours in which for each step a highlighted element and commands can be defined which are executed when entering the step (e.g. for switching between views),
- [Toast]: A simple Toast that appears on the screen in green on the top right,
- [ToggleSwitch]: A choice between two options in the appearence (Option 1 | Option 2),
- [Dropdown]: A simplified Dropdown-menu (on the basis of react-select), a little simpler to configure and has some default-configurations,
- [InputFilter]: A Tool which can be used to apply a Regex-Filter on an Inputfield to only allow specific user inputs.

## DE: 
Eine kleine Ansammlung an praktischen Tools, die out of the Box genutzt werden können. Alle enthaltenen Overlays können als Reaktion auf etwas geöffnet werden und schließen sich danach automatisch. Es beinhaltet:
- [ConfirmationBox]: Ein Overlay mit einer ConfirmationBox (Fortfahren / Abbrechen),
- [InfoOverlay]: ein simples Overlay mit einer Informationsbox die man bestätigen kann,
- [InfoOverlayWithInput]: Ein Overlay bei dem ein User zusätzlich ein Freitext-Feld zur Eingabe hat,
- [LoadingOverlay]: Ein simples Overlay mit einer Lade-animation und optionalem Ladetext,
- [MultipleChoiceOverlay]: Ein simples Overlay bei dem ein Nutzer aus mehreren gegebenen Aktionen auswählen kann,
- [MultipleRadioOverlay]: Ein simples Overlay bei dem ein Nutzer genau eine aus mehreren gegebenen Aktionen auswählen kann,
- [TutorialOverlay]: Ein simples Overlay für step-by-step Tutorials oder Guided Tours bei denen in jedem Schritt ein Element hervorgehoben werden kann und Commands übergeben werden können, die beim betreten des Schritts ausgeführt werden (z.B. um zwischen Sichten zu wechseln),
- [Toast]: Ein simpler Toast der für kurze Zeit grün hinterlegt in der oberen rechten Ecke des Bildschirms angezeigt wird,
- [ToggleSwitch]: Eine Auswahl aus zwei Optionen aus denen ein Nutzer wählen kann in der Darstellung (Option 1 | Option 2),
- [Dropdown]: Ein simples Dropdown-Menü (auf Basis von react-select), welches einfacherer zu Konfigurieren ist und einige default-Einstellungen hat,
- [InputFilter]: Ein Tool was genutzt werden kann um auf einem Inputfeld einen Regex-Filter anzuwenden und dem User so nur Eingaben erlaubt die dem Filter entsprechen.

## Examples:
{
    import { useState } from "react";
    import { ConfirmationBox } from 'react-overlay-essentials';
    ...

    function App(...) {
        ...
        const [stateConfirmationBox, setStateConfirmationBox] = useState(null);
        ...
        function handleLicenseAgreement() {

        }
        ...
        return <div id="root">
            <ConfirmationBox state={stateConfirmationBox} setState={setStateConfirmationBox} />
            ...
            <button onClick={() => {
                setStateConfirmationBox({
                    headline: "Are you sure?",
                    message: "Do you want to accept the License agreement?",
                    proceedButtonText: "Agree",
                    cancelButtonText: "Decline",
                    handlerOk: handleLicenseAgreement
                })
            }}>
                Confirm License
            </button>
        </div>;
    }
}