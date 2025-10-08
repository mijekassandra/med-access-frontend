import React from "react";

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  value,
  label,
  checked,
  disabled = false,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2 pb-1">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className={`
    appearance-none w-4 h-4 rounded-full border-2 
    border-szPrimary200 checked:bg-white 
    checked:border-szPrimary500
    disabled:opacity-50 disabled:border-gray-400 
    before:block before:w-full before:h-full 
    before:rounded-full before:border before:border-white 
    before:bg-white before:scale-75 
    checked:before:scale-75 checked:before:bg-szPrimary500 
    disabled:before:bg-szLightGrey400 disabled:before:border-szLightGrey400
  `}
      />
      <label
        htmlFor={id}
        className="flex items-center text-caption-md text-szBlack800 font-dmSans"
      >
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
