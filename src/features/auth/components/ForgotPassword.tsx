import { useState } from "react";
import { useNavigate } from "react-router-dom";

//components
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSnackbarMessage("Password reset email sent successfully!");
      setSnackbarType("success");
      setShowSnackbar(true);

      // Navigate to reset password page after success
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (error) {
      setSnackbarMessage("Failed to send reset email. Please try again.");
      setSnackbarType("error");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col gap-10 w-[330px] sm:w-[360px]">
      {/* Back Button */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-h2 font-bold text-szWhite100">Forgot Password?</h1>
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
