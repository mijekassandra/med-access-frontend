import React, { useState, useRef, useEffect } from "react";
import Dropdown from "./Dropdown";

interface ItemLimitDropdownProps {
  label?: string;
  value?: {
    label: string;
    value: string;
  };
  options: {
    label: string;
    value: string;
  }[];
  onChange: (value: { label: string; value: string }) => void;
  displayText?: string;
  width?: string;
  page: number;
}

const ItemLimitDropdown: React.FC<ItemLimitDropdownProps> = ({
  label = "Label",
  value,
  options,
  onChange,
  displayText,
  width,
  page,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      className={`flex items-center justify-end gap-3 ${
        width ? `w-[${width}]` : ""
      }`}
    >
      <div className="col-span-2 flex flex-col">
        <span className="text-caption-reg text-neutral-600">
          {displayText
            ? displayText
            : `Displaying ${(page - 1) * parseInt(value?.value || "0") + 1}-${
                page * parseInt(value?.value || "0")
              } records`}
        </span>
      </div>
      <div className="">
        <Dropdown
          label={label}
          placeholder={label}
          options={options}
          onSelectionChange={(option) => {
            onChange(option as { label: string; value: string });
          }}
          value={value}
          size="small"
        />
      </div>
    </div>
  );
};

export default ItemLimitDropdown;
