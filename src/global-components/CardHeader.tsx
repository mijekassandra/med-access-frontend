import React from "react";

interface CardHeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onClick,
}) => {
  return (
    <div className="flex items-center justify-between min-h-[32px]">
      <span className="flex items-center gap-[8px]">
        {leftIcon}
        <h6 className="text-h6">{title}</h6>
      </span>
      <span
        className="flex items-center icon-sm text-szPrimary900 cursor-pointer"
        onClick={onClick}
      >
        {rightIcon}
      </span>
    </div>
  );
};

export default CardHeader;
