import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

//icons
import {
  DocumentText,
  Monitor,
  Logout,
  ArchiveBox,
  Health,
  Element4,
  ArrowLeft2,
  ArrowRight2,
  ArchiveBook,
  Profile2User,
  NotificationBing,
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
  userRole?: "admin" | "doctor" | "patient";
  userName?: string;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  userRole = "doctor",
  className = "",
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isManualCollapse, setIsManualCollapse] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Check if screen width is small (640px) or below
      const isSmall = window.innerWidth <= 640;
      setIsSmallScreen(isSmall);

      // Check if screen width is medium (768px) or below
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
        setIsManualCollapse(false); // Reset manual flag on small screens
      } else {
        // Only auto-expand if it wasn't manually collapsed
        if (!isManualCollapse) {
          setIsCollapsed(false);
        }
      }
    };

    // Set initial state based on screen size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [isManualCollapse]);

  //handle logout
  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userEmail");
    navigate("/");
  };

  // Handle manual collapse toggle
  const handleManualToggle = () => {
    // Prevent toggle on small screens
    if (isSmallScreen) {
      return;
    }

    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    setIsManualCollapse(newCollapsedState);
  };

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
        // {
        //   id: "medicine-inventory",
        //   label: "MEDICINE INVENTORY",
        //   icon: <ArchiveBox />,
        //   path: "/medicine-inventory",
        // },
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
          id: "users",
          label: "USERS",
          icon: <Profile2User />,
          path: "/users",
        },
        {
          id: "medicine-inventory",
          label: "MEDICINE INVENTORY",
          icon: <ArchiveBox />,
          path: "/medicine-inventory",
        },
        {
          id: "patient-records",
          label: "PATIENT RECORDS",
          icon: <DocumentText />,
          path: "/patient-records",
        },
        {
          id: "announcements",
          label: "ANNOUNCEMENTS",
          icon: <NotificationBing />,
          path: "/announcements",
        },
        {
          id: "reports",
          label: "REPORTS",
          icon: <ArchiveBook />,
          path: "/reports",
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
      className={`bg-szBackground text-white min-h-screen flex justify-between flex-col py-6 px-4 gap-6 transition-all duration-300 overflow-y-auto ${
        isCollapsed ? "w-[84px] " : "w-[256px]"
      } ${className}`}
    >
      <div className="w-full">
        <div
          className={`${
            isCollapsed ? "justify-center" : "justify-end"
          } flex  mb-4`}
        >
          <div className={isSmallScreen ? "opacity-50" : ""}>
            <ButtonsIcon
              icon={isCollapsed ? <ArrowRight2 /> : <ArrowLeft2 />}
              size="medium"
              onClick={handleManualToggle}
              disabled={isSmallScreen}
            />
          </div>
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
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            return (
              <li key={item.id}>
                <Link
                  title={item.label}
                  to={item.path}
                  className={`group relative flex items-center ${
                    isCollapsed ? "justify-center" : "space-x-3"
                  } px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-szPrimary900 text-white"
                      : "text-szWhite100 hover:bg-szPrimary700 hover:text-white"
                  }`}
                  // title={isCollapsed ? item.label : undefined}
                >
                  {React.cloneElement(item.icon as React.ReactElement, {
                    className: `flex-shrink-0 ${
                      isCollapsed ? "w-5 h-5" : "icon-md"
                    }`,
                  })}
                  {!isCollapsed && (
                    <p className="text-szWhite100 text-body-small-strong">
                      {item.label}
                    </p>
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
          onClick={handleLogout}
          className={`group relative flex items-center w-full px-4 py-3 text-szWhite100 hover:bg-szPrimary700 hover:text-white rounded-lg transition-colors duration-200 ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <Logout
            className={`flex-shrink-0 ${isCollapsed ? "icon-sm" : "icon-md"}`}
          />
          {!isCollapsed && (
            <p className="text-szWhite100 text-body-small-strong">Logout</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
