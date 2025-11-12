import { useState } from "react";
import { useNavigate } from "react-router-dom";

//icons
import { Eye, EyeSlash } from "iconsax-react";

//components
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, _setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // const handleInputChange =
  //   (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [field]: e.target.value,
  //     }));
  //   };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleResetPassword = async () => {
    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setSnackbarMessage("Please fill in all fields");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    if (formData.newPassword.length < 8) {
      setSnackbarMessage("Password must be at least 8 characters long");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSnackbarMessage("Password reset successfully!");
      setSnackbarType("success");
      setShowSnackbar(true);

      // Navigate to login page after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setSnackbarMessage("Failed to reset password. Please try again.");
      setSnackbarType("error");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleBackToForgotPassword = () => {
  //   navigate("/forgot-password");
  // };

  const isFormValid =
    formData.newPassword.trim() !== "" &&
    formData.confirmPassword.trim() !== "" &&
    formData.newPassword === formData.confirmPassword &&
    formData.newPassword.length >= 8;

  return (
    <div className="flex flex-col gap-10 w-[330px] sm:w-[360px]">
      <h1 className="text-h2 font-bold text-szWhite100 text-center">
        Reset Password
      </h1>

      <section className="space-y-6">
        <div className="text-center">
          <p className="text-body-base-reg text-szSecondary500">
            Enter your new password
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-body-base-reg text-szWhite100">New Password:</p>
            <Inputs
              type={showPasswords.new ? "text" : "password"}
              placeholder="Enter your new password"
              value={formData.newPassword}
              icon={showPasswords.new ? Eye : EyeSlash}
              // onChange={handleInputChange("newPassword")}
              iconClick={() => togglePasswordVisibility("new")}
            />
          </div>

          <div className="space-y-1">
            <p className="text-body-base-reg text-szWhite100">
              Confirm New Password:
            </p>
            <Inputs
              type={showPasswords.confirm ? "text" : "password"}
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              icon={showPasswords.confirm ? Eye : EyeSlash}
              // onChange={handleInputChange("confirmPassword")}
              iconClick={() => togglePasswordVisibility("confirm")}
            />
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-white/10 rounded-lg p-4">
          <h5 className="text-sm font-medium text-szWhite100 mb-2">
            Password Requirements:
          </h5>
          <ul className="text-xs text-szSecondary500 space-y-1">
            <li
              className={`flex items-center gap-2 ${
                formData.newPassword.length >= 8 ? "text-green-400" : ""
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  formData.newPassword.length >= 8
                    ? "bg-green-400"
                    : "bg-gray-400"
                }`}
              ></div>
              At least 8 characters long
            </li>
            <li
              className={`flex items-center gap-2 ${
                formData.newPassword === formData.confirmPassword &&
                formData.newPassword !== ""
                  ? "text-green-400"
                  : ""
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  formData.newPassword === formData.confirmPassword &&
                  formData.newPassword !== ""
                    ? "bg-green-400"
                    : "bg-gray-400"
                }`}
              ></div>
              Passwords match
            </li>
          </ul>
        </div>
      </section>

      <div className="space-y-4">
        <Button
          variant="secondaryDark"
          label={isLoading ? "Resetting..." : "Reset Password"}
          size="medium"
          type="button"
          fullWidth
          onClick={handleResetPassword}
          disabled={!isFormValid || isLoading}
        />
        <p className="text-body-small-reg text-szWhite100 text-center">
          Remember your password?{" "}
          <span
            className="text-szSecondary500 cursor-pointer hover:underline transition-colors"
            onClick={() => navigate("/login")}
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

export default ResetPassword;
