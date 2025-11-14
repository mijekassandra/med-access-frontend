import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  direction?: "up" | "down"; // Force direction, overrides auto-detection
}

const PopoverMenu: React.FC<PopoverMenuProps> = ({
  items,
  size = "small",
  color,
  position = "right",
  width = "w-fit",
  direction: forcedDirection,
}) => {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [dropdownPosition, setDropdownPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Helper to parse Tailwind width classes to pixels
  const parseWidth = (widthClass: string): number => {
    if (widthClass === "w-fit") return 144; // Default estimate for w-fit

    const match = widthClass.match(/w-(\d+)/);
    if (match) {
      // Tailwind: w-{n} = n * 0.25rem = n * 4px
      return parseInt(match[1]) * 4;
    }
    return 144; // Default fallback
  };

  // Function to determine if dropdown should open upward
  const determineDirection = () => {
    // If direction is forced, use it
    if (forcedDirection) return forcedDirection;

    if (!buttonRef.current) return "down";

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 200; // Approximate height of dropdown menu

    // If there's not enough space below, open upward
    if (rect.bottom + dropdownHeight > viewportHeight - 20) {
      return "up";
    }
    return "down";
  };

  // Calculate dropdown position for fixed positioning
  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return null;

    const rect = buttonRef.current.getBoundingClientRect();
    const dir = determineDirection();

    let left = rect.left;
    if (position === "left") {
      // For left position, align right edge of dropdown with right edge of button
      const estimatedWidth = parseWidth(width);
      left = rect.right - estimatedWidth;
    }

    if (dir === "down") {
      return {
        top: rect.bottom + 4,
        left,
      };
    } else {
      // For "up" direction, position above the button
      // bottom property is distance from viewport bottom
      // We want dropdown bottom to be 4px above button top (at rect.top - 4)
      // So: bottom = window.innerHeight - (rect.top - 4) = window.innerHeight - rect.top + 4
      return {
        bottom: window.innerHeight - rect.top + 4,
        left,
      };
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Check if click is inside the button
      if (buttonRef.current?.contains(target)) {
        return; // Don't close if clicking the button
      }

      // Check if click is inside the dropdown
      if (dropdownRef.current?.contains(target)) {
        return; // Don't close if clicking inside dropdown
      }

      // Click is outside both, close the dropdown
      setOpen(false);
    }

    // Use a small delay to ensure refs are attached, then listen for clicks
    // Don't use capture phase so button clicks can fire first
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  // Update position on scroll/resize when open
  useEffect(() => {
    if (open && buttonRef.current) {
      const updatePosition = () => {
        const pos = calculateDropdownPosition();
        if (pos) setDropdownPosition(pos);
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [open, position, width, forcedDirection]);

  const handleToggle = () => {
    const newDirection = determineDirection();
    setDirection(newDirection);
    const pos = calculateDropdownPosition();
    setDropdownPosition(pos);
    setOpen((prev) => !prev);
  };

  return (
    <>
      <div className="relative" ref={buttonRef}>
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
          onClick={handleToggle}
          size={size}
          variant="ghost"
          customColor={color}
        />
      </div>
      {open &&
        dropdownPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <DropdownMenu
            ref={dropdownRef}
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
            style={{
              position: "fixed",
              ...(dropdownPosition.top !== undefined && {
                top: `${dropdownPosition.top}px`,
              }),
              ...(dropdownPosition.bottom !== undefined && {
                bottom: `${dropdownPosition.bottom}px`,
              }),
              left: `${dropdownPosition.left}px`,
              zIndex: 1000,
            }}
          />,
          document.body
        )}
    </>
  );
};

export default PopoverMenu;
