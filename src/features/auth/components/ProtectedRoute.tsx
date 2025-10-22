import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../../../components/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "doctor" | "user")[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = "/",
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has permission
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect based on user role to their appropriate dashboard
      const roleRedirectMap = {
        admin: "/dashboard",
        doctor: "/dashboard",
        user: "/patient-dashboard",
      };

      return <Navigate to={roleRedirectMap[user.role]} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
