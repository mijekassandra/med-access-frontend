import React, { useState } from "react";
import { CloseCircle } from "iconsax-react";

interface ChipProps {
    label: string;
    onClick?: () => void;
    startIcon?: React.ReactNode;
    avatar?: React.ReactNode;
    onDelete?: () => void;
    type?: "default" | "schedule" | "custom";
    scheduleType?:
        | "rest"
        | "holiday"
        | "shift"
        | "business"
        | "leave"
        | "workOnLeave"
        | "suspended"
        | "absent";
    customClass?: string;
}

const Chip: React.FC<ChipProps> = ({
    label,
    onClick,
    startIcon,
    avatar,
    onDelete,
    type = "default",
    scheduleType,
    customClass,
}) => {
    const [hoveredDelete, setHoveredDelete] = useState(false);
    return (
        <>
            {type === "default" && (
                <div
                    className={`flex items-center gap-2 bg-szPrimary100 py-1 px-4 rounded-md cursor-pointer ${
                        onClick &&
                        "group hover:bg-szPrimary500 active:bg-szPrimary700 active:ring-0 focus:ring-1 focus:ring-szPrimary900 focus:bg-szPrimary500 focus:outline-none"
                    } `}
                    tabIndex={0}
                    onClick={onClick}
                >
                    {startIcon &&
                        !avatar &&
                        React.cloneElement(startIcon as React.ReactElement, {
                            className: `icon-sm text-info900 text-body-small-reg font-dmSans group-hover:text-szWhite100 group-focus:text-szWhite100`,
                        })}

                    {/* {avatar && <img className="rounded-full w-6 h-6" src={avatar} draggable={false}/>} */}
                    {avatar}

                    <span className="text-info900 text-body-small-reg font-dmSans group-hover:text-szWhite100 group-focus:text-szWhite100">
                        {label}
                    </span>

                    {onDelete && (
                        <CloseCircle
                            onMouseEnter={() => setHoveredDelete(true)}
                            onMouseLeave={() => setHoveredDelete(false)}
                            className="text-info900 icon-sm font-dmSans group-hover:text-szWhite100 group-focus:text-szWhite100"
                            onClick={onDelete}
                            variant={hoveredDelete ? "Bold" : "Outline"}
                        />
                        // <div
                        //     onMouseEnter={() => setHoveredDelete(true)}
                        //     onMouseLeave={() => setHoveredDelete(false)}
                        //     onClick={onDelete}
                        //     className={`rounded-full ${hoveredDelete && "bg-red-600"}`}
                        // >
                        //     <span className="text-info900 icon-sm font-dmSans group-hover:text-szWhite100 group-focus:text-szWhite100">
                        //         ✕
                        //     </span>
                        // </div>
                    )}
                </div>
            )}

            {type === "schedule" && (
                <div
                    className={`flex items-center justify-center rounded-[4px] p-1 font-dmSans w-[100px] ${
                        scheduleType === "shift" && "bg-success50"
                    } ${scheduleType === "leave" && "bg-[#FFEE32]"} ${
                        scheduleType === "suspended" && "bg-error900"
                    } ${scheduleType === "workOnLeave" && "bg-success700"} ${
                        scheduleType === "absent" && "bg-error900"
                    } ${scheduleType === "business" && "bg-info500"} ${
                        scheduleType === "holiday" && "bg-warning500"
                    } ${scheduleType === "rest" && "bg-szGrey500"} `}
                >
                    <span
                        className={`text-caption-all-caps uppercase ${
                            scheduleType === "shift" && "text-success900"
                        } ${scheduleType === "leave" && "text-szBlack800"} ${
                            scheduleType === "suspended" && "text-szWhite100"
                        } ${
                            scheduleType === "workOnLeave" && "text-szWhite100"
                        } ${scheduleType === "absent" && "text-szWhite100"} ${
                            scheduleType === "business" && "text-szWhite100"
                        } ${scheduleType === "holiday" && "text-szWhite100"} ${
                            scheduleType === "rest" && "text-szWhite100"
                        }`}
                    >
                        {label}
                    </span>
                </div>
            )}

            {type === "custom" && (
                <div className={`${customClass}`}>
                    <span>
                        {label}
                    </span>
                </div>
            )}
        </>
    );
};

export default Chip;
