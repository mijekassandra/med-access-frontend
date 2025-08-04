import React, { useState } from "react";

interface ToggleProps {
    isOn: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
    isOn,
    onToggle,
    disabled = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            {/* <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label> */}
            <div
                className={`relative inline-flex items-center w-12 h-6 cursor-pointer group outline-none rounded-full ${
                    isFocused && !isActive ? "ring-1 ring-szSecondary500" : ""
                } `}
                onClick={() => {
                    if (!disabled) {
                        onToggle();
                    }
                }}
                onFocus={() => {
                    if (!disabled) {
                        setIsFocused(true);
                    }
                }}
                onBlur={() => {
                    if (!disabled) {
                        setIsFocused(false);
                    }
                }}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                onMouseLeave={() => setIsActive(false)}
                tabIndex={0} // Makes the div focusable
                role="switch" // Improves accessibility
                aria-checked={isOn} // Accessibility attribute
            >
                {/* Padding container */}
                <div className="relative w-full h-full p-1">
                    {/* Background */}
                    <div
                        className={`absolute inset-0 transition-colors rounded-full ${
                            isOn
                                ? disabled
                                    ? "bg-szGrey300"
                                    : `${
                                          isActive
                                              ? "bg-szPrimary900"
                                              : "bg-szPrimary500 group-hover:bg-szPrimary700"
                                      }`
                                : disabled
                                ? "bg-szGrey150"
                                : "bg-szPrimary100"
                        }`}
                    ></div>
                    {/* Toggle Knob */}
                    <div
                        className={`absolute top-1/2 transition-transform transform -translate-y-1/2 rounded-full shadow w-5 h-5  ${
                            isOn
                                ? "translate-x-[1.35rem] bg-white"
                                : disabled
                                ? "translate-x-[-0.063rem] bg-szGrey300"
                                : `${
                                      isActive
                                          ? "translate-x-[-0.063rem] bg-szPrimary900"
                                          : "translate-x-[-0.063rem] bg-szPrimary500 group-hover:bg-szPrimary700"
                                  }`
                        }`}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default Toggle;
