import React from "react";

interface ButtonsIconProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "large" | "medium" | "small";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  customColor?: string;
}

const ButtonsIcon: React.FC<ButtonsIconProps> = ({
  icon,
  onClick,
  variant = "primary",
  size = "large",
  disabled = false,
  type = "button",
  ariaLabel = "button icon",
  customColor,
}) => {
  const baseClasses = "flex items-center justify-center rounded-custom-md";
  const disabledClasses =
    "bg-transparent text-szLightGrey400 cursor-default opacity-50";

  const sizeClasses = {
    large: "w-[48px] h-[48px] p-3", // 48px button
    medium: "w-[44px] h-[44px] p-2.5", // 44px button
    small: "w-[32px] h-[32px]", // 32px button
  };

  const variantClasses = {
    primary: `bg-szPrimary500 ${
      customColor ? `text-${customColor}` : "text-white"
    } hover:bg-szPrimary700 active:bg-szPrimary900 focus:outline focus:outline-1 focus:outline-szPrimary900`,
    secondary: `bg-szSecondary200 ${
      customColor ? `text-${customColor}` : "text-szSecondary900"
    } hover:bg-szSecondary400 active:bg-szSecondary500 active:text-white focus:outline focus:outline-1 focus:bg-szSecondary400 focus:outline-szSecondary500`,
    ghost: `bg-transparent ${
      customColor ? `text-${customColor}` : "text-szPrimary900"
    } hover:text-szPrimary900 active:text-szPrimary900 focus:outline focus:outline-1 focus:outline-szPrimary900 focus:bg-white`,
  };
  const iconSizeClasses = {
    large: "icon-md", //24
    medium: "icon-md", //24
    small: "icon-sm", // 16px icons for small
  };

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={disabled ? undefined : onClick} // Prevent click when disabled
      className={`${baseClasses} ${sizeClasses[size]} ${
        disabled ? disabledClasses : `${variantClasses[variant]} cursor-pointer`
      }`}
      disabled={disabled}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: `${iconSizeClasses[size]}`,
      })}
    </button>
  );
};

export default ButtonsIcon;
