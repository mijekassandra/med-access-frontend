import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

//icons
import {
  Box,
  DocumentText1,
  Profile2User,
  Health,
  NotificationBing,
} from "iconsax-react";

//components
import DashboardCard from "../../../global-components/DashboardCard";
import ContainerWrapper from "../../../components/ContainerWrapper";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import GenericFilteredChart from "../../../components/GenericFilteredChart";
import MedicalRecordsPieChart from "../../../components/MedicalRecordsPieChart";
// import UserMedicalRecordTable from "../components/UserMedicalRecordTable";
// import PersonnelDashboardTable from "../components/PersonnelDashboardTable";

// Redux types
import type { RootState } from "../../../store";

const Dashboard: React.FC = () => {
  const [showWelcomeSnackbar, setShowWelcomeSnackbar] = useState(false);

  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role as "admin" | "doctor" | "user" | undefined;

  useEffect(() => {
    // Check if we should show welcome snackbar
    const shouldShowWelcome = sessionStorage.getItem("showWelcomeSnackbar");

    if (shouldShowWelcome === "true" && userRole) {
      setShowWelcomeSnackbar(true);
      // Remove the flag so it doesn't show again on page refresh
      sessionStorage.removeItem("showWelcomeSnackbar");
    }
  }, [userRole]);

  // const renderTable = () => {
  //   switch (userRole) {
  //     case "doctor":
  //       return <UserMedicalRecordTable />;
  //     case "admin":
  //       return <PersonnelDashboardTable />;
  //     default:
  //       return <div>Access denied</div>;
  //   }
  // };

  return (
    <>
      <ContainerWrapper className="space-y-8">
        {/* Dashboard Content */}
        {/* Quick Stats Cards */}
        {userRole === "doctor" ? (
          <div className="grid gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <DashboardCard
                title="Reports"
                value={1234}
                icon={<DocumentText1 />}
                variant="green"
              />
              <DashboardCard
                title="Inventory"
                value={1234}
                icon={<Box />}
                variant="orange"
              />
              <DashboardCard
                title="Health Education"
                value={1234}
                icon={<Health />}
                variant="blue"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <DashboardCard
                title="Users"
                value={1234}
                icon={<Profile2User />}
                variant="blue"
              />
              <DashboardCard
                title=" Medicine Inventory"
                value={1234}
                icon={<Box />}
                variant="orange"
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
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <GenericFilteredChart
            title="Appointment Statistics"
            data={{
              today: [
                {
                  label: "Completed",
                  value: 12,
                  color: "#B6CBBD",
                  hoverColor: "#284738",
                },
                {
                  label: "Pending",
                  value: 8,
                  color: "#FFE6B6",
                  hoverColor: "#FCB315",
                },
                {
                  label: "Cancelled",
                  value: 2,
                  color: "#FFEFEB",
                  hoverColor: "#FF5324",
                },
              ],
              weekly: [
                {
                  label: "Completed",
                  value: 85,
                  color: "#B6CBBD",
                  hoverColor: "#284738",
                },
                {
                  label: "Pending",
                  value: 45,
                  color: "#FFE6B6",
                  hoverColor: "#FCB315",
                },
                {
                  label: "Cancelled",
                  value: 12,
                  color: "#FFEFEB",
                  hoverColor: "#FF5324",
                },
              ],
              monthly: [
                {
                  label: "Completed",
                  value: 320,
                  color: "#B6CBBD",
                  hoverColor: "#284738",
                },
                {
                  label: "Pending",
                  value: 180,
                  color: "#FFE6B6",
                  hoverColor: "#FCB315",
                },
                {
                  label: "Cancelled",
                  value: 45,
                  color: "#FFEFEB",
                  hoverColor: "#FF5324",
                },
              ],
              yearly: [
                {
                  label: "Completed",
                  value: 3840,
                  color: "#B6CBBD",
                  hoverColor: "#284738",
                },
                {
                  label: "Pending",
                  value: 2160,
                  color: "#FFE6B6",
                  hoverColor: "#FCB315",
                },
                {
                  label: "Cancelled",
                  value: 540,
                  color: "#FFEFEB",
                  hoverColor: "#FF5324",
                },
              ],
            }}
            filterOptions={[
              { label: "Today", value: "today" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
              { label: "Yearly", value: "yearly" },
            ]}
            defaultFilter="today"
            chartHeight="h-52"
          />
          <MedicalRecordsPieChart patientRecords={150} pregnancyRecords={75} />
        </div>

        {/* {renderTable()} */}
      </ContainerWrapper>

      {/* Welcome Snackbar */}
      {userRole && (
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
      )}
    </>
  );
};

export default Dashboard;
