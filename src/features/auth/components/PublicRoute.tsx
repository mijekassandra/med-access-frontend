import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../../../components/Loading";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // Allow access to reset-password route even when authenticated
  // (users might click the reset link while logged in)
  const isResetPasswordRoute = location.pathname === "/reset-password";

  // If authenticated, redirect to appropriate dashboard (except for reset-password)
  if (isAuthenticated && user && !isResetPasswordRoute) {
    const roleRedirectMap = {
      admin: "/dashboard",
      doctor: "/dashboard",
      user: "/patient-dashboard",
    };

    return <Navigate to={roleRedirectMap[user.role]} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
