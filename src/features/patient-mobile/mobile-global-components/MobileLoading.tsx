import React from "react";
import Spinner from "../../../global-components/Spinner";

interface MobileLoadingProps {
  message?: string;
  spinnerSize?: "small" | "medium" | "large";
  className?: string;
  contentClassName?: string;
  fullScreen?: boolean;
  icon?: React.ComponentType<any>;
  iconSize?: number;
}

const MobileLoading: React.FC<MobileLoadingProps> = ({
  message = "Loading...",
  spinnerSize = "large",
  className = "",
  contentClassName = "",
  fullScreen = true,
  icon: Icon,
  iconSize = 48,
}) => {
  const containerClasses = fullScreen
    ? "min-h-screen bg-szGray50 flex items-center justify-center"
    : "flex items-center justify-center px-4 py-8";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className={`flex flex-col items-center gap-4 ${contentClassName}`}>
        {Icon ? (
          <Icon size={iconSize} className="text-szPrimary700 animate-spin" />
        ) : (
          <Spinner size={spinnerSize} />
        )}
        <p className="text-szGray600 text-body-base-reg">{message}</p>
      </div>
    </div>
  );
};

export default MobileLoading;
