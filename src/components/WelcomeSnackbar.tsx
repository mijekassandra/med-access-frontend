import React, { useEffect, useState } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import SnackbarAlert from "../global-components/SnackbarAlert";

const WelcomeSnackbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    // Show welcome snackbar when user becomes authenticated and we haven't shown it yet
    if (isAuthenticated && user && !hasShownWelcome) {
      setShowWelcome(true);
      setHasShownWelcome(true);
    }

    // Reset the welcome state when user logs out
    if (!isAuthenticated) {
      setHasShownWelcome(false);
      setShowWelcome(false);
    }
  }, [isAuthenticated, user, hasShownWelcome]);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "doctor":
        return "Doctor";
      case "user":
        return "Patient";
      default:
        return "User";
    }
  };

  const getWelcomeMessage = () => {
    if (!user) return "";

    const roleDisplay = getRoleDisplayName(user.role);
    return `Welcome back, ${user.firstName}! You are logged in as ${roleDisplay}.`;
  };

  return (
    <SnackbarAlert
      isOpen={showWelcome}
      title="Welcome!"
      message={getWelcomeMessage()}
      type="success"
      onClose={() => setShowWelcome(false)}
      duration={5000}
      position={{ vertical: "top", horizontal: "center" }}
      showCloseButton={true}
      autoHide={true}
      animation="slide-down"
      showIcon={true}
    />
  );
};

export default WelcomeSnackbar;
