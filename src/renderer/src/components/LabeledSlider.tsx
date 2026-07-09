import { useState } from "react";

interface LabeledSliderProps {
    min?: number;
    max?: number;
    initialValue?: number;
    onChange: (value: number) => void
}

export default function LabeledSlider({
    min = 0,
    max = 100,
    initialValue = 50,
    onChange,
}: LabeledSliderProps) {
    const [value, setValue] = useState<number>(initialValue);

    const percent = ((value - min) / (max - min)) * 100;

    const handleChange = (e) => {
        const next = Number(e.target.value);
        setValue(next);
        onChange?.(next);
    }

    return (
        <div className="w-1/2 p-6 bg-neutral-900 rounded-2xl">
            <div className="relative h-2 flex items-center">
                <div className="absolute w-full h-2 rounded-full bg-neutral-700"/>

                <div
                className="absolute h-2 rounded-full bg-orange-500"
                style={{width: `${percent}%`}}
                />

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className="
            relative w-full h-2 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-orange-500
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-orange-500
            [&::-moz-range-thumb]:cursor-pointer
          "
        />
            </div>
        </div>
    )
}