import React, { useState } from "react";

//icons
import { Lock, Eye, EyeSlash } from "iconsax-react";

//components
import Input from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import MobilePageTitle from "../mobile-global-components/MobilePageTitle";

const MobilePatientSettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      alert("New password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSnackbarMessage("Password updated successfully!");
      setSnackbarType("success");
      setShowSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to update password. Please try again.");
      setSnackbarType("error");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.currentPassword.trim() !== "" &&
    formData.newPassword.trim() !== "" &&
    formData.confirmPassword.trim() !== "" &&
    formData.newPassword === formData.confirmPassword &&
    formData.newPassword.length >= 8;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-3">
        <MobilePageTitle title="Settings" />
      </div>

      {/* Reset Password Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-szPrimary100 flex items-center justify-center">
              <Lock size={20} className="text-szPrimary700" variant="Bulk" />
            </div>
            <h4 className="text-h4 font-semibold text-gray-800">
              Reset Password
            </h4>
          </div>
          <p className="text-sm text-gray-600">
            Update your password to keep your account secure
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <Input
            label="CURRENT PASSWORD"
            type={showPasswords.current ? "text" : "password"}
            value={formData.currentPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("currentPassword")(e)
            }
            placeholder="Enter your current password"
            icon={showPasswords.current ? Eye : EyeSlash}
            iconClick={() => togglePasswordVisibility("current")}
          />

          {/* New Password */}
          <Input
            label="NEW PASSWORD"
            type={showPasswords.new ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleInputChange("newPassword")}
            placeholder="Enter your new password"
            icon={showPasswords.new ? Eye : EyeSlash}
            iconClick={() => togglePasswordVisibility("new")}
          />

          {/* Confirm New Password */}
          <Input
            label="CONFIRM NEW PASSWORD"
            type={showPasswords.confirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleInputChange("confirmPassword")}
            placeholder="Confirm your new password"
            icon={showPasswords.confirm ? Eye : EyeSlash}
            iconClick={() => togglePasswordVisibility("confirm")}
          />

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Password Requirements:
            </h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li
                className={`flex items-center gap-2 ${
                  formData.newPassword.length >= 8 ? "text-green-600" : ""
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    formData.newPassword.length >= 8
                      ? "bg-green-600"
                      : "bg-gray-400"
                  }`}
                ></div>
                At least 8 characters long
              </li>
              <li
                className={`flex items-center gap-2 ${
                  formData.newPassword === formData.confirmPassword &&
                  formData.newPassword !== ""
                    ? "text-green-600"
                    : ""
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    formData.newPassword === formData.confirmPassword &&
                    formData.newPassword !== ""
                      ? "bg-green-600"
                      : "bg-gray-400"
                  }`}
                ></div>
                Passwords match
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            label={isLoading ? "Updating..." : "Update Password"}
            variant="primary"
            type="submit"
            fullWidth
            disabled={!isFormValid || isLoading}
          />
        </form>
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

export default MobilePatientSettings;
