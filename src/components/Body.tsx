import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

//component
import Appbar from "./Appbar";

// Feature pages
import Dashboard from "../features/dashboard/pages/Dashboard";
import MedicalRecords from "../features/medical-records/pages/MedicalRecords";

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
        return {
          title: "Medical Records",
          subheader: "Manage and view patient medical records",
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
    <div className="flex-1 overflow-auto">
      <Appbar title={title} subheader={subheader} />
      <Routes>
        {/* Main Application Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
      </Routes>
      {children}
    </div>
  );
};

export default Body;
