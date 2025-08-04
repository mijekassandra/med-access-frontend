// ------------------- Calendar.tsx custom -------------------
import { useState } from "react";
import { ArrowLeft2, ArrowRight2, CloseCircle, Edit2, TickCircle } from "iconsax-react";
import {
    addMonths,
    subMonths,
    format,
    startOfMonth,
    startOfWeek,
    eachDayOfInterval,
    isSameMonth,
    addDays,
    // isSameDay,
} from "date-fns";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface ShiftData {
    date: string;
    type: "rest" | "holiday" | "shift" | "business" | "leave" | "workOnLeave" | "suspended" | "absent";
    start?: string;
    end?: string;
    withPay?: boolean;
    schedules?: {
        start: string;
        end: string;
        type: "rest" | "holiday" | "shift" | "business" | "leave" | "workOnLeave" | "suspended" | "absent";
    }[];
}

interface CalendarProps {
    value?: Date;
    shiftData: ShiftData[];
    onChange?: (value: { month: { name: string; value: number }; year: number }) => void;
    enableMonthYearFilter?: boolean;
    width?: string;
}

const Calendar: React.FC<CalendarProps> = ({ value = new Date(), shiftData, onChange, enableMonthYearFilter = true, width }) => {
    const currentDate = value; // Set to today's date
    const [currentSelectedMonth, setCurrentSelectedMonth] = useState(value); // Set to today's date
    const [isEditing, setIsEditing] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    const monthStart = startOfMonth(currentSelectedMonth);

    // Always start on the first day of the week that contains the month's first day
    const startOfCalendar = startOfWeek(monthStart, { weekStartsOn: 0 });

    // Always show exactly 6 weeks = 42 days
    const endOfCalendar = addDays(startOfCalendar, 41);

    const days = eachDayOfInterval({
        start: startOfCalendar,
        end: endOfCalendar,
    });

    const handlePrevMonth = () => {
        const newDate = subMonths(currentSelectedMonth, 1);

        // Check if the selected month and year are the current month and year
        const today = new Date();
        if (newDate.getMonth() === today.getMonth() && newDate.getFullYear() === today.getFullYear()) {
            setCurrentSelectedMonth(today); // Set to today's date
            setSelectedMonth(today.getMonth());
            setSelectedYear(today.getFullYear());
        } else {
            setCurrentSelectedMonth(newDate); // Set to the selected date
            setSelectedMonth(newDate.getMonth());
            setSelectedYear(newDate.getFullYear());
        }

        const month = {
            name: format(newDate, "MMMM"),
            value: newDate.getMonth() + 1, // Month in number format (1-12)
        };
        const year = newDate.getFullYear();
        if (onChange) {
            onChange({ month, year });
        }
        setIsEditing(false);
    };
    const handleNextMonth = () => {
        const newDate = addMonths(currentSelectedMonth, 1);

        // Check if the selected month and year are the current month and year
        const today = new Date();
        if (newDate.getMonth() === today.getMonth() && newDate.getFullYear() === today.getFullYear()) {
            setCurrentSelectedMonth(today); // Set to today's date
            setSelectedMonth(today.getMonth());
            setSelectedYear(today.getFullYear());
        } else {
            setCurrentSelectedMonth(newDate); // Set to the selected date
            setSelectedMonth(newDate.getMonth());
            setSelectedYear(newDate.getFullYear());
        }

        const month = {
            name: format(newDate, "MMMM"),
            value: newDate.getMonth() + 1, // Month in number format (1-12)
        };
        const year = newDate.getFullYear();
        if (onChange) {
            onChange({ month, year });
        }
        setIsEditing(false);
    };

    const getCellData = (date: Date): ShiftData | undefined => {
        const dateStr = format(date, "yyyy-MM-dd");
        return shiftData.find((entry) => entry.date === dateStr);
    };

    return (
        <div className={`${width ? `w-[${width}]` : ""} min-w-[500px]: max-w-[1000px] mx-auto font-dmSans`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="rounded-custom-md bg-transparent text-szPrimary900 hover:text-szPrimary900 active:text-szPrimary900 focus:outline focus:outline-1 focus:outline-szPrimary900 focus:bg-white cursor-pointer"
                >
                    <ArrowLeft2 className="text-szPrimary700 font-extrabold" size="24" />
                </button>
                <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
                    {isEditing && enableMonthYearFilter === true ? (
                        <div>
                            <div className="flex gap-2 items-center">
                                <input
                                    className="w-[90px] px-4 py-2 border rounded-md focus:outline-none focus:ring-1 
  text-body-small-reg text-szBlack700 font-dmSans"
                                    type="number"
                                    value={selectedMonth + 1} // Month is zero-indexed
                                    onChange={(e) => setSelectedMonth(Number(e.target.value) - 1)} // Convert to zero-indexed
                                    min={1}
                                    max={12}
                                />
                                <input
                                    className="w-[90px] px-4 py-2 border rounded-md focus:outline-none focus:ring-1 
  text-body-small-reg text-szBlack700 font-dmSans"
                                    type="number"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                />
                                <TickCircle
                                    className="text-szPrimary500 hover:text-szPrimary700 active:text-szPrimary900 focus:outline focus:outline-1 focus:outline-szPrimary900"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newDate = new Date(selectedYear, selectedMonth);
                                        // Check if the selected month and year are the current month and year
                                        const today = new Date();
                                        if (selectedMonth === today.getMonth() && selectedYear === today.getFullYear()) {
                                            setCurrentSelectedMonth(today); // Set to today's date
                                        } else {
                                            setCurrentSelectedMonth(newDate); // Set to the selected date
                                        }

                                        // Call onChange with the new month and year
                                        if (onChange) {
                                            const month = {
                                                name: format(newDate, "MMMM"),
                                                value: newDate.getMonth() + 1, // Month in number format (1-12)
                                            };
                                            const year = newDate.getFullYear();
                                            onChange({ month, year });
                                        }
                                        setIsEditing(false);
                                    }}
                                />

                                <CloseCircle
                                    className="text-error700 hover:text-error900 active:text-error900 focus:outline focus:outline-1 focus:outline-error900"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(false);
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-h6 font-semibold flex items-center gap-1">
                            <div className="relative group">
                                <div className={`flex items-center gap-1 ${enableMonthYearFilter === true && "group-hover:underline"}`}>
                                    <span className="text-szPrimary700">{format(currentSelectedMonth, "MMM, ").toUpperCase()}</span>
                                    <span className="text-szPrimary700">{format(currentSelectedMonth, "yyyy").toUpperCase()}</span>
                                    {enableMonthYearFilter === true && (
                                        <div className="hidden group-hover:block transition-opacity duration-200">
                                            <Edit2 className="text-szGrey500" size="16" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleNextMonth}
                    className="rounded-custom-md bg-transparent text-szPrimary900 hover:text-szPrimary900 active:text-szPrimary900 focus:outline focus:outline-1 focus:outline-szPrimary900 focus:bg-white cursor-pointer"
                >
                    <ArrowRight2 className="text-szPrimary700 font-extrabold" size="24" />
                </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 text-center text-sm font-medium border-b border-szPrimary200 pb-2">
                {daysOfWeek.map((day, index) => (
                    <div
                        key={day}
                        className={`text-caption-all-caps ${(index === 0 || index === daysOfWeek.length - 1) && "text-szSecondary500"} `}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {days.map((day, index) => {
                    const cell = getCellData(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    const classes = [
                        "min-h-[56px] border-b border-l border-r border-szGrey200 flex flex-col items-center justify-center text-center",
                        !isCurrentMonth && "bg-white text-[#919191]",
                        cell?.type === "rest" &&
                            `${
                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                    ? "bg-szGrey500 text-szWhite100"
                                    : "bg-[#F9F9F9] text-szBlack700"
                            }`,
                        // cell?.type === "rest" &&
                        //     format(day, "yyyy-MM-dd") ===
                        //         format(currentDate, "yyyy-MM-dd") &&
                        //     "bg-error900 text-szWhite100 font-bold",

                        cell?.type === "holiday" &&
                            `${
                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                    ? "bg-warning500 text-szWhite100"
                                    : "bg-[#FFF4D7] text-szBlack800"
                            }`,
                        // cell?.type === "holiday" &&
                        //     format(day, "yyyy-MM-dd") ===
                        //         format(currentDate, "yyyy-MM-dd") &&
                        //     "bg-warning500 text-szWhite100",

                        cell?.type === "business" &&
                            `${
                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                    ? "bg-[#6584FF] text-szWhite100"
                                    : "bg-[#EBEFFF] text-info900"
                            }`,
                        // cell?.type === "business" &&
                        //     format(day, "yyyy-MM-dd") ===
                        //         format(currentDate, "yyyy-MM-dd") &&
                        //     "bg-[#6584FF] text-szWhite100",

                        cell?.type === "leave" &&
                            `${
                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                    ? "bg-[#FFEE32] text-szBlack800"
                                    : "bg-[#FFF693] text-szBlack800"
                            }`,

                        // cell?.type === "leave" &&
                        //     format(day, "yyyy-MM-dd") ===
                        //         format(currentDate, "yyyy-MM-dd") &&
                        //     "bg-[#FFEE32] text-szBlack800",

                        cell?.type === "workOnLeave" &&
                            `${
                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                    ? "bg-success700 text-szWhite100"
                                    : "bg-success50 text-szBlack800"
                            }`,

                        (cell?.type === "suspended" || cell?.type === "absent") &&
                            `${
                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                    ? "bg-error900 text-szWhite100"
                                    : "bg-error50 text-szBlack800"
                            }`,

                        cell?.type === "shift" && `${"bg-success50 text-success900"}`,

                        // cell?.type === "shift" &&
                        //     `${
                        //         format(day, "yyyy-MM-dd") ===
                        //         format(currentDate, "yyyy-MM-dd")
                        //             ? "bg-success900 text-szWhite100"
                        //             : "bg-success50 text-success900"
                        //     }`,
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                        <div key={index} className={`${classes} relative flex flex-col gap-1 p-1`}>
                            <div className="w-full flex justify-end">
                                <span className="font-semibold text-caption-all-caps">{format(day, "d")}</span>
                            </div>
                            <div className="w-full h-full flex flex-col justify-end items-center">
                                <div className="min-h-[32px] flex items-center justify-center w-full">
                                    {cell?.type === "rest" && (
                                        <span
                                            className={`${
                                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                                    ? "text-caption-strong"
                                                    : "text-caption-reg"
                                            } `}
                                        >
                                            Rest Day
                                        </span>
                                    )}
                                    {cell?.type === "holiday" && (
                                        <div className="flex flex-col">
                                            <span
                                                className={`${
                                                    format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                                        ? "text-caption-strong"
                                                        : "text-caption-reg"
                                                } `}
                                            >
                                                Holiday
                                            </span>
                                            {cell?.withPay === true && <span className="text-caption-all-caps uppercase">Off - WP</span>}
                                        </div>
                                    )}

                                    {cell?.type === "leave" && (
                                        <span
                                            className={`${
                                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                                    ? "text-caption-strong"
                                                    : "text-caption-reg"
                                            } uppercase`}
                                        >
                                            LEAVE WP
                                        </span>
                                    )}

                                    {cell?.type === "business" && (
                                        <span
                                            className={`${
                                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                                    ? "text-caption-strong"
                                                    : "text-caption-reg"
                                            } `}
                                        >
                                            Official Business
                                        </span>
                                    )}

                                    {(cell?.type === "suspended" || cell?.type === "absent") && (
                                        <span
                                            className={`${
                                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                                    ? "text-caption-strong"
                                                    : "text-caption-reg"
                                            } `}
                                        >
                                            {cell?.type.toUpperCase()}
                                        </span>
                                    )}

                                    {cell?.type === "workOnLeave" && (
                                        <span
                                            className={`${
                                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                                    ? "text-caption-strong"
                                                    : "text-caption-reg"
                                            } `}
                                        >
                                            Work On Leave
                                        </span>
                                    )}

                                    {cell?.type === "shift" && (
                                        <div className="flex flex-col gap-[2px] w-full">
                                            {cell.schedules &&
                                                cell.schedules.map((item, index) => (
                                                    <div
                                                        className={`flex flex-col lg:flex-row w-full justify-center rounded-lg group lg:gap-2 ${
                                                            format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                                                ? `${
                                                                      item.type === "shift"
                                                                          ? "bg-success900"
                                                                          : "bg-szGrey300 cursor-pointer"
                                                                  }`
                                                                : `${
                                                                      item.type === "shift"
                                                                          ? ""
                                                                          : "bg-szWhite100 hover:bg-szGrey300 cursor-pointer"
                                                                  } border border-szLightGrey400`
                                                        } `}
                                                        key={index}
                                                    >
                                                        <span
                                                            className={`text-error900 font-medium ${
                                                                item.type === "shift"
                                                                    ? "hidden"
                                                                    : "hidden group-hover:flex justify-center text-caption-reg"
                                                            }`}
                                                        >
                                                            {item.type.toUpperCase()}
                                                        </span>
                                                        <span
                                                            className={`text-caption-reg ${
                                                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                                                    ? `${
                                                                          item.type === "shift"
                                                                              ? "text-white"
                                                                              : "text-error900 block group-hover:hidden"
                                                                      }`
                                                                    : `${
                                                                          item.type === "shift"
                                                                              ? ""
                                                                              : "text-error900 block group-hover:hidden"
                                                                      }`
                                                            }`}
                                                        >
                                                            {item.start}
                                                        </span>
                                                        <span
                                                            className={`text-caption-reg ${
                                                                format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")
                                                                    ? `${
                                                                          item.type === "shift"
                                                                              ? "text-white"
                                                                              : "text-error900 block group-hover:hidden"
                                                                      }`
                                                                    : `${
                                                                          item.type === "shift"
                                                                              ? ""
                                                                              : "text-error900 block group-hover:hidden"
                                                                      }`
                                                            }`}
                                                        >
                                                            {item.end}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
