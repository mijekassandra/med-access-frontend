import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Icons
import {
  Home2,
  DocumentText1,
  Calendar,
  Profile2User,
  HambergerMenu,
  Logout,
  NotificationBing,
} from "iconsax-react";

// Assets

// Components
import SnackbarAlert from "../../global-components/SnackbarAlert";
import ButtonsIcon from "../../global-components/ButtonsIcon";
import MobileDashboard from "./components/MobileDashboard";
import BottomNavigation from "./mobile-global-components/BottomNavigation";
import MobileAnnouncement from "./pages/MobileAnnouncement";
import MobileAppointment from "./pages/MobileAppointment";
import MobileMedicalRecords from "./pages/MobileMedicalRecords";
import MobileHealthEducation from "./pages/MobileHealthEducation";
import MobileNotification from "./pages/MobileNotification";
import MobileBookInPerson from "./pages/MobileBookInPerson";
import MobileTelemedicine from "./pages/MobileTelemedicine";
import MobileAllAppointments from "./pages/MobileAllAppointments";
import MobilePatientProfile from "./pages/MobilePatientProfile";
import MobilePatientSettings from "./pages/MobilePatientSettings";

const PatientMobileApp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showWelcomeSnackbar, setShowWelcomeSnackbar] = useState(false);
  const [userName, setUserName] = useState("Patient");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadNotificationCount] = useState(1); // Mock unread count

  // Get current active nav item based on the current route
  const getActiveNavItem = () => {
    const path = location.pathname;
    switch (path) {
      case "/patient-dashboard":
        return "home";
      case "/patient-announcement":
        return "announcement";
      case "/patient-appointment":
      case "/patient-book-in-person":
      case "/patient-telemedicine":
      case "/patient-all-appointments":
        return "appointment";
      case "/patient-record":
        return "record";
      case "/patient-health-education":
        return "health-education";
      case "/patient-notification":
        return "notification";
      case "/patient-profile":
        return "profile";
      case "/patient-settings":
        return "settings";
      default:
        return "home";
    }
  };

  const activeBottomNav = getActiveNavItem();

  useEffect(() => {
    // Check if we should show welcome snackbar
    const shouldShowWelcome = sessionStorage.getItem("showWelcomeSnackbar");
    const storedEmail = sessionStorage.getItem("userEmail");

    if (shouldShowWelcome === "true") {
      setShowWelcomeSnackbar(true);
      // Remove the flag so it doesn't show again on page refresh
      sessionStorage.removeItem("showWelcomeSnackbar");
    }

    if (storedEmail) {
      setUserName(storedEmail.split("@")[0]);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleBottomNavClick = (itemId: string) => {
    // Navigate to the appropriate route based on the item ID
    switch (itemId) {
      case "home":
        navigate("/patient-dashboard");
        break;
      case "announcement":
        navigate("/patient-announcement");
        break;
      case "appointment":
        navigate("/patient-appointment");
        break;
      case "record":
        navigate("/patient-record");
        break;
      case "health-education":
        navigate("/patient-health-education");
        break;
      case "notification":
        navigate("/patient-notification");
        break;
      default:
        navigate("/patient-dashboard");
    }
  };

  const handleNotificationClick = () => {
    navigate("/patient-notification");
  };

  // Render content based on current route
  const renderContent = () => {
    const path = location.pathname;

    // Handle specific appointment-related routes
    if (path === "/patient-book-in-person") {
      return (
        <MobileBookInPerson
          onNavigateBack={() => navigate("/patient-appointment")}
        />
      );
    }

    if (path === "/patient-telemedicine") {
      return (
        <MobileTelemedicine
          onNavigateBack={() => navigate("/patient-appointment")}
        />
      );
    }

    if (path === "/patient-all-appointments") {
      return <MobileAllAppointments />;
    }

    // Handle other routes based on active bottom nav
    switch (activeBottomNav) {
      case "home":
        return <MobileDashboard />;
      case "announcement":
        return <MobileAnnouncement />;
      case "appointment":
        return (
          <MobileAppointment
            onNavigateToBooking={() => navigate("/patient-book-in-person")}
            onNavigateToTelemedicine={() => navigate("/patient-telemedicine")}
          />
        );
      case "record":
        return <MobileMedicalRecords />;
      case "health-education":
        return <MobileHealthEducation />;
      case "notification":
        return <MobileNotification />;
      case "profile":
        return <MobilePatientProfile />;
      case "settings":
        return <MobilePatientSettings />;
      default:
        return <MobileDashboard />;
    }
  };

  const menuItems = [
    {
      icon: Home2,
      label: "Dashboard",
      path: "/patient-dashboard",
      active: location.pathname === "/patient-dashboard",
    },
    {
      icon: DocumentText1,
      label: "Profile",
      path: "/patient-profile",
      active: location.pathname === "/patient-profile",
    },
    {
      icon: Calendar,
      label: "Settings",
      path: "/patient-settings",
      active: location.pathname === "/patient-settings",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-szPrimary200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <ButtonsIcon
            icon={<HambergerMenu size={24} />}
            size="medium"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          ></ButtonsIcon>
        </div>

        {/* Notification Bell Icon */}
        <div className="relative">
          <ButtonsIcon
            icon={<NotificationBing size={24} />}
            size="medium"
            variant="ghost"
            onClick={handleNotificationClick}
            customColor="szPrimary500"
          />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-0 -right-0 bg-szSecondary500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`bg-szBackground w-[300px] h-full transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-6 justify-between h-full ">
            {/* User Profile Section */}

            <div className="w-full">
              <div className="bg-szPrimary rounded-xl p-6">
                <div className="flex flex-col items-center text-center ">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-szWhite100/20 rounded-full flex items-center justify-center mb-4">
                    <Profile2User size={40} className="text-szWhite100" />
                  </div>

                  {/* User Name */}
                  <h2 className="text-szWhite100 text-h4">John Doe</h2>

                  {/* User Email */}
                  <p className="text-szWhite100/80 text-body-reg">
                    {sessionStorage.getItem("userEmail") ||
                      "patient@example.com"}
                  </p>
                </div>
              </div>

              <nav className="flex flex-col gap-1 m-4">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg text-h4 transition-colors ${
                      item.active
                        ? "bg-szPrimary700 text-szWhite100"
                        : "text-szWhite100 hover:bg-szPrimary700"
                    }`}
                  >
                    <item.icon
                      size={20}
                      variant={item.active ? "Bold" : "Outline"}
                    />
                    <h6 className="text-h6 text-szWhite100 font-medium tracking-wide">
                      {item.label}
                    </h6>
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-szGray200 m-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-lg text-h4 transition-colors text-szWhite100 hover:bg-szPrimary700 w-full"
              >
                <Logout size={20} variant="Outline" />
                <h6 className="text-h6 text-szWhite100 font-medium tracking-wide">
                  Logout
                </h6>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BODY Content ------------------------------------*/}
      <div className="pb-16">{renderContent()}</div>

      {/* Bottom Navigation - Only show when sidebar is not open */}
      {!isMenuOpen && (
        <BottomNavigation
          activeItem={activeBottomNav}
          onItemClick={handleBottomNavClick}
        />
      )}

      {/* Welcome Snackbar */}
      {showWelcomeSnackbar && (
        <SnackbarAlert
          message={`Welcome to MedAccess, ${userName}!`}
          type="success"
          isOpen={showWelcomeSnackbar}
          onClose={() => setShowWelcomeSnackbar(false)}
        />
      )}
    </div>
  );
};

export default PatientMobileApp;
