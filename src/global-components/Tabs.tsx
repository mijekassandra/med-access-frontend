import React, { useState, useEffect, useRef } from "react";
import DropdownMenu from "./DropdownMenu";
import { ArrowDown2 } from "iconsax-react";

export interface TabOption {
  label: string;
  value: string;
  number?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  options: TabOption[];
  activeIndex: number;
  onTabChange: (idx: number) => void;
}

const MOBILE_BREAKPOINT = 640; // Tailwind's 'sm' breakpoint

const Tabs: React.FC<TabsProps> = ({ options, activeIndex, onTabChange }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Prepare dropdown items (label only)
  const dropdownItems = options.map((opt, idx) => ({
    label: opt.label,
    onClick: () => {
      onTabChange(idx);
      setDropdownOpen(false);
    },
  }));

  const baseClasses =
    "flex items-center justify-center px-[16px] py-[8px] border border-[1px] cursor-pointer gap-[8px] border-szGrey200 w-fit min-w-[50px]";
  const shapeClass = {
    left: "rounded-l-[23px]",
    middle: "",
    right: "rounded-r-[23px]",
  };
  const inactiveStyle = "text-szGrey500 bg-[#F9F9F9]";
  const activeStyle = "text-szPrimary500 bg-white";

  if (isMobile) {
    const activeTab = options[activeIndex];
    return (
      <div className="relative w-fit " ref={menuRef}>
        <button
          className={`flex items-center justify-between w-fit px-[16px] py-[8px] border border-[1px] border-szGrey200 rounded-[23px] bg-white gap-[8px] ${activeStyle}`}
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <span className="flex items-center gap-2 min-w-[80px]">
            <p className="text-body-small-reg text-szPrimary500 min-w-[50px]">
              {activeTab.label}
            </p>
            {activeTab.number !== undefined && (
              <>
                <p className="text-body-small-reg text-szGrey300">|</p>
                <p className="text-caption-strong text-szSecondary500">
                  {activeTab.number}
                </p>
              </>
            )}
          </span>
          <ArrowDown2 className="icon-sm" color="#292D32" />
        </button>
        {dropdownOpen && (
          <DropdownMenu
            items={dropdownItems}
            className="absolute left-0 mt-1 w-full"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex">
      {options.map((opt, idx) => {
        const type =
          idx === 0 ? "left" : idx === options.length - 1 ? "right" : "middle";
        const isActive = activeIndex === idx;
        const isFirst = idx === 0;

        return (
          <div
            key={idx}
            className={`flex grow ${baseClasses} ${shapeClass[type]} ${
              isActive ? activeStyle : inactiveStyle
            } ${!isFirst ? "-ml-[1px]" : ""}`}
            onClick={() => onTabChange(idx)}
          >
            {opt.label && (
              <p
                className={`text-body-small-reg ${
                  isActive ? activeStyle : inactiveStyle
                }`}
              >
                {opt.label}
              </p>
            )}
            {/* icon and number intentionally omitted for dropdown */}
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
