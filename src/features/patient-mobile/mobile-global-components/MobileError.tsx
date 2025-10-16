import React from "react";
import { Warning2 } from "iconsax-react";

interface MobileErrorProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<any>;
  iconSize?: number;
  className?: string;
  contentClassName?: string;
  fullScreen?: boolean;
}

const MobileError: React.FC<MobileErrorProps> = ({
  title = "Unable to load content",
  description = "Please check your connection and try again.",
  icon: Icon = Warning2,
  iconSize = 56,
  className = "",
  contentClassName = "",
  fullScreen = true,
}) => {
  const containerClasses = fullScreen
    ? "min-h-screen bg-szGray50 flex items-center justify-center px-4"
    : "flex items-center justify-center px-4 py-8";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className={`text-center ${contentClassName}`}>
        <Icon size={iconSize} className="text-error700 mx-auto mb-4" />
        <h3 className="text-h4 text-szBlack700 mb-2">{title}</h3>
        <p className="text-szBlack700 text-body-base-reg">{description}</p>
      </div>
    </div>
  );
};

export default MobileError;
