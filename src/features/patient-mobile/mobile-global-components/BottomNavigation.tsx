import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home2,
  NotificationBing,
  DocumentText1,
  Health,
  Calendar2,
} from "iconsax-react";

interface BottomNavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  active: boolean;
}

interface BottomNavigationProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeItem,
  onItemClick,
}) => {
  const navigate = useNavigate();

  const navItems: BottomNavItem[] = [
    {
      id: "home",
      icon: Home2,
      label: "Home",
      path: "/patient-dashboard",
      active: activeItem === "home",
    },
    {
      id: "announcement",
      icon: NotificationBing,
      label: "Announcement",
      path: "/patient-announcement",
      active: activeItem === "announcement",
    },
    {
      id: "appointment",
      icon: Calendar2,
      label: "Appointment",
      path: "/patient-appointment",
      active: activeItem === "appointment",
    },
    {
      id: "record",
      icon: DocumentText1,
      label: "Record",
      path: "/patient-record",
      active: activeItem === "record",
    },
    {
      id: "health-education",
      icon: Health,
      label: "Health Education",
      path: "/patient-health-education",
      active: activeItem === "health-education",
    },
  ];

  const handleItemClick = (item: BottomNavItem) => {
    // Use React Router navigation
    navigate(item.path);
    // Also call the parent's onItemClick for any additional logic
    onItemClick(item.id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-szWhite100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-szGray200 z-40">
      <div className="flex items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`flex flex-1 flex-col items-center gap-1 py-2 px-3 transition-colors ${
              item.active ? "text-szPrimary" : "text-szGray500"
            }`}
          >
            <item.icon
              size={24}
              variant={item.active ? "Bold" : "Outline"}
              className={item.active ? "text-szSecondary500" : "text-szGrey500"}
            />
            <p
              className={`text-xs font-medium text-center leading-tight ${
                item.active ? "text-szSecondary500" : "text-szGrey500"
              }`}
            >
              {item.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
