import React from "react";

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  className = "",
}) => (
  <div
    className={`absolute left-0 mt-1 w-fit bg-white border rounded-lg z-10 ${className}`}
    style={{
      boxShadow: "0px 4px 15px 0px rgba(9, 18, 39, 0.2)",
    }}
  >
    {items.map((item, idx) => (
      <button
        key={idx}
        onClick={item.onClick}
        className="flex gap-[4px] px-[12px] py-[8px] w-full text-left text-szBlack800 hover:bg-szPrimary100"
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
);

export default DropdownMenu;
