import React from "react";
import Spinner from "./Spinner";

export interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "secondaryDark";
  size?: "large" | "medium" | "small";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "large",
  disabled = false,
  type = "button",
  leftIcon,
  rightIcon,
  ariaLabel,
  className = "",
  loading = false,
  fullWidth = false,
  onClick,
}) => {
  const baseClasses = `flex items-center justify-center rounded-custom-md font-semibold transition-all`;

  const variantClasses = {
    primary:
      "bg-szPrimary500 text-szWhite100 hover:bg-szPrimary700 active:bg-szPrimary900 focus:outline focus:outline-1 focus:outline-szPrimary900",
    secondary:
      "bg-szSecondary200 text-szSecondary900 hover:bg-szSecondary400 active:bg-szSecondary500 active:text-szWhite100 focus:outline focus:outline-1 focus:outline-szSecondary500 focus:bg-szSecondary400",
    secondaryDark:
      "bg-szSecondary500 text-szWhite100 hover:bg-szSecondary700 active:bg-szSecondary700 focus:outline focus:outline-1 focus:outline-szSecondary700",
    ghost:
      "bg-transparent text-szPrimary700 hover:text-szPrimary900 active:text-szBlack900 active:outline-none focus:text-szPrimary700 focus:outline focus:outline-1 focus:outline-szSecondary500 focus:bg-szWhite100",
  };

  const disabledClasses = {
    primary: "bg-szPrimary100",
    secondary: "bg-szSecondary50",
    secondaryDark: "bg-szSecondary100",
    ghost: "bg-transparent",
  };

  const textColorClasses = {
    primary: "text-szWhite100",
    secondary: "text-szSecondary900 active:text-szWhite100",
    secondaryDark: "text-szWhite100 active:text-szWhite100",
    ghost:
      "text-szPrimary700 hover:text-szPrimary900 active:text-szBlack900 focus:text-szPrimary700",
  };

  const textSizeClasses = {
    large: "text-body-big-strong",
    medium: "text-body-base-strong",
    small: "text-body-small-strong",
  };

  const sizeClasses = {
    large: "min-h-[48px] px-6 py-3",
    medium: "min-h-[44px] px-6 py-3",
    small: "min-h-[32px] px-4 py-2",
  };

  const iconSizeClasses = {
    large: "icon-md",
    medium: "icon-md",
    small: "icon-sm",
  };

  const loadingClasses = {
    primary: "bg-szPrimary900",
    secondary: "bg-szSecondary500",
    secondaryDark: "bg-szSecondary500",
    ghost: "bg-transparent",
  };

  return (
    <button
      type={type}
      aria-label={ariaLabel || label}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={`h-fit ${baseClasses} ${sizeClasses[size]} ${
        fullWidth && "w-full"
      } ${
        disabled
          ? `${disabledClasses[variant]} cursor-default text-szGrey500`
          : `${variantClasses[variant]} cursor-pointer`
      } ${className} ${
        loading && `${loadingClasses[variant]} pointer-events-none `
      }`}
    >
      {/* Loading Spinner --------------------------------------------------- */}
      {loading ? (
        <div className="flex items-center gap-2">
          <p
            className={`${textSizeClasses[size]} ${
              variant === "ghost" ? "text-szBlack700" : "text-szWhite100"
            }`}
          >
            Submitting
          </p>
          <Spinner
            size={size}
            className={
              variant === "ghost" ? "text-gray-700" : "text-szWhite100"
            }
          />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {leftIcon &&
            React.cloneElement(leftIcon as React.ReactElement, {
              className: `${iconSizeClasses[size]} ${
                disabled ? "text-szGrey500" : ""
              }`,
            })}
          <p
            className={`${textSizeClasses[size]} leading-none m-0 ${
              disabled ? "text-szGrey500" : textColorClasses[variant]
            }`}
          >
            {label}
          </p>
          {rightIcon &&
            React.cloneElement(rightIcon as React.ReactElement, {
              className: `${iconSizeClasses[size]}`,
            })}
        </div>
      )}
    </button>
  );
};

export default Button;
