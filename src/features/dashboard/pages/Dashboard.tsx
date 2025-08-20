import React, { useState, useEffect } from "react";

//icons
import {
  Box,
  Calendar,
  DocumentText1,
  NotificationBing,
  Profile2User,
  UserSquare,
  Health,
} from "iconsax-react";

//components
import DashboardCard from "../../../global-components/DashboardCard";
import ContainerWrapper from "../../../components/ContainerWrapper";
import UserMedicalRecordTable from "../components/UserMedicalRecordTable";
import PersonnelDashboardTable from "../components/PersonnelDashboardTable";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

const Dashboard: React.FC = () => {
  const [showWelcomeSnackbar, setShowWelcomeSnackbar] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "doctor">("doctor");

  useEffect(() => {
    // Check if we should show welcome snackbar
    const shouldShowWelcome = sessionStorage.getItem("showWelcomeSnackbar");
    const storedRole = sessionStorage.getItem("userRole") as
      | "admin"
      | "doctor"
      | null;

    if (shouldShowWelcome === "true" && storedRole) {
      setUserRole(storedRole);
      setShowWelcomeSnackbar(true);
      // Remove the flag so it doesn't show again on page refresh
      sessionStorage.removeItem("showWelcomeSnackbar");
    }
  }, []);

  const renderTable = () => {
    switch (userRole) {
      case "doctor":
        return <UserMedicalRecordTable />;
      case "admin":
        return <PersonnelDashboardTable />;
      default:
        return <div>Access denied</div>;
    }
  };

  return (
    <>
      <ContainerWrapper className="space-y-8">
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Quick Stats Cards */}
          {userRole === "doctor" ? (
            <>
              <DashboardCard
                title="Medical Records"
                value={1234}
                icon={<Profile2User />}
                variant="blue"
              />
              <DashboardCard
                title="Inventory"
                value={1234}
                icon={<Box />}
                variant="orange"
              />
              <DashboardCard
                title="Appointment Requests"
                value={1234}
                icon={<Calendar />}
                variant="purple"
              />
              <DashboardCard
                title="Health Education"
                value={1234}
                icon={<Health />}
                variant="green"
              />

              <DashboardCard
                title="Reports"
                value={1234}
                icon={<DocumentText1 />}
                variant="grey"
                className="md:col-span-2 lg:col-span-1"
              />
            </>
          ) : (
            <>
              <DashboardCard
                title="Users"
                value={1234}
                icon={<Profile2User />}
                variant="blue"
              />
              <DashboardCard
                title="Inventory"
                value={1234}
                icon={<Box />}
                variant="orange"
              />
              <DashboardCard
                title="Patient Records"
                value={1234}
                icon={<UserSquare />}
                variant="purple"
              />
              <DashboardCard
                title="Announcements"
                value={1234}
                icon={<NotificationBing />}
                variant="green"
              />

              <DashboardCard
                title="Reports"
                value={1234}
                icon={<DocumentText1 />}
                variant="grey"
                className="md:col-span-2 lg:col-span-1"
              />
            </>
          )}
        </div>

        {renderTable()}
      </ContainerWrapper>

      {/* Welcome Snackbar */}
      <SnackbarAlert
        isOpen={showWelcomeSnackbar}
        title={`Welcome ${
          userRole.charAt(0).toUpperCase() + userRole.slice(1)
        }!`}
        message={`You have successfully logged in as ${userRole}.`}
        type="success"
        onClose={() => setShowWelcomeSnackbar(false)}
        duration={4000}
        position={{ vertical: "top", horizontal: "center" }}
        animation="slide-left"
        showCloseButton={false}
      />
    </>
  );
};

export default Dashboard;
