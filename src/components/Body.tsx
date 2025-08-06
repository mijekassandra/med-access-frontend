import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

//component
import Appbar from "./Appbar";

// Feature pages
import Dashboard from "../features/dashboard/pages/Dashboard";
import MedicalRecordsIndex from "../features/medical-records";
import Telemedicine from "../features/telemedicine/pages/Telemedicine";
import Inventory from "../features/inventory/Inventory";
import HealthEducation from "../features/health-education/HealthEducation";
import Reports from "../features/reports/Reports";

interface BodyProps {
  children?: React.ReactNode;
}

const Body = ({ children }: BodyProps) => {
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
      case "/inventory":
        return {
          title: "Inventory",
          subheader: "Manage inventory and stock",
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
      default:
        return {
          title: "Dashboard",
          subheader: "Welcome to your medical dashboard",
        };
    }
  };

  const { title, subheader } = getPageInfo(location.pathname);

  return (
    <div className="flex-1 min-h-screen flex flex-col">
      <Appbar title={title} subheader={subheader} />
      <div className="flex-1 overflow-auto">
        <Routes>
          {/* Main Application Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medical-records/*" element={<MedicalRecordsIndex />} />
          <Route path="/telemedicine/*" element={<Telemedicine />} />
          <Route path="/health-education/*" element={<HealthEducation />} />
          <Route path="/inventory/*" element={<Inventory />} />
          <Route path="/reports/*" element={<Reports />} />
        </Routes>
        {children}
      </div>
    </div>
  );
};

export default Body;
