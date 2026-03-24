import { useRef, useEffect, useState } from 'react';
import * as React from 'react';
import Select, { SingleValue, MultiValue}  from 'react-select'
import type { CSSObject } from '@emotion/react';
import './Dropdown.css';

// Um das Dropdown Menü zu nutzen, müssen die Optionen das folgende Interface nutzen:
export interface Option<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  indent?: number;
}

// Wobei alle Attribute außer dem value und dem label optional sind:
// - value: Der Wert, der bei Auswahl gesetzt werden soll
//      -> Dabei kann es sich um komplexe Objekte handeln, diese müssen dann ein Attribut id haben, mithilfe derer sie verglichen werden!
// - label: Der String, der in der Auswahl angezeigt werden soll
// - disabled: Kann auf true gesetzt werden, wenn diese Option nicht zur Auswahl verfügbar sein soll
// - indent: Eine Zahl größer 0, kann angegeben werden, wenn die Option mit so vielen Strichen eingerückt werden soll (nur im Auswahlmenü)

// Attribute vom Dropdown:
// - selections: Das Array mit den Optionen die zur Auswahl stehen sollen
// - value: Der Wert, der ausgewählt angezeigt werden soll (useState)
// - onChange: Die Funktion die bei Änderung ausgeführt werden soll.
//             Standardmäßig könnte z.B. {(value) => {value ? setValue(value) : setValue("")}} genutzt werden, wenn es sich bei value um einen String handelt
// - maxMenuHeight: Maximale Menühöhe in Pixeln (Optional)
// - menuPlacement: Ob das Menü oben oder unten platziert sein soll (Optional, Standard: Auto)
// - width: Breite des Menüs als CSS Property (Optional)
// - placeHolder: Der Platzhalter der angezeigt wird, wenn noch nichts ausgewählt ist (Optional) (Wird auch nur angezeigt, wenn value noch keinen validen Wert hat)
// - defaultValue: Die Auswahl die von Anfang an ausgewählt ist (Optional) (sollten mehrere Werte übergeben werden, wird "isMulti" automatisch gesetzt)
// - isMulti: Ob mehrere Optionen gleichzeitig ausgewählt werden können (Optional)
//      - Daraufhin MUSS value ein Array sein und falls defaultValue angegeben ist, MUSS das auch ein Array sein
// - cardColorVariant: Wenn auf true gesetzt, wird eine leicht andere Farbvariante gewählt
// - ignoreDarkMode: Wenn auf true gesetzt wird der DarkMode ignoriert, der sonst standardmäßig angewendet wird
// - ...rest (Optional): sorgt dafür, dass alle weiteren angegebenen Attribute (z.B. aria-label) direkt an React-Select weitergegeben werden

export function Dropdown<T = string>({ selections, value, onChange, maxMenuHeight, menuPlacement, width, placeHolder, defaultValue, isMulti = false, cardColorVariant = false, ignoreDarkMode = false, ...rest} :
    {
        selections: Option<T>[],
        value: T | T[],
        onChange: (value: T | T[] | undefined) => void,
        maxMenuHeight?: number,
        menuPlacement?: "top" | "bottom",
        width?: React.CSSProperties["width"],
        placeHolder?: string,
        defaultValue?: Option<T> | Option<T>[],
        isMulti?: boolean,
        cardColorVariant?: boolean,
        ignoreDarkMode?: boolean,
    }): React.ReactElement {

        const initializedRef = useRef(false);
        
        const options = selections.map(({value, label, disabled, indent}) => ({value: value, label: label, isDisabled: disabled ?? false, indent}));

        if(!initializedRef.current && Array.isArray(value) && value.length === 0 && Array.isArray(defaultValue) && defaultValue.length > 0) {
            value = options.filter(opt => (defaultValue as Option<T>[]).map(({value}) => (value)).includes(opt.value)).map(opt => opt.value);
        } 

        function usePrefersDarkMode() : boolean {
            const [isDarkMode, setIsDarkMode] = useState(
                window.matchMedia('(prefers-color-scheme: dark)').matches
            );

            useEffect(() => {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const handler = (event: MediaQueryListEvent) : void => setIsDarkMode(event.matches);
                
                // EventListener hinzufügen
                mediaQuery.addEventListener('change', handler);

                // Aufräumen
                return () => mediaQuery.removeEventListener('change', handler);
            }, []);

            return isDarkMode;
        }
        const isDarkModeRaw = usePrefersDarkMode()
        const isDarkMode = ignoreDarkMode ? false : isDarkModeRaw;

        function hasId(value: unknown): value is { id: any } {
            return typeof value === "object" && value !== null && "id" in value;
        }

        return isMulti || Array.isArray(defaultValue) ? (
            <Select<Option<T>, true>
                className = "custom-select" 
                isMulti={true}
                placeholder = {placeHolder ?? ""}
                options = {options}
                value={options.length > 0 && hasId(options[0].value) ? // Wenn die values der Optionen ids haben, handelt es sich um komplexe Objekte, die zur Auswahl stehen und müssen dahingehend verglichen werden
                                options.filter(opt => (hasId(opt.value) && (value as T[]).find(val => hasId(val) && hasId(opt.value) && val.id ===  opt.value.id))) // Dann alle Optionen, die in den values per id vorkommen
                                : options.filter(opt => ((value as T[]).includes(opt.value))) // Ansonsten einfach alle Optionen, die in den values vorkommen
                      }
                onChange={(selectedOption: MultiValue<Option<T>>) => {initializedRef.current = true; onChange(selectedOption.map((opt: Option<T>) => opt.value))}}
                maxMenuHeight={maxMenuHeight ?? 280}
                menuPlacement={menuPlacement ?? "auto"}
                menuPosition="fixed"
                classNamePrefix="dropdown"
                defaultValue={options.filter(opt => (defaultValue as Option<T>[]).map(({value}) => (value)).includes(opt.value))}
                formatOptionLabel={({ label, indent }: { label: string; indent?: number },{ context } : { context: string }) => {
                    if (context === 'menu') {
                        // Alle mit indent angegebenen Werte im Dropdown-Menü einrücken
                        return  indent && indent > 0 ? '-'.repeat(indent) + '\u00A0' + label : label;
                    } else {
                        // Im ausgewählten Zustand: normal
                        return label;
                    }
                }}
                styles={{
                    container: (provided: CSSObject) => ({
                        ...provided,
                        backgroundColor: isDarkMode? (cardColorVariant ? 'var(--FastSchwarz, black)' : 'black') : cardColorVariant ? 'var(--FastWeiß, white)' : 'white',
                        color: isDarkMode? 'white' : 'black',
                        ...(width ? { width } : {})
                    }),
                    control: () => ({
                        display: 'flex',
                        ...(width ? { width } : {})
                    }),
                    menu: (provided: CSSObject) => ({
                        ...provided,
                        borderRadius: '8px', // runde Ecken für das Dropdown
                        overflow: 'hidden',
                        backgroundColor: isDarkMode? (cardColorVariant ? 'var(--FastSchwarz, black)' : 'black') : cardColorVariant ? 'var(--FastWeiß, white)' : 'white',
                        color: isDarkMode? 'white' : 'black',
                        ...(width ? { width } : {})
                    }),
                    menuList: (provided: CSSObject) => ({
                        ...provided,
                        overflowY: "auto",
                        padding: 0,
                        backgroundColor: isDarkMode? (cardColorVariant ? 'var(--FastSchwarz, black)' : 'black') : cardColorVariant ? 'var(--FastWeiß, white)' : 'white',
                        color: isDarkMode? 'white' : 'black',
                    }),
                    option: (provided: CSSObject, state: { isFocused: boolean; isSelected: boolean }) => ({
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
        ) : (
        <Select<Option<T>, false>
                className = "custom-select" 
                isMulti={false}
                placeholder = {placeHolder ?? ""}
                options = {options}
                value={options.length > 0 && hasId(options[0].value) ? // Wenn die values der Optionen ids haben, handelt es sich um komplexe Objekte, die zur Auswahl stehen und müssen dahingehend verglichen werden
                            options.find(opt => hasId(opt.value) && hasId(value) && opt.value.id === value.id) // Die eine Option mit der passenden id finden
                            : options.find(opt => opt.value === value)} // Ohne Multi oder id nur die eine Option finden

                onChange={(selectedOption: SingleValue<Option<T>>) => onChange(selectedOption?.value ?? undefined)}
                maxMenuHeight={maxMenuHeight ?? 280}
                menuPlacement={menuPlacement ?? "auto"}
                menuPosition="fixed"
                classNamePrefix="dropdown"
                defaultValue={defaultValue}
                formatOptionLabel={({ label, indent }: { label: string; indent?: number },{ context } : { context: string }) => {
                    if (context === 'menu') {
                        // Alle mit indent angegebenen Werte im Dropdown-Menü einrücken
                        return  indent && indent > 0 ? '-'.repeat(indent) + '\u00A0' + label : label;
                    } else {
                        // Im ausgewählten Zustand: normal
                        return label;
                    }
                }}
                styles={{
                    container: (provided: CSSObject) => ({
                        ...provided,
                        backgroundColor: isDarkMode? (cardColorVariant ? 'var(--FastSchwarz, black)' : 'black') : cardColorVariant ? 'var(--FastWeiß, white)' : 'white',
                        color: isDarkMode? 'white' : 'black',
                        ...(width ? { width } : {})
                    }),
                    control: () => ({
                        display: 'flex',
                        ...(width ? { width } : {})
                    }),
                    menu: (provided: CSSObject) => ({
                        ...provided,
                        borderRadius: '8px', // runde Ecken für das Dropdown
                        overflow: 'hidden',
                        backgroundColor: isDarkMode? (cardColorVariant ? 'var(--FastSchwarz, black)' : 'black') : cardColorVariant ? 'var(--FastWeiß, white)' : 'white',
                        color: isDarkMode? 'white' : 'black',
                        ...(width ? { width } : {})
                    }),
                    menuList: (provided: CSSObject) => ({
                        ...provided,
                        overflowY: "auto",
                        padding: 0,
                        backgroundColor: isDarkMode? (cardColorVariant ? 'var(--FastSchwarz, black)' : 'black') : cardColorVariant ? 'var(--FastWeiß, white)' : 'white',
                        color: isDarkMode? 'white' : 'black',
                    }),
                    option: (provided: CSSObject, state: { isFocused: boolean; isSelected: boolean }) => ({
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