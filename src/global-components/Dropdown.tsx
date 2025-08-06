import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ArrowDown2, ArrowUp2, SearchNormal } from "iconsax-react";
import Chip from "./Chip";
import Checkboxes from "./Checkboxes";

export type Option = {
  label: string;
  value: string;
  isCheckbox?: boolean;
};

interface DropdownProps {
  label: string;
  placeholder: string;
  options: Option[];
  multiSelect?: boolean;
  isCheckbox?: boolean;
  size?: "small" | "medium" | "large";
  value?: Option | Option[];
  usePortal?: boolean;
  disabled?: boolean;
  onSelectionChange: (selected: Option[] | Option) => void;
  onScroll?: (isAtEnd: boolean) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
  options,
  isCheckbox = false,
  multiSelect = false,
  size = "medium",
  value,
  usePortal = false,
  disabled = false,
  onSelectionChange,
  onScroll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedOptions(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const updateDropdownPosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.bottom + 10, // Add gap of 4px
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen && usePortal) {
      // Calculate position immediately when opening
      updateDropdownPosition();

      // Add event listener to close dropdown on scroll (but not when scrolling inside dropdown)
      const handleScroll = (event: Event) => {
        if (
          dropdownRef.current &&
          event.target instanceof Node &&
          dropdownRef.current.contains(event.target)
        ) {
          // Scrolling inside the dropdown, do nothing
          return;
        }
        setIsOpen(false);
      };
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", updateDropdownPosition);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", updateDropdownPosition);
      };
    } else if (!isOpen && usePortal) {
      // Clear position when closing
      setPosition(null);
    }
  }, [isOpen, usePortal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isOpen &&
        !buttonRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getFontSize = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "medium":
        return "text-base";
      case "large":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const handleOptionClick = (option: Option) => {
    let updatedSelection;
    if (multiSelect) {
      if (selectedOptions.find((opt) => opt.value === option.value)) {
        updatedSelection = selectedOptions.filter(
          (opt) => opt.value !== option.value
        );
      } else {
        updatedSelection = [...selectedOptions, option];
      }
    } else {
      updatedSelection = [option];
      setIsOpen(false);
    }

    setSelectedOptions(updatedSelection);
    onSelectionChange(multiSelect ? updatedSelection : option);
  };

  const handleOptionRemove = (value: string) => {
    const updatedSelection = selectedOptions.filter(
      (opt) => opt.value !== value
    );
    setSelectedOptions(updatedSelection);
    onSelectionChange(multiSelect ? updatedSelection : updatedSelection[0]);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!onScroll) return;

    const target = event.target as HTMLDivElement;
    const isAtEnd =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 1; // -1 for rounding errors

    if (isAtEnd) {
      onScroll(true);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DropdownMenu = (
    <div
      ref={dropdownRef}
      className="z-[10] bg-szWhite100 shadow-lg rounded-md"
      style={
        usePortal
          ? {
              position: "fixed",
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              width: position?.width ?? "auto",
              visibility: isOpen ? "visible" : "hidden",
            }
          : {
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              width: "100%",
            }
      }
      onClick={(e) => e.stopPropagation()}
    >
      {multiSelect && (
        <div className="flex items-center px-4 py-2 border-b border-gray-200">
          <SearchNormal className="text-szPrimary500 mr-2" variant="Bulk" />
          <input
            type="text"
            className="w-full bg-transparent outline-none text-sm text-gray-700"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <div className="max-h-[170px] overflow-y-auto" onScroll={handleScroll}>
        {filteredOptions.map((option) => (
          <div
            key={option.value}
            className={`flex items-center px-4 py-2 hover:bg-szPrimary50 cursor-pointer ${
              selectedOptions.find((opt) => opt.value === option.value)
                ? "bg-szPrimary50"
                : ""
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {isCheckbox && (
              <Checkboxes
                label=""
                checked={
                  !!selectedOptions.find((opt) => opt.value === option.value)
                }
                onChange={() => handleOptionClick(option)}
                disabled={false}
              />
            )}
            <p className={`${getFontSize()} text-szBlack700`}>{option.label}</p>
          </div>
        ))}
        {filteredOptions.length === 0 && (
          <div className="px-4 py-2 text-sm text-szGrey500">
            No options found
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full min-w-[40px]">
      <label
        className={`absolute text-caption-all-caps font-dmSans tracking-widest
          top-1 scale-100 -translate-y-2/3 left-3 origin-[0] bg-white px-1 
          z-0 uppercase ${disabled ? "text-gray-400" : "text-szGrey500"}`}
        htmlFor={label}
      >
        {label}
      </label>

      <button
        ref={buttonRef}
        onClick={(e) => {
          if (disabled) return;
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`px-4 w-full rounded-custom-md flex justify-between items-center outline outline-1 outline-gray-300 ${
          isOpen ? "outline-szPrimary500 text-szPrimary500" : ""
        } ${
          disabled
            ? "bg-gray-50 text-gray-400 cursor-not-allowed py-3"
            : multiSelect && selectedOptions.length > 0
            ? "bg-szWhite100 py-2"
            : "bg-white py-3 text-szBlack700 hover:outline-szPrimary900 hover:text-szPrimary900 active:outline-szBlack700 active:text-szBlack700 group"
        }`}
      >
        <div className="flex items-center space-x-2">
          {multiSelect && selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1 my-1">
              {selectedOptions.map((option) => (
                <div onClick={(e) => e.stopPropagation()} key={option.value}>
                  <Chip
                    label={option.label}
                    onDelete={() => handleOptionRemove(option.value)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p
              className={`${getFontSize()} text-left ${
                disabled
                  ? "text-gray-400"
                  : "text-szBlack700 group-hover:text-szPrimary900"
              }`}
            >
              {selectedOptions.length > 0
                ? selectedOptions[0].label
                : placeholder}
            </p>
          )}
        </div>
        <span className="ml-2">
          {isOpen ? (
            <ArrowUp2 className="icon icon-sm" />
          ) : (
            <ArrowDown2 className="icon icon-sm" />
          )}
        </span>
      </button>

      {isOpen &&
        (usePortal && position
          ? ReactDOM.createPortal(DropdownMenu, document.body)
          : !usePortal
          ? DropdownMenu
          : null)}
    </div>
  );
};

export default Dropdown;
