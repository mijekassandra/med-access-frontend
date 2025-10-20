import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// components
import Sidebar from "./global-components/Sidebar";
import Body from "./components/Body";
import PageNotFound from "./components/PageNotFound";

// pages
import Login from "./features/auth/pages/Login";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import PatientMobileApp from "./features/patient-mobile/PatientMobileApp";
import Register from "./features/auth/pages/Register";
import EmailVerificationSuccess from "./features/auth/pages/EmailVerificationSuccess";

// Main app layout component with sidebar
const AppLayout = () => {
  const [userRole, setUserRole] = useState<"admin" | "doctor" | "patient">(
    "doctor"
  );
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Get user role from sessionStorage
    const storedRole = sessionStorage.getItem("userRole") as
      | "patient"
      | "admin"
      | "doctor"
      | null;
    const storedEmail = sessionStorage.getItem("userEmail");

    if (storedRole) {
      setUserRole(storedRole);

      // Redirect patients to mobile interface
      if (storedRole === "patient") {
        window.location.href = "/patient-dashboard";
        return;
      }
    }

    if (storedEmail) {
      setUserName(storedEmail.split("@")[0]); // Use email prefix as username
    }
  }, []);

  // Don't render the desktop layout for patients
  if (userRole === "patient") {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar userRole={userRole} userName={userName} />

      {/* Main Content Area */}
      <Body userRole={userRole} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page - standalone without sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Auth pages - standalone without sidebar */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/create-account" element={<Register />} />
        <Route
          path="/email-verification-success"
          element={<EmailVerificationSuccess />}
        />

        {/* Patient Mobile App Routes - standalone without sidebar */}
        <Route path="/patient-dashboard" element={<PatientMobileApp />} />
        <Route path="/patient-appointment" element={<PatientMobileApp />} />
        <Route path="/patient-announcement" element={<PatientMobileApp />} />
        <Route path="/patient-record" element={<PatientMobileApp />} />
        <Route
          path="/patient-health-education"
          element={<PatientMobileApp />}
        />
        <Route path="/patient-notification" element={<PatientMobileApp />} />
        <Route path="/patient-book-in-person" element={<PatientMobileApp />} />
        <Route path="/patient-telemedicine" element={<PatientMobileApp />} />
        <Route
          path="/patient-all-appointments"
          element={<PatientMobileApp />}
        />
        <Route path="/patient-profile" element={<PatientMobileApp />} />
        <Route path="/patient-settings" element={<PatientMobileApp />} />

        {/* 404 Page - Standalone route for direct access */}
        <Route path="/404" element={<PageNotFound />} />

        {/* Main Application Routes - with sidebar layout */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
