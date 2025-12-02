import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

//icons
import { Eye, EyeSlash } from "iconsax-react";

//components
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// API
import { useResetPasswordMutation } from "../../user/api/userApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    if (!token) {
      setSnackbarMessage(
        "Reset token is missing. Please request a new password reset."
      );
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  }, [token]);

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

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
    if (!token) {
      setSnackbarMessage(
        "Reset token is missing. Please request a new password reset."
      );
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setSnackbarMessage("Please fill in all fields");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    if (formData.newPassword.length < 6) {
      setSnackbarMessage("Password must be at least 6 characters long");
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

    try {
      const result = await resetPassword({
        token,
        password: formData.newPassword,
      }).unwrap();

      if (result.success) {
        setSnackbarMessage(
          result.message || "Password has been reset successfully"
        );
        setSnackbarType("success");
        setShowSnackbar(true);

        // Navigate to login page after success
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (err as { message?: string })?.message ||
        "Failed to reset password. Please try again.";
      const errors =
        (err as { data?: { errors?: string[] } })?.data?.errors || [];

      if (errors.length > 0) {
        setSnackbarMessage(errors.join(", "));
      } else {
        setSnackbarMessage(errorMessage);
      }
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const handleBackToForgotPassword = () => {
    navigate("/forgot-password");
  };

  const isFormValid =
    formData.newPassword.trim() !== "" &&
    formData.confirmPassword.trim() !== "" &&
    formData.newPassword === formData.confirmPassword &&
    formData.newPassword.length >= 6;

  if (!token) {
    return (
      <div className="flex flex-col gap-10 w-[330px] sm:w-[360px] max-w-full px-4">
        <h1 className="text-h2 font-bold text-szWhite100 text-center">
          Reset Password
        </h1>
        <div className="text-center">
          <p className="text-body-base-reg text-szSecondary500 mb-4">
            Invalid reset link. Please request a new password reset.
          </p>
          <Button
            variant="secondaryDark"
            label="Request New Reset Link"
            size="medium"
            type="button"
            fullWidth
            onClick={handleBackToForgotPassword}
          />
        </div>
        <SnackbarAlert
          isOpen={showSnackbar}
          message={snackbarMessage}
          type={snackbarType}
          onClose={handleCloseSnackbar}
          duration={5000}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-[330px] sm:w-[360px] max-w-full px-4">
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
              onChange={handleInputChange("newPassword")}
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
              onChange={handleInputChange("confirmPassword")}
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
                formData.newPassword.length >= 6 ? "text-green-400" : ""
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  formData.newPassword.length >= 6
                    ? "bg-green-400"
                    : "bg-gray-400"
                }`}
              ></div>
              At least 6 characters long
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
        <p className="text-body-small-reg text-szWhite100 text-center break-words px-2">
          Don't have a token?{" "}
          <span
            className="text-szSecondary500 cursor-pointer hover:underline transition-colors break-words"
            onClick={handleBackToForgotPassword}
          >
            Request a new reset link
          </span>
        </p>
        <p className="text-body-small-reg text-szWhite100 text-center break-words px-2">
          Remember your password?{" "}
          <span
            className="text-szSecondary500 cursor-pointer hover:underline transition-colors break-words"
            onClick={() => navigate("/")}
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
