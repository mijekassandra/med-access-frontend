import React from "react";

interface TabProps {
  label?: string;
  number?: number;
  active?: boolean;
  type: "left" | "middle" | "right";
  onClick?: () => void;
  isFirst?: boolean;
  icon?: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({
  label,
  number = 0,
  active = false,
  type,
  onClick,
  isFirst = false,
  icon,
}) => {
  const baseClasses =
    "flex items-center justify-center px-[16px] py-[8px] border border-[1px] cursor-pointer gap-[8px] border-szGrey200 w-fit min-w-[50px]";
  const shapeClass = {
    left: "rounded-l-[23px]",
    middle: "",
    right: "rounded-r-[23px]",
  };
  const inactiveStyle = "text-szGrey500 bg-[#F9F9F9]";
  const activeStyle = "text-szPrimary500 bg-white";

  return (
    <div
      className={` flex grow ${baseClasses} ${shapeClass[type]} ${
        active ? activeStyle : inactiveStyle
      } ${!isFirst ? "-ml-[1px]" : ""}`}
      onClick={onClick}
    >
      {label && (
        <p
          className={`text-body-small-reg ${
            active ? activeStyle : inactiveStyle
          }`}
        >
          {label}
        </p>
      )}

      {icon && <div className={active ? "" : "text-szBlack800"}>{icon}</div>}

      {number ? (
        <div className="flex gap-2 items-center">
          <p className="text-body-small-reg text-szGrey300">|</p>
          <p
            className={`text-caption-strong ${
              active ? "text-szSecondary500" : "text-szGrey500"
            }`}
          >
            {number}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Tab;