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
import LatestAnnouncement from "../components/LatestAnnouncement";
import UpcomingAppointments from "../components/UpcomingAppointments";
import LowStockMedicine from "../components/LowStockMedicine";
// import MedicalRecordsPieChart from "../../../components/MedicalRecordsPieChart";
// import GenericFilteredChart from "../../../components/GenericFilteredChart";
// import UserMedicalRecordTable from "../components/UserMedicalRecordTable";
// import PersonnelDashboardTable from "../components/PersonnelDashboardTable";

// Redux types
import type { RootState } from "../../../store";
import RecentPatientRecord from "../components/RecentPatientRecord";

// API hooks
import { useGetAllUsersQuery } from "../../user/api/userApi";
import { useGetMedicinesQuery } from "../../inventory/api/medicineInventoryApi";
import { useGetServicesQuery } from "../../services/api/serviceApi";
import { useGetAppointmentsQuery } from "../../telemedicine/api/appointmentApi";
import { useGetHealthEducationQuery } from "../../health-education/api/healthEducationApi";

const Dashboard: React.FC = () => {
  const [showWelcomeSnackbar, setShowWelcomeSnackbar] = useState(false);

  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role as "admin" | "doctor" | "user" | undefined;

  // Fetch data for dashboard cards
  const { data: usersData } = useGetAllUsersQuery(undefined, {
    skip: userRole === "doctor", // Skip if doctor role
  });
  const { data: medicinesData } = useGetMedicinesQuery();
  const { data: servicesData } = useGetServicesQuery(undefined, {
    skip: userRole === "doctor", // Skip if doctor role
  });
  const { data: appointmentsData } = useGetAppointmentsQuery(undefined, {
    skip: userRole !== "doctor", // Only fetch for doctor role
  });
  const { data: healthEducationData } = useGetHealthEducationQuery(undefined, {
    skip: userRole !== "doctor", // Only fetch for doctor role
  });

  // Extract counts
  const usersCount = usersData?.count || 0;
  const medicinesCount = medicinesData?.count || 0;
  const servicesCount = servicesData?.count || 0;
  const appointmentsCount = appointmentsData?.count || 0;
  const healthEducationCount = healthEducationData?.count || 0;

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
        <div className="flex flex-col sm:flex-row h-fit sm:h-96 gap-4 w-full">
          {/* Left Column ----------------------------------------------------*/}
          <div className="flex-[2] flex flex-col space-y-3">
            {userRole === "doctor" ? (
              <div className="grid gap-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <DashboardCard
                    title="Appointments"
                    value={appointmentsCount}
                    icon={<DocumentText1 />}
                    variant="green"
                  />
                  <DashboardCard
                    title="Inventory"
                    value={medicinesCount}
                    icon={<Box />}
                    variant="orange"
                  />
                  <DashboardCard
                    title="Health Education"
                    value={healthEducationCount}
                    icon={<Health />}
                    variant="blue"
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ">
                  <DashboardCard
                    title="Users"
                    value={usersCount}
                    icon={<Profile2User />}
                    variant="blue"
                  />
                  <DashboardCard
                    title="Medicine Inventory"
                    value={medicinesCount}
                    icon={<Box />}
                    variant="orange"
                  />

                  <DashboardCard
                    title="Services"
                    value={servicesCount}
                    icon={<Notepad />}
                    variant="green"
                  />
                </div>
              </div>
            )}

            <div className="h-[300px] sm:flex-1 sm:min-h-0">
              {userRole === "admin" ? (
                <LowStockMedicine />
              ) : (
                <UpcomingAppointments />
              )}
            </div>
          </div>

          {/* Right Column ----------------------------------------------------*/}
          <div className="flex-1 min-h-0">
            <LatestAnnouncement />
          </div>
        </div>

        {userRole === "admin" && (
          <>
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <UpcomingAppointments />
                <RecentPatientRecord />
              </div>
            </div>
          </>
        )}
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
