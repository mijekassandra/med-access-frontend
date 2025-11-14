import React, { forwardRef } from "react";

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  className?: string;
  position?: "left" | "right";
  width?: string;
  direction?: "up" | "down";
  style?: React.CSSProperties;
}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      items,
      className = "",
      position = "right",
      width = "w-fit",
      direction = "down",
      style,
    },
    ref
  ) => (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className={`${
        style?.position === "fixed" ? "fixed" : "absolute"
      } bg-white border rounded-lg z-10 ${width} ${className} ${
        style?.position !== "fixed"
          ? position === "left"
            ? "right-0"
            : "left-0"
          : ""
      } ${
        style?.position !== "fixed"
          ? direction === "up"
            ? "mb-1 bottom-full"
            : "mt-1 top-full"
          : ""
      }`}
      style={{
        boxShadow: "0px 4px 15px 0px rgba(9, 18, 39, 0.2)",
        ...style,
      }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          className="flex gap-[4px] px-[12px] py-[8px] w-full text-left text-szBlack800 hover:bg-szGrey150"
        >
          {item.icon && (
            <span>
              {React.cloneElement(item.icon as React.ReactElement, {
                className: `icon-sm`,
              })}
            </span>
          )}
          <p className="text-body-small-reg">{item.label}</p>
        </button>
      ))}
    </div>
  )
);

DropdownMenu.displayName = "DropdownMenu";

export default DropdownMenu;
