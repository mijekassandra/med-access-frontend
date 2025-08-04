import { useState } from "react";
import "react-date-picker/dist/DatePicker.css"; // Ensure default styles are loaded
import "react-calendar/dist/Calendar.css"; // Required for the calendar popup
import DatePicker from "react-date-picker";
import { Calendar, CloseCircle } from "iconsax-react";

interface CustomDatePickerProps {
    label?: string;
    value?: string | Date;
    onChange?: (value: Date) => void;
    error?: boolean; // Error state for the input
    disabled?: boolean; // Disable state for the input
    helperText?: string;
}

const CustomDatePicker = ({ label, value, onChange, error = false, disabled = false, helperText }: CustomDatePickerProps) => {
    const [isFocused, setInFocused] = useState(false);
    const [hoveredRemove, setHoveredRemove] = useState(false);
    const [hoveredCalendar, setHoveredCalendar] = useState(false);

    return (
        <div className="flex flex-col w-full gap-1">
            <div
                className={`min-w-[11.5rem] h-[52px] flex items-center justify-center relative rounded-md cursor-pointer px-4 group hover:border-szPrimary900 ${
                    disabled
                        ? "border border-0 bg-szGrey150"
                        : isFocused
                        ? `${error ? "border border-error700" : "border border-szBlack700"}`
                        : `${error ? "border border-error700" : "border border-szLightGrey400"}`
                }`}
            >
                <DatePicker
                    disabled={disabled ?? false}
                    className={`custom-date-picker w-full -mb-0.5`}
                    onChange={(value: any) => {
                        if (onChange) {
                            onChange(value);
                        }
                    }}
                    value={value}
                    calendarIcon={
                        <Calendar
                            onMouseEnter={() => !disabled && setHoveredCalendar(true)}
                            onMouseLeave={() => !disabled && setHoveredCalendar(false)}
                            className={"h-4 w-4 text-szBlack700"}
                            variant={hoveredCalendar ? "Bold" : "Linear"}
                        />
                    }
                    clearIcon={
                        <CloseCircle
                            onMouseEnter={() => !disabled && setHoveredRemove(true)}
                            onMouseLeave={() => !disabled && setHoveredRemove(false)}
                            className={`h-4 w-4 ${isFocused || value ? "text-szBlack700" : "opacity-0 "}`}
                            variant={hoveredRemove ? "Bold" : "Outline"}
                        />
                    }
                    locale="en-US"
                    onFocus={() => {
                        if (!disabled) {
                            setInFocused(true);
                        }
                    }}
                    onBlur={() => {
                        if (!disabled) {
                            setInFocused(false);
                        }
                    }}
                />

                <div
                    className={`font-dmSans absolute left-4 transition-all duration-200 pointer-events-none px-1 rounded-sm ${
                        !disabled ? "group-hover:text-szPrimary900" : ""
                    } 
                    ${
                        isFocused || value
                            ? `text-caption-all-caps -top-1.5 px-[2px] font-bold bg-white ${
                                  disabled
                                      ? "text-szLightGrey400"
                                      : `${error ? "text-error700" : `${isFocused ? "text-szBlack700" : "text-szGrey500"}`}`
                              }`
                            : `top-4 text-body-small-reg text-szLightGrey400 w-[60%] ${disabled ? "bg-szGrey150" : "bg-white"}`
                    }
                   
                `}
                >
                    <span className={`text-dmSans`}>{label}</span>
                </div>
            </div>
            {helperText && (
                <span
                    className={`font-dmSans text-caption-reg max-w-[11.5rem] break-words flex-shrink-0 ${
                        error ? "text-error700" : "text-szDarkGrey600"
                    }`}
                >
                    {helperText}
                </span>
            )}
        </div>
    );
};

export default CustomDatePicker;
