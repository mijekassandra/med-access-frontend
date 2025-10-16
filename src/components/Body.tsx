import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

//component
import Appbar from "./Appbar";

// Feature pages
import Dashboard from "../features/dashboard/pages/Dashboard";
import MedicalRecordsIndex from "../features/medical-records";
import Telemedicine from "../features/telemedicine/pages/Telemedicine";
import Inventory from "../features/inventory/Inventory";
import HealthEducation from "../features/health-education/HealthEducation";
import Reports from "../features/reports/Reports";
import User from "../features/user/User";
import PatientRecords from "../features/patient-records/PatientRecords";
import Announcement from "../features/announcements/Announcement";

interface BodyProps {
  children?: React.ReactNode;
  userRole?: "admin" | "doctor" | "patient";
}

const Body = ({ children, userRole = "doctor" }: BodyProps) => {
  const location = useLocation();

  // Function to get title and subheader based on current path
  const getPageInfo = (pathname: string) => {
    switch (pathname) {
      case "/dashboard":
        return {
          title: "Dashboard",
          subheader: "Welcome to your medical dashboard",
        };
      case "/medical-records":
      case "/medical-records/pregnancy-records":
        return {
          title: "Medical Records",
          subheader: "Manage and view patient medical records",
        };
      case "/telemedicine":
        return {
          title: "Telemedicine",
          subheader: "Manage virtual consultations and appointments",
        };
      case "/users":
        return {
          title: "Users",
          subheader: "Manage all patients, and personnel",
        };
      case "/medicine-inventory":
        return {
          title: "Medicine Inventory",
          subheader: "Manage medicine inventory ",
        };
      case "/patient-records":
        return {
          title: "Patient Records",
          subheader: "Manage patient records",
        };
      case "/health-education":
        return {
          title: "Health Education",
          subheader: "Manage health education",
        };
      case "/reports":
        return {
          title: "Reports",
          subheader: "Manage health reports",
        };
      case "/users/":
      case "/users/personnels":
        return {
          title: "All Users",
          subheader: "Manage all patients, and personnel",
        };
      case "/announcements":
        return {
          title: "Announcements",
          subheader: "Manage announcements",
        };
      default:
        return {
          title: "Dashboard",
          subheader: "Welcome to your medical dashboard",
        };
    }
  };

  const { title, subheader } = getPageInfo(location.pathname);

  return (
    <div className="flex-1 h-screen flex flex-col overflow-hidden">
      <Appbar title={title} subheader={subheader} userRole={userRole} />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          {/* Main Application Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medical-records/*" element={<MedicalRecordsIndex />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/health-education" element={<HealthEducation />} />
          <Route path="/medicine-inventory" element={<Inventory />} />
          <Route path="/users/*" element={<User />} />
          <Route path="/patient-records" element={<PatientRecords />} />
          <Route path="/announcements" element={<Announcement />} />
          <Route path="/reports" element={<Reports />} />

          {/* Catch all non-existent routes and redirect to 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        {children}
      </div>
    </div>
  );
};

export default Body;
