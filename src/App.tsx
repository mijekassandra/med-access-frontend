import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import Sidebar from "./global-components/Sidebar";
import Body from "./components/Body";
import PageNotFound from "./components/PageNotFound";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import PublicRoute from "./features/auth/components/PublicRoute";
import AuthProvider from "./components/AuthProvider";
import WelcomeSnackbar from "./components/WelcomeSnackbar";

// pages
import Login from "./features/auth/pages/Login";
// import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
// import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
// import PatientMobileApp from "./features/patient-mobile/PatientMobileApp";
// import Register from "./features/auth/pages/Register";
// import EmailVerificationSuccess from "./features/auth/pages/EmailVerificationSuccess";

// Main app layout component with sidebar
const AppLayout = () => {
  return (
    <ProtectedRoute allowedRoles={["admin", "doctor"]}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <Body />
      </div>

      {/* Welcome Snackbar */}
      <WelcomeSnackbar />
    </ProtectedRoute>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth pages - accessible without login, but redirect if already authenticated */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          {/* <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/create-account"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/email-verification-success"
            element={
              <PublicRoute>
                <EmailVerificationSuccess />
              </PublicRoute>
            }
          /> */}

          {/* Patient Mobile App Routes - protected for users only */}
          {/* <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-appointment"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-announcement"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-record"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-health-education"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-notification"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-book-in-person"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-telemedicine"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-all-appointments"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-profile"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-settings"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PatientMobileApp />
              </ProtectedRoute>
            }
          /> */}

          {/* 404 Page - Standalone route for direct access */}
          <Route path="/404" element={<PageNotFound />} />

          {/* Main Application Routes - protected for admin and doctor roles */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
