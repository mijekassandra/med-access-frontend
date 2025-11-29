import { useState } from "react";

//components
import Button from "../../../global-components/Button";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// API
import { useForgotPasswordMutation } from "../../user/api/userApi";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleRequestReset = async () => {
    if (!userEmail) {
      setSnackbarMessage("User email is not available");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    try {
      const result = await forgotPassword({ email: userEmail }).unwrap();

      if (result.success) {
        // In development, log the token if available
        if (import.meta.env.MODE === "development" && result.resetToken) {
          console.log("Reset Token (Dev only):", result.resetToken);
        }

        setSnackbarMessage(
          result.message ||
            "Password reset email has been sent. Please check your email to reset your password."
        );
        setSnackbarType("success");
        setShowSnackbar(true);

        // Close modal after showing success message
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to send reset email. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        <div className="text-center">
          <p className="text-body-base-reg text-szBlack700">
            To reset your password, we'll send a password reset link to your
            email address.
          </p>
          {userEmail && (
            <p className="text-body-small-reg text-szDarkGrey600 mt-2">
              Email: <span className="font-medium">{userEmail}</span>
            </p>
          )}
        </div>

        <div className="space-y-4 mb-4">
          <Button
            variant="primary"
            label={isLoading ? "Sending..." : "Send Reset Link"}
            size="medium"
            type="button"
            fullWidth
            onClick={handleRequestReset}
            disabled={isLoading || !userEmail}
          />
        </div>
      </div>

      {/* Snackbar Alert */}
      <SnackbarAlert
        isOpen={showSnackbar}
        message={snackbarMessage}
        type={snackbarType}
        onClose={handleCloseSnackbar}
        duration={5000}
      />
    </>
  );
};

export default ChangePasswordModal;
