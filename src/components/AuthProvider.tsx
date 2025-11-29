import React from "react";
import { useSocket } from "../hooks/useSocket";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize Socket.io connection when user is authenticated
  // This allows incoming calls to be received even when VideoCall component is not mounted
  useSocket();

  // The useAuth hook will handle token validation and user data restoration
  // This component just provides a wrapper for any future auth-related logic
  return <>{children}</>;
};

export default AuthProvider;
