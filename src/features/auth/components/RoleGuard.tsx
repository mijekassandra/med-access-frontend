import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../../../components/Loading";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "doctor" | "user")[];
  fallbackPath?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackPath,
}) => {
  const { user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // If no user or user role not in allowed roles
  if (!user || !allowedRoles.includes(user.role)) {
    // Use custom fallback path or default based on user role
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }

    // Default fallback paths based on user role
    const roleFallbackMap = {
      admin: "/dashboard",
      doctor: "/dashboard",
      user: "/patient-dashboard",
    };

    const defaultFallback = user ? roleFallbackMap[user.role] : "/";
    return <Navigate to={defaultFallback} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
