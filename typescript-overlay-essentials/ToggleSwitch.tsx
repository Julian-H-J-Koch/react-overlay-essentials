import React, { useRef, useEffect, useState } from "react";
import "./ToggleSwitch.css";

export interface Option<T> {
    value: T;
    label: string;
}

// Attribute vom ToggleSwitch:
// - optionLeft: {value: valueLeft, label: labelLeft} Beschreibt die linke Option. valueLeft ist der Wert, der in "value" eingetragen wird und labelLeft, was als Option angezeigt wird.
// - optionRight: {value: valueLeft, label: labelRight} Beschreibt die rechte Option. valueRight ist der Wert, der in "value" eingetragen wird und labelRight, was als Option angezeigt wird.
// - value: Der Wert, der ausgewählt angezeigt werden soll (useState)
// - onChange: Die Funktion die bei Änderung ausgeführt werden soll.
//             Standardmäßig könnte z.B. {(value) => {value === valueLeft ? setValue(valueLeft) : setValue(valueRight)}} genutzt werden

export function ToggleSwitch<T>({ optionLeft, optionRight, value, onChange } : { optionLeft: Option<T>, optionRight: Option<T>, value: T, onChange: (value: T) => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const optionLeftRef = useRef<HTMLDivElement>(null);
    const optionRightRef = useRef<HTMLDivElement>(null);
    const [sliderStyle, setSliderStyle] = useState({});

    useEffect(() => {
        const el = value === optionLeft.value ? optionLeftRef.current : optionRightRef.current;
        const container = containerRef.current;

        if (!el || !container) return;

        const { offsetLeft, offsetWidth } = el;

        setSliderStyle({
            transform: `translateX(calc(${offsetLeft}px - 1rem))`,
            width: `calc(${offsetWidth}px + 2rem)`
        });
    }, [value, optionLeft, optionRight]);

    return (
        <div className="toggleWrapper" ref={containerRef}>
            <div
                className={`toggleOption ${value === optionLeft.value ? "active" : ""}`}
                ref={el => {optionLeftRef.current = el}}
                onClick={() => onChange(optionLeft.value)}
            >
                {optionLeft.label}
            </div>
            <div
                className={`toggleOption ${value === optionRight.value ? "active" : ""}`}
                ref={el => {optionRightRef.current = el}}
                onClick={() => onChange(optionRight.value)}
            >
                {optionRight.label}
            </div>

            <div className={`toggleSlider ${value === optionLeft.value ? "left" : "right"}`} style={sliderStyle}/>
        </div>
    );
}