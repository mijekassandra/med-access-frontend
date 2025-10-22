import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../../../components/Loading";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
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
