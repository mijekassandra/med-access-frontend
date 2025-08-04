import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

//icons
import {
  DocumentText,
  Monitor,
  Logout,
  User,
  Calendar,
  ArchiveBox,
  Health,
  Element4,
  ArrowLeft2,
  ArrowRight2,
  ArchiveBook,
} from "iconsax-react";

//assets
import logo from "../assets/med_access_logo.png";
import ButtonsIcon from "./ButtonsIcon";

// Types for menu items
export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive?: boolean;
}

export interface SidebarProps {
  userRole?: "admin" | "doctor" | "client";
  userName?: string;
  onLogout?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  userRole = "admin",
  onLogout,
  className = "",
}) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Menu configurations for different roles
  const getMenuItems = (role: string): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        id: "dashboard",
        label: "DASHBOARD",
        icon: <Element4 />,
        path: "/dashboard",
      },
    ];

    const roleSpecificItems: Record<string, MenuItem[]> = {
      doctor: [
        {
          id: "medical-records",
          label: "MEDICAL RECORDS",
          icon: <DocumentText />,
          path: "/medical-records",
        },
        {
          id: "telemedicine",
          label: "TELEMEDICINE",
          icon: <Monitor />,
          path: "/telemedicine",
        },
        {
          id: "inventory",
          label: "INVENTORY",
          icon: <ArchiveBox />,
          path: "/inventory",
        },
        {
          id: "health-education",
          label: "HEALTH EDUCATION",
          icon: <Health />,
          path: "/health-education",
        },
        {
          id: "reports",
          label: "REPORTS",
          icon: <ArchiveBook />,
          path: "/reports",
        },
      ],
      admin: [
        {
          id: "medical-records",
          label: "MEDICAL RECORDS",
          icon: <DocumentText />,
          path: "/medical-records",
        },
        {
          id: "telemedicine",
          label: "TELEMEDICINE",
          icon: <Monitor />,
          path: "/telemedicine",
        },
        {
          id: "appointments",
          label: "APPOINTMENTS",
          icon: <Calendar />,
          path: "/appointments",
        },
        {
          id: "patients",
          label: "PATIENTS",
          icon: <User />,
          path: "/patients",
        },
      ],
    };

    return [
      ...baseItems,
      ...(roleSpecificItems[role] || roleSpecificItems.staff),
    ];
  };

  const menuItems = getMenuItems(userRole);

  return (
    <div
      className={`bg-szBackground text-white min-h-screen flex justify-between flex-col py-6 px-4 gap-6 transition-all duration-300 ${
        isCollapsed ? "w-[84px]" : "w-[256px]"
      } ${className}`}
    >
      <div className="w-full">
        <div
          className={`${
            isCollapsed ? "justify-center" : "justify-end"
          } flex  mb-4`}
        >
          <ButtonsIcon
            icon={isCollapsed ? <ArrowRight2 /> : <ArrowLeft2 />}
            size="medium"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {/* Logo Section */}
        <section className="flex items-center justify-center w-full">
          {!isCollapsed && (
            <img src={logo} alt="med-access-logo" className="w-[150px]" />
          )}
        </section>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`group relative flex items-center ${
                    isCollapsed ? "justify-center" : "space-x-3"
                  } px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-szPrimary900 text-white"
                      : "text-szWhite100 hover:bg-szPrimary700 hover:text-white"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {React.cloneElement(item.icon as React.ReactElement, {
                    className: "icon-md",
                  })}
                  {!isCollapsed && (
                    <p className="text-szWhite100 text-body-small-strong">
                      {item.label}
                    </p>
                  )}

                  {/* Tooltip - only show when collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                      {/* Tooltip arrow */}
                      <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-l-0 border-r-4 border-t-2 border-b-2 border-l-transparent border-r-gray-800 border-t-transparent border-b-transparent"></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="border-t border-szPrimary900 pt-4">
        <button
          onClick={onLogout}
          className={`group relative flex items-center w-full px-4 py-3 text-szWhite100 hover:bg-szPrimary700 hover:text-white rounded-lg transition-colors duration-200 ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <Logout className="icon-md" />
          {!isCollapsed && (
            <p className="text-szWhite100 text-body-small-strong">Logout</p>
          )}

          {/* Tooltip for logout - only show when collapsed */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Logout
              {/* Tooltip arrow */}
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-l-0 border-r-4 border-t-2 border-b-2 border-l-transparent border-r-gray-800 border-t-transparent border-b-transparent"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
