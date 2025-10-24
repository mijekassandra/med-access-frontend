import React, { useState, useRef, useEffect } from "react";
import { More } from "iconsax-react";
import ButtonsIcon from "./ButtonsIcon";
import DropdownMenu, { type DropdownMenuItem } from "./DropdownMenu";

interface PopoverMenuProps {
  items: DropdownMenuItem[];
  zIndex?: string;
  size?: "small" | "medium" | "large";
  color?: string;
  position?: "left" | "right";
  width?: string;
}

const PopoverMenu: React.FC<PopoverMenuProps> = ({
  items,
  size = "small",
  color,
  position = "right",
  width = "w-fit",
}) => {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const menuRef = useRef<HTMLDivElement>(null);

  // Function to determine if dropdown should open upward
  const determineDirection = () => {
    if (!menuRef.current) return "down";

    const rect = menuRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 200; // Approximate height of dropdown menu

    // If there's not enough space below, open upward
    if (rect.bottom + dropdownHeight > viewportHeight - 20) {
      return "up";
    }
    return "down";
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <ButtonsIcon
        icon={
          <More
            className={`${
              size === "small"
                ? "icon-sm"
                : size === "medium"
                ? "icon-md"
                : "icon-lg"
            } cursor-pointer`}
          />
        }
        onClick={() => {
          const newDirection = determineDirection();
          setDirection(newDirection);
          setOpen((prev) => !prev);
        }}
        size={size}
        variant="ghost"
        customColor={color}
      />
      {open && (
        <DropdownMenu
          items={items.map((item) => ({
            ...item,
            onClick: () => {
              item.onClick();
              setOpen(false);
            },
          }))}
          position={position}
          width={width}
          direction={direction}
        />
      )}
    </div>
  );
};

export default PopoverMenu;
