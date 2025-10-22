import React from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // The useAuth hook will handle token validation and user data restoration
  // This component just provides a wrapper for any future auth-related logic
  return <>{children}</>;
};

export default AuthProvider;
