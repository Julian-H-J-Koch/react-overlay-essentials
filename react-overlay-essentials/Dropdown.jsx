import { useEffect, useState } from 'react';
import Select  from 'react-select'
import './Dropdown.css';

// Attribute vom Dropdown:
// - selections: Das Array mit den Optionen die zur Auswahl stehen sollen. Die Optionen müssen folgende Struktur haben:
//      - value: Der Wert, der bei Auswahl gesetzt werden soll
//      -> Dabei kann es sich um komplexe Objekte handeln, diese müssen dann ein Attribut id haben, mithilfe derer sie verglichen werden!
//      - label: Der String, der in der Auswahl angezeigt werden soll
//      - disabled: Kann auf true gesetzt werden, wenn diese Option nicht zur Auswahl verfügbar sein soll
//      - indent: Eine Zahl größer 0, kann angegeben werden, wenn die Option mit so vielen Strichen eingerückt werden soll (nur im Auswahlmenü)
// - value: Der Wert, der ausgewählt angezeigt werden soll (useState)
// - onChange: Die Funktion die bei Änderung ausgeführt werden soll.
//             Standardmäßig könnte z.B. {(value) => {value ? setValue(value) : setValue("")}} genutzt werden, wenn es sich bei value um einen String handelt
// - maxMenuHeight: Maximale Menühöhe in Pixeln (Optional)
// - menuPlacement: Ob das Menü oben oder unten platziert sein soll (Optional, Standard: Auto)
// - width: Breite des Menüs als CSS Property (Optional)
// - placeHolder: Der Platzhalter der angezeigt wird, wenn noch nichts ausgewählt ist (Optional)
// - defaultValue: Die Auswahl die von Anfang an ausgewählt ist (Optional) (sollten mehrere Werte übergeben werden, wird "isMulti" automatisch gesetzt)
// - isMulti: Ob mehrere Optionen gleichzeitig ausgewählt werden können (Optional)
// - cardColorVariant: Wenn auf true gesetzt, wird eine leicht andere Farbvariante gewählt
// - ignoreDarkMode: Wenn auf true gesetzt wird der DarkMode ignoriert, der sonst standardmäßig angewendet wird
// - ...rest (Optional): sorgt dafür, dass alle weiteren angegebenen Attribute (z.B. aria-label) direkt an React-Select weitergegeben werden

export function Dropdown({selections, value, onChange, maxMenuHeight, menuPlacement, width, placeHolder, defaultValue, isMulti, cardColorVariant = false, ignoreDarkMode = false, ...rest}) {        
        const options = selections.map(({value, label, disabled, indent}) => ({value: value, label: label, isDisabled: disabled ?? false, indent}));
        
        function usePrefersDarkMode() {
        const [isDarkMode, setIsDarkMode] = useState(
            window.matchMedia('(prefers-color-scheme: dark)').matches
        );

        useEffect(() => {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (event) => setIsDarkMode(event.matches);
            
            // EventListener hinzufügen
            mediaQuery.addEventListener('change', handler);

            // Aufräumen
            return () => mediaQuery.removeEventListener('change', handler);
        }, []);

        return isDarkMode;
        }
        const isDarkModeRaw = usePrefersDarkMode()
        const isDarkMode = ignoreDarkMode ? false : isDarkModeRaw;

        return (
            <Select
                className = "custom-select" 
                placeholder = {placeHolder ?? ""}
                options = {options}
                value={
                        (isMulti || Array.isArray(value)) ?
                        options[0].value.id ? // Wenn die values der Optionen ids haben, handelt es sich um komplexe Objekte, die zur Auswahl stehen und müssen dahingehend verglichen werden
                            options.filter(opt => (opt.value.id && value.find(val => val.id === opt.value.id))) // Dann alle Optionen, die in den values per id vorkommen
                            : options.filter(opt => (value.includes(opt.value))) // Ansonsten einfach alle Optionen, die in den values vorkommen
                        : options[0].value.id ? // Wenn die values der Optionen ids haben, handelt es sich um komplexe Objekte, die zur Auswahl stehen und müssen dahingehend verglichen werden
                            options.find(opt => opt.value.id === value.id) // Die eine Option mit der passenden id finden
                            : options.find(opt => opt.value === value)} // Ohne Multi oder id nur die eine Option finden
                onChange={(selectedOption) => Array.isArray(selectedOption) ? onChange(selectedOption.map(opt => opt.value)) : onChange(selectedOption?.value ?? undefined)}
                maxMenuHeight={maxMenuHeight ?? 280}
                menuPlacement={menuPlacement ?? "auto"}
                menuPosition="fixed"
                isMulti={isMulti || Array.isArray(defaultValue)}
                defaultValue={defaultValue}
                classNamePrefix="dropdown"
                formatOptionLabel={({ label, indent },{ context }) => {
                    if (context === 'menu') {
                        // Alle mit indent angegebenen Werte im Dropdown-Menü einrücken
                        return  indent && indent > 0 ? '-'.repeat(indent) + '\u00A0' + label : label;
                    } else {
                        // Im ausgewählten Zustand: normal
                        return label;
                    }
                }}
                styles={{
                    container: (provided) => ({
                        ...provided,
                        backgroundColor: isDarkMode? (cardColorVariant ? 'var(--FastSchwarz, black)' : 'black') : cardColorVariant ? 'var(--FastWeiß, white)' : 'white',
                        color: isDarkMode? 'white' : 'black',
                        ...(width ? { width } : {})
                    }),
                    control: () => ({
                        display: 'flex',
                        ...(width ? { width } : {})
                    }),
                    menu: (provided) => ({
                        ...provided,
                        borderRadius: '8px', // runde Ecken für das Dropdown
                        overflow: 'hidden',
                        backgroundColor: isDarkMode? (cardColorVariant ? 'var(--FastSchwarz, black)' : 'black') : cardColorVariant ? 'var(--FastWeiß, white)' : 'white',
                        color: isDarkMode? 'white' : 'black',
                        ...(width ? { width } : {})
                    }),
                    menuList: (provided) => ({
                        ...provided,
                        overflowY: "auto",
                        padding: 0,
                        backgroundColor: isDarkMode? (cardColorVariant ? 'var(--FastSchwarz, black)' : 'black') : cardColorVariant ? 'var(--FastWeiß, white)' : 'white',
                        color: isDarkMode? 'white' : 'black',
                    }),
                    menuPortal: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isFocused ? 'var(--DunkelAkzent, red)' : state.isSelected ? 'var(--MittelAkzent, blue)' : 
                            isDarkMode? (cardColorVariant ? 'var(--FastSchwarz, black)' : 'black') : cardColorVariant ? 'var(--FastWeiß, white)' : 'white',
                        color: state.isFocused ? 'white' : state.isSelected ? 'var(--FastSchwarz, black)' :
                            isDarkMode? (cardColorVariant ? 'white' : 'white') : cardColorVariant ? 'black' : 'var(--FastSchwarz, black)',
                        cursor: 'pointer',
                    }),
                }}
                {...rest}
            />
        );
    }