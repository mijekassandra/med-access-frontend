import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

//icons
import {
  Box,
  DocumentText1,
  Profile2User,
  Health,
  Notepad,
} from "iconsax-react";

//components
import DashboardCard from "../../../global-components/DashboardCard";
import ContainerWrapper from "../../../components/ContainerWrapper";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import GenericFilteredChart from "../../../components/GenericFilteredChart";
import MedicalRecordsPieChart from "../../../components/MedicalRecordsPieChart";
import LatestAnnouncement from "../components/LatestAnnouncement";
// import UserMedicalRecordTable from "../components/UserMedicalRecordTable";
// import PersonnelDashboardTable from "../components/PersonnelDashboardTable";
import UpcomingAppointments from "../components/UpcomingAppointments";

// Redux types
import type { RootState } from "../../../store";
import RecentPatientRecord from "../components/RecentPatientRecord";

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

  return (
    <>
      <ContainerWrapper className="space-y-4">
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
          {/* Left Column ---------------------------------------*/}
          <div className="lg:col-span-2 space-y-3">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <DashboardCard
                    title="Users"
                    value={1234}
                    icon={<Profile2User />}
                    variant="blue"
                  />
                  <DashboardCard
                    title="Medicine Inventory"
                    value={1234}
                    icon={<Box />}
                    variant="orange"
                  />

                  <DashboardCard
                    title="Services"
                    value={1234}
                    icon={<Notepad />}
                    variant="green"
                  />

                  {/* <DashboardCard
                title="Reports"
                value={1234}
                icon={<DocumentText1 />}
                variant="grey"
              /> */}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1">
              <MedicalRecordsPieChart
                patientRecords={150}
                pregnancyRecords={75}
              />
            </div>
          </div>
          {/* Right Column ---------------------------------------*/}
          <div className="lg:col-span-1">
            <LatestAnnouncement />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <UpcomingAppointments />
            <RecentPatientRecord />
          </div>
        </div>
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
