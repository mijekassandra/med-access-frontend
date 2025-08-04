import { ArrowUp2 } from "iconsax-react";
import React, { useEffect, useRef, useState } from "react";

const getCurrentTime = () => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const isPM = currentHours >= 12;
    const formattedHours = currentHours % 12 === 0 ? 12 : currentHours % 12;
    const formattedMeridian = isPM ? "PM" : "AM";
    return { formattedHours, currentMinutes, formattedMeridian };
};

interface TimePickerProps {
    value?: string; // Initial time in "HH:mm" format (5:00 AM for "12-hour")
    label?: string;
    icon?: React.ReactNode;
    onChange?: (time: string) => void;
    variant?: "standard" | "dropdown";
    format?: "12-hour" | "24-hour"; // Time format
}

const TimePicker: React.FC<TimePickerProps> = ({
    value,
    label,
    icon,
    onChange,
    variant = "standard",
    format = "24-hour",
}) => {
    const { formattedHours, currentMinutes, formattedMeridian } =
        getCurrentTime();
    const [hours, setHours] = useState<any>(null);
    const [minutes, setMinutes] = useState<any>(null);
    const [meridian, setMeridian] = useState<any>("");

    const [isOpenHour, setIsOpenHour] = useState(false);
    const [isOpenMinutes, setIsOpenMinutes] = useState(false);
    const [isOpenMeridian, setIsOpenMeridian] = useState(false);

    const [error, setError] = useState<string>("");

    const timeRef = useRef<string | null>(null);

    const onChangeHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);

        if (!isNaN(value) && value >= 1 && value <= 12) {
            setHours(value);
        } else {
            setHours(1);
        }
    };

    const onChangeHourKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "ArrowUp") {
            setHours((prev: any) => (prev < 12 ? prev + 1 : 1)); // Increment, wrap to 1 if > 12
            event.preventDefault(); // Prevent default scroll behavior
        } else if (event.key === "ArrowDown") {
            setHours((prev: any) => (prev > 1 ? prev - 1 : 12)); // Decrement, wrap to 12 if < 1
            event.preventDefault(); // Prevent default scroll behavior
        }
    };

    const onChangeMinuteChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 59) {
            setMinutes(value);
        }
    };

    const onChangeMinuteKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "ArrowUp") {
            setMinutes((prev: any) => (prev < 59 ? prev + 1 : 0)); // Increment, loop back to 0 if > 59
            event.preventDefault(); // Prevent default scroll behavior
        } else if (event.key === "ArrowDown") {
            setMinutes((prev: any) => (prev > 0 ? prev - 1 : 59)); // Decrement, loop back to 59 if < 0
            event.preventDefault(); // Prevent default scroll behavior
        }
    };

    const updateTime = () => {
        // Parse the state values
        const hourNum = parseInt((hours ?? 0).toString(), 10);
        const minuteNum = parseInt((minutes ?? 0).toString(), 10);

        // Validate input
        if (
            isNaN(hourNum) ||
            isNaN(minuteNum) ||
            hourNum < 0 ||
            hourNum > 12 ||
            minuteNum < 0 ||
            minuteNum > 59
        ) {
            return; // Exit if input is invalid
        }

        let adjustedHour = hourNum;

        if (format === "24-hour") {
            // Convert to 24-hour format if necessary
            if (meridian === "PM" && hourNum !== 12) {
                adjustedHour += 12;
            } else if (meridian === "AM" && hourNum === 12) {
                adjustedHour = 0; // Midnight case
            }
            const formattedTime = `${adjustedHour
                .toString()
                .padStart(2, "0")}:${minuteNum.toString().padStart(2, "0")}`;

            // Trigger onChange with 24-hour format
            onChange?.(formattedTime);
        } else if (format === "12-hour") {
            // Convert to 12-hour format if necessary
            const displayHour =
                adjustedHour === 0
                    ? 12
                    : adjustedHour > 12
                    ? adjustedHour - 12
                    : adjustedHour;
            const formattedTime = `${displayHour
                .toString()
                .padStart(2, "0")}:${minuteNum
                .toString()
                .padStart(2, "0")} ${meridian}`;

            // Trigger onChange with 12-hour format
            onChange?.(formattedTime);
        }
    };

    // Initialize the time picker with the provided value
    useEffect(() => {
        if (value && value !== timeRef.current) {
            let formatValue = value.split(" ");
            if (format === "24-hour" && formatValue.length > 1) {
                setError(
                    "24-hour format values must not include a meridian (AM/PM)!"
                );
            } else {
                let [initialHour, initialMinute] = "1:00".split(":");
                if (formatValue.length > 1) {
                    [initialHour, initialMinute] = formatValue[0].split(":");
                } else {
                    [initialHour, initialMinute] = value.split(":");
                }

                const hourNum: number = parseInt(initialHour, 10);
                if (format === "24-hour") {
                    setMeridian(hourNum >= 12 ? "PM" : "AM");
                    setHours(hourNum % 12 || 12); // Convert to 12-hour format
                } else {
                    setMeridian(formatValue[1]);
                    setHours(hourNum);
                }

                setMinutes(parseInt(initialMinute, 10));
                timeRef.current = value;
            }
        } else if (!value) {
            setHours(formattedHours);
            setMinutes(currentMinutes);
            setMeridian(formattedMeridian);
        }
    }, [value, format]);

    // Trigger updateTime on hour, minute, or meridian change
    useEffect(() => {
        if (hours !== null && minutes !== null && minutes !== "") {
            updateTime();
        }
    }, [hours, minutes, meridian]);

    return (
        <div className="flex flex-col gap-3">
            {label && (
                <span className="font-dmSans font-bold text-caption-all-caps text-szBlack800">
                    {label.toUpperCase()}
                </span>
            )}

            {/* here */}
            {variant === "standard" ? (
                <div className="flex items-center gap-[0.423rem]">
                    <div className="flex items-center gap-5">
                        {icon &&
                            React.cloneElement(icon as React.ReactElement, {
                                className: `w-5 h-5 text-szBlack800`,
                            })}

                        <div className="flex items-center">
                            <input
                                id="hours"
                                value={hours ?? "12"}
                                onChange={onChangeHourChange}
                                onKeyDown={onChangeHourKeyDown} // Handle arrow key
                                min="0"
                                max="12"
                                className="appearance-none outline-none bg-szGrey150 w-[39.17px] h-7 rounded-md text-szBlack800 font-dmSans text-body-small-reg font-normal text-center hover:ring-1 hover:ring-szPrimary500 focus:bg-white focus:ring-1 focus:ring-szPrimary500"
                            />

                            <span className="flex justify-center items-center font-dmSans text-h6 font-medium w-[13.54px]">
                                :
                            </span>
                            <input
                                id="minutes"
                                value={
                                    minutes
                                        ? minutes.toString().padStart(2, "0")
                                        : "00"
                                }
                                onChange={onChangeMinuteChange}
                                onKeyDown={onChangeMinuteKeyDown} // Handle arrow keys
                                min="0"
                                max="59"
                                className="appearance-none outline-none bg-szGrey150 w-[39.17px] h-7 rounded-md text-szBlack800 font-dmSans text-body-small-reg font-normal text-center hover:ring-1 hover:ring-szPrimary500 focus:bg-white focus:ring-1 focus:ring-szPrimary500"
                            />
                        </div>
                    </div>

                    <div className="inline-flex rounded-md" role="group">
                        <div
                            className={`cursor-pointer rounded-l-md w-8 h-7 flex justify-center items-center ${
                                meridian === "AM"
                                    ? "bg-szPrimary500 hover:bg-szPrimary700 active:bg-szPrimary900"
                                    : "bg-white border border-szGrey500 hover:bg-szGrey150 active:bg-szGrey200"
                            }`}
                            onClick={() => {
                                setMeridian("AM");
                            }}
                        >
                            <span
                                className={`text-caption-reg font-dmSans font-medium ${
                                    meridian === "AM"
                                        ? "text-white"
                                        : "text-szBlack800"
                                }`}
                            >
                                AM
                            </span>
                        </div>
                        <div
                            className={`cursor-pointer rounded-r-md w-8 h-7 flex justify-center items-center ${
                                meridian === "PM"
                                    ? "bg-szPrimary500 hover:bg-szPrimary700 active:bg-szPrimary900"
                                    : "bg-white border-r border-t border-b border-szGrey500 border-szGrey500 hover:bg-szGrey150 active:bg-szGrey200"
                            }`}
                            onClick={() => {
                                setMeridian("PM");
                            }}
                        >
                            <span
                                className={`text-caption-reg font-dmSans font-medium ${
                                    meridian === "PM"
                                        ? "text-white"
                                        : "text-szBlack800"
                                }`}
                            >
                                PM
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-[0.423rem]">
                        <div className="flex items-center gap-5">
                            {icon &&
                                React.cloneElement(icon as React.ReactElement, {
                                    className: `w-5 h-5 text-szBlack800`,
                                })}

                            <div className="flex items-center gap-4">
                                <div className="relative w-[67px]">
                                    <select
                                        className="appearance-none outline-none cursor-pointer bg-white ring-1 ring-szLightGrey400 w-[67px] h-9 rounded-md text-szBlack700 font-dmSans text-[14px] font-normal text-start pl-4 hover:bg-szGrey150 focus:ring-1 focus:ring-szGrey700 active:ring-1 active:ring-szGrey700 active:bg-szGrey150"
                                        defaultValue={hours}
                                        value={hours}
                                        onBlur={() => setIsOpenHour(false)}
                                        onClick={() =>
                                            setIsOpenHour((prev) => !prev)
                                        }
                                        // onChange={() => setIsOpenHour((prev) => !prev)}
                                        onChange={(e) => {
                                            setHours(parseInt(e.target.value));
                                        }}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <span
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-300 ease-in-out ${
                                            isOpenHour
                                                ? "rotate-180"
                                                : "rotate-0"
                                        }`}
                                    >
                                        <ArrowUp2 className="icon-sm text-szBlack700" />
                                    </span>
                                </div>

                                <span className="flex justify-center items-center font-dmSans text-h6 font-medium w-[13.54px]">
                                    :
                                </span>

                                <div className="relative w-[67px]">
                                    <select
                                        className="appearance-none outline-none cursor-pointer bg-white ring-1 ring-szLightGrey400 w-[67px] h-9 rounded-md text-szBlack700 font-dmSans text-[14px] font-normal text-start pl-4 hover:bg-szGrey150 focus:ring-1 focus:ring-szGrey700 active:ring-1 active:ring-szGrey700 active:bg-szGrey150"
                                        defaultValue={
                                            minutes
                                                ? minutes
                                                      .toString()
                                                      .padStart(2, "0")
                                                : "00"
                                        }
                                        value={
                                            minutes
                                                ? minutes
                                                      .toString()
                                                      .padStart(2, "0")
                                                : "00"
                                        }
                                        onBlur={() => setIsOpenMinutes(false)}
                                        onClick={() =>
                                            setIsOpenMinutes((prev) => !prev)
                                        }
                                        onChange={(e) => {
                                            setMinutes(
                                                parseInt(e.target.value)
                                            );
                                        }}
                                    >
                                        {Array.from({ length: 60 }, (_, i) => (
                                            <option key={i + 1} value={i}>
                                                {i.toString().padStart(2, "0")}
                                            </option>
                                        ))}
                                    </select>
                                    <span
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-300 ease-in-out ${
                                            isOpenMinutes
                                                ? "rotate-180"
                                                : "rotate-0"
                                        }`}
                                    >
                                        <ArrowUp2 className="icon-sm text-szBlack700" />
                                    </span>
                                </div>
                                <span className="flex justify-center items-center font-dmSans text-h6 font-medium">
                                    :
                                </span>
                                <div className="relative w-[67px]">
                                    <select
                                        className="appearance-none outline-none cursor-pointer bg-white ring-1 ring-szLightGrey400 w-[67px] h-9 rounded-md text-szBlack700 font-dmSans text-[14px] font-normal text-start pl-4 hover:bg-szGrey150 focus:ring-1 focus:ring-szGrey700 active:ring-1 active:ring-szGrey700 active:bg-szGrey150"
                                        defaultValue={meridian}
                                        value={meridian}
                                        onBlur={() => setIsOpenMeridian(false)}
                                        onClick={() =>
                                            setIsOpenMeridian((prev) => !prev)
                                        }
                                        onChange={(e) => {
                                            setMeridian(e.target.value);
                                        }}
                                    >
                                        <option value={"AM"}>AM</option>
                                        <option value={"PM"}>PM</option>
                                    </select>
                                    <span
                                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-300 ease-in-out ${
                                            isOpenMeridian
                                                ? "rotate-180"
                                                : "rotate-0"
                                        }`}
                                    >
                                        <ArrowUp2 className="icon-sm text-szBlack700" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* Display error message */}
            {error && (
                <span className="text-error700 font-dmSans text-caption-reg font-normal text-wrap w-auto">
                    {error}
                </span>
            )}
        </div>
    );
};

export default TimePicker;
