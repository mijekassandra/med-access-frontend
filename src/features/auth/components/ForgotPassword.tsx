import { useState } from "react";
import { useNavigate } from "react-router-dom";

//components
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// API
import { useForgotPasswordMutation } from "../../user/api/userApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleSendEmail = async () => {
    if (!email) {
      setSnackbarMessage("Please enter your email address");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSnackbarMessage("Please enter a valid email address");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    try {
      const result = await forgotPassword({ email }).unwrap();

      // Debug: Log the full response
      console.log("Forgot Password API Response:", result);
      console.log("Environment Mode:", import.meta.env.MODE);
      console.log(
        "Is Dev:",
        import.meta.env.MODE === "development" || import.meta.env.DEV
      );
      console.log("Has resetToken:", !!result.resetToken);

      if (result.success) {
        // In development, log the token if available
        const isDev =
          import.meta.env.MODE === "development" || import.meta.env.DEV;

        if (isDev && result.resetToken) {
          const resetToken = result.resetToken; // Store token to avoid TS issues
          console.log("Reset Token (Dev only):", resetToken);

          setSnackbarMessage(
            "Password reset token received. Redirecting to reset password page..."
          );
          setSnackbarType("success");
          setShowSnackbar(true);

          // Navigate to reset password page with token in dev mode
          setTimeout(() => {
            navigate(`/reset-password?token=${encodeURIComponent(resetToken)}`);
          }, 1500);
        } else {
          // No token available
          if (isDev && !result.resetToken) {
            console.warn(
              "Development mode but no resetToken in response. Backend might not be configured to return token in dev mode."
            );
            setSnackbarMessage(
              "Note: Email sending is not implemented. In development mode, the reset token should be returned in the API response. Please check the console for the token or configure your backend to return it."
            );
          } else {
            // Production mode - email should be sent (but not implemented yet)
            setSnackbarMessage(
              result.message ||
                "If an account with that email exists, a password reset link has been sent. Note: Email sending is currently not implemented on the backend."
            );
          }
          setSnackbarType("success");
          setShowSnackbar(true);
        }
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

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-10 w-[330px] sm:w-[360px]">
      {/* Back Button */}
      <div className="flex items-center justify-center gap-2">
        <h3 className="text-h3 font-bold text-szWhite100 text-center">
          Forgot Password?
        </h3>
      </div>

      <section className="space-y-6">
        <div className="text-center">
          <p className="text-body-base-reg text-szSecondary500">
            Please enter your email address to reset your password.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-body-base-reg text-szWhite100">Email Address:</p>
          <Inputs
            type="email"
            placeholder="e.g. juan.delacruz@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </section>

      <div className="space-y-4">
        <Button
          variant="secondaryDark"
          label={isLoading ? "Sending..." : "Send Email"}
          size="medium"
          type="button"
          fullWidth
          onClick={handleSendEmail}
          disabled={isLoading}
        />
        <p className="text-body-small-reg text-szWhite100 text-center">
          Remember your password?{" "}
          <span
            className="text-szSecondary500 cursor-pointer hover:underline transition-colors"
            onClick={handleBackToLogin}
          >
            Back to Login
          </span>
        </p>
      </div>

      {/* Snackbar Alert */}
      <SnackbarAlert
        isOpen={showSnackbar}
        message={snackbarMessage}
        type={snackbarType}
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </div>
  );
};

export default ForgotPassword;
