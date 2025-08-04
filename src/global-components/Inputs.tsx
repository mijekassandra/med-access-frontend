import React from "react";

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  icon?: React.ElementType;
  iconClick?: () => void;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  className?: string;
  error?: boolean;
  isTextarea?: boolean;
  maxCharacter?: number;
  description?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder = "",
  value,
  icon: Icon,
  iconClick,
  onChange,
  className = "",
  error,
  isTextarea = false,
  maxCharacter,
  description,
  disabled = false,
}) => {
  const sharedStyles = `block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 
  text-body-small-reg text-szBlack700 font-dmSans
  placeholder:text-szBlack700 ${
    error
      ? "border-error700 focus:ring-szBlack700"
      : "border-szLightGrey400 focus:ring-szBlack700"
  } hover:border-szPrimary700 ${className}`;

  const countCharacters = (text: string = "") => {
    return text.length;
  };

  return (
    <>
      <div className="relative w-full min-w-[40px]">
        <label
          className={`absolute text-caption-all-caps font-dmSans tracking-widest
             top-1 scale-100 -translate-y-2/3 left-3 z-10 origin-[0] bg-white px-1 
              ${error ? "text-error900" : "text-szGrey500"}
             `}
          htmlFor={label}
        >
          {label}
        </label>

        {isTextarea ? (
          <>
            <textarea
              id={label}
              placeholder={placeholder}
              value={value}
              maxLength={maxCharacter}
              onChange={onChange}
              disabled={disabled}
              className={`${sharedStyles} min-h-[100px] min-w-[300px] resize-none disabled:border-szLightGrey400 disabled:hover:border-szGrey300 disabled:bg-szWhite100 disabled:cursor-not-allowed `}
            />
            <p className="flex justify-end mt-1 pr-1 text-caption-all-caps text-szLightGrey400">
              {countCharacters(value || "")}/{maxCharacter}
            </p>
          </>
        ) : (
          <input
            id={label}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${sharedStyles} min-h-[44px] ${
              Icon ? "pr-10" : ""
            } disabled:border-szLightGrey400 disabled:hover:border-szLightGrey400 disabled:bg-szGrey150 disabled:cursor-not-allowed `}
          />
        )}

        <div className="absolute flex items-center inset-y-0 right-0 pr-2.5 text-szLightGrey40">
          {Icon && (
            <button type="button" onClick={iconClick}>
              <Icon className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>
      {description && (
        <p className="mt-1 text-caption-reg text-szDarkGrey600 font-dmSan">
          {description}
        </p>
      )}
    </>
  );
};

export default Input;
