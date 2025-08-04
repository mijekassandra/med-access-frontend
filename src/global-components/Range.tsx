import React, { useState } from "react";

interface RangeProps {
    min?: number; // Minimum value of the range slider
    max?: number; // Maximum value of the range slider
    step?: number; // Step value for the range slider
    value?: number; // Current value of the range slider
    onChange?: (value: number) => void; // Event handler for value changes
    disabled?: boolean;
    width?: string;
}

const Range: React.FC<RangeProps> = ({
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    disabled,
    width = "100%",
}) => {
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);
    const normalizedValue = Math.min(Math.max(value ?? 0, min), max);

    return (
        <div
            className="relative flex flex-col justify-center h-full"
            style={{
                width: width,
            }}
        >
            <input
                onMouseEnter={() => {
                    setHovered(true);
                }}
                onMouseLeave={() => {
                    setHovered(false);
                }}
                onMouseDown={() => setActive(true)} // Mark as active on mouse down
                onMouseUp={() => setActive(false)} // Remove active state on mouse up
                onTouchStart={() => setActive(true)} // For touch devices
                onTouchEnd={() => setActive(false)} // For touch devices
                className={`appearance-none bg-szPrimary500 ${
                    disabled ? disabled && "accent-white" : ""
                }accent-white h-1 rounded-[1.875rem]
                          range-thumb-ring range-thumb-shadow active:accent-szPrimary900`}
                type="range"
                min={min}
                max={max}
                step={step}
                value={normalizedValue}
                onChange={(e) => {
                    let newValue = Number(e.target.value);
                    // Normalize the value inside the component
                    newValue = Math.min(Math.max(newValue, min), max);
                    if (onChange) {
                        onChange(newValue);
                    }
                }}
                disabled={disabled}
                // style={{
                //     background: disabled
                //         ? `linear-gradient(to right, #C6C6C6 ${
                //               ((value ?? 0 - min) / (max - min)) * 100
                //           }%, #F1F1F1 ${value ?? 0}%)`
                //         : hovered
                //         ? `linear-gradient(to right, #4F65BB ${
                //               ((value ?? 0 - min) / (max - min)) * 100
                //           }%, #ECF0FF ${value ?? 0}%)`
                //         : `linear-gradient(to right, #6584FF ${
                //               ((value ?? 0 - min) / (max - min)) * 100
                //           }%, #ECF0FF ${value ?? 0}%)`, // Left blue, right red
                // }}

                style={{
                    background: disabled
                        ? `linear-gradient(to right, #C6C6C6 ${
                              ((normalizedValue - min) / (max - min)) * 100
                          }%, #F1F1F1 ${
                              ((normalizedValue - min) / (max - min)) * 100
                          }%)`
                        : hovered
                        ? active
                            ? `linear-gradient(to right, #394577 ${
                                  ((normalizedValue - min) / (max - min)) * 100
                              }%, #ECF0FF ${
                                  ((normalizedValue - min) / (max - min)) * 100
                              }%)`
                            : `linear-gradient(to right, #4F65BB ${
                                  ((normalizedValue - min) / (max - min)) * 100
                              }%, #ECF0FF ${
                                  ((normalizedValue - min) / (max - min)) * 100
                              }%)`
                        : `linear-gradient(to right, #6584FF ${
                              ((normalizedValue - min) / (max - min)) * 100
                          }%, #ECF0FF ${
                              ((normalizedValue - min) / (max - min)) * 100
                          }%)`,
                }}

                // style={{
                //     background: disabled? :`linear-gradient(to right, #6584FF ${
                //         ((normalizedValue - min) / (max - min)) * 100
                //     }%, #ECF0FF ${
                //         ((normalizedValue - min) / (max - min)) * 100
                //     }%)`,
                // }}
            />
        </div>
    );
};

export default Range;
