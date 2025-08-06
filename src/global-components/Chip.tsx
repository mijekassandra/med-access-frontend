import React, { useState } from "react";
import { CloseCircle } from "iconsax-react";

interface ChipProps {
  label: string;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  avatar?: React.ReactNode;
  onDelete?: () => void;
  type?: "default" | "colored" | "custom";
  color?: "blue" | "orange" | "yellow" | "red" | "purple" | "gray" | "green";

  customClass?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  onClick,
  startIcon,
  avatar,
  onDelete,
  type = "default",
  color = "blue",
  customClass,
}) => {
  const [hoveredDelete, setHoveredDelete] = useState(false);

  const colorVariants = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    gray: {
      bg: "bg-gray-100",
      text: "text-gray-600",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
    },
  };

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
          )}
        </div>
      )}

      {type === "colored" && (
        <div
          className={`flex items-center justify-center rounded-[12px] px-2 py-1 font-dmSans w-fit ${colorVariants[color].bg}`}
        >
          <span
            className={`text-caption-all-caps uppercase ${colorVariants[color].text}`}
          >
            {label}
          </span>
        </div>
      )}

      {type === "custom" && (
        <div className={`${customClass}`}>
          <span>{label}</span>
        </div>
      )}
    </>
  );
};

export default Chip;
