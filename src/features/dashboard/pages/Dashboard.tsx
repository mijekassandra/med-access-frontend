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
import GenderDistributionChart from "../components/GenderDistributionChart";
import AgeRangeChart from "../components/AgeRangeChart";
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

// Greeting utility function
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening";
  } else {
    return "Good day";
  }
};

const Dashboard: React.FC = () => {
  const [showWelcomeSnackbar, setShowWelcomeSnackbar] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role as "admin" | "doctor" | "user" | undefined;

  // Fetch data for dashboard cards
  const { data: usersData } = useGetAllUsersQuery(undefined, {
    // Allow both admin and doctor to fetch users for charts
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

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check if we should show welcome snackbar
    const shouldShowWelcome = sessionStorage.getItem("showWelcomeSnackbar");

    if (shouldShowWelcome === "true" && userRole) {
      setShowWelcomeSnackbar(true);
      // Remove the flag so it doesn't show again on page refresh
      sessionStorage.removeItem("showWelcomeSnackbar");
    }
  }, [userRole]);

  // Format date and time
  const formattedDate = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <>
      <ContainerWrapper className="space-y-4">
        {/* Greeting and Time/Date Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Greeting Section */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-szPrimary100 rounded-lg">
                <Profile2User size={24} className="text-szPrimary700" />
              </div>
              <div>
                <h2 className="text-h5 font-bold text-szBlack700">
                  {getGreeting()}, {user?.firstName || "User"}!
                </h2>
                <p className="text-body-small-reg text-szDarkGrey600 mt-1">
                  Welcome back to your dashboard
                </p>
              </div>
            </div>

            {/* Time and Date Section */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
              {/* Time - Large and Bold */}
              <div className="text-szBlack700">
                <p className="text-xl sm:text-2xl font-bold">{formattedTime}</p>
              </div>

              {/* Date - Smaller but readable */}
              <div className="text-szBlack700 mt-1">
                <p className="text-base sm:text-lg font-medium">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Patient Statistics Charts - Available for both admin and doctor */}
        {(userRole === "admin" || userRole === "doctor") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GenderDistributionChart />
            <AgeRangeChart />
          </div>
        )}

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
