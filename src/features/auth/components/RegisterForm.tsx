import { useState } from "react";
import { useNavigate } from "react-router-dom";

//icons
import { Eye, EyeSlash } from "iconsax-react";

//components
import Inputs from "../../../global-components/Inputs";
import Button from "../../../global-components/Button";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const {
      firstName,
      lastName,
      address,
      dateOfBirth,
      mobileNumber,
      email,
      password,
      confirmPassword,
    } = formData;

    const errors = {
      firstName: "",
      lastName: "",
      address: "",
      dateOfBirth: "",
      mobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Check if firstName is empty
    if (!firstName.trim()) {
      errors.firstName = "This field is required";
    }

    // Check if lastName is empty
    if (!lastName.trim()) {
      errors.lastName = "This field is required";
    }

    // Check if address is empty
    if (!address.trim()) {
      errors.address = "This field is required";
    }

    // Check if dateOfBirth is empty
    if (!dateOfBirth.trim()) {
      errors.dateOfBirth = "This field is required";
    }

    // Check if mobileNumber is empty
    if (!mobileNumber.trim()) {
      errors.mobileNumber = "This field is required";
    } else {
      const phoneRegex = /^09\d{9}$/;
      if (!phoneRegex.test(mobileNumber)) {
        errors.mobileNumber =
          "Please enter a valid mobile number (09xxxxxxxxx)";
      }
    }

    // Check if email is empty
    if (!email.trim()) {
      errors.email = "This field is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Check if password is empty
    if (!password.trim()) {
      errors.password = "This field is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    // Check if confirmPassword is empty
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "This field is required";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleRegister = () => {
    // Validate form first
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    try {
      // For demo purposes, simulate successful registration
      console.log("Registration successful", formData);

      // Store user data in sessionStorage for demo purposes
      sessionStorage.setItem("userRole", "patient");
      sessionStorage.setItem("userEmail", formData.email);
      sessionStorage.setItem("userData", JSON.stringify(formData));
      sessionStorage.setItem("showWelcomeSnackbar", "true");

      setSnackbarMessage("Account created successfully!");
      setSnackbarType("success");
      setShowSnackbar(true);

      // Navigate to email verification success page after a short delay
      setTimeout(() => {
        navigate("/email-verification-success");
      }, 1500);
    } catch (err) {
      console.error("Error creating account:", err);
      setSnackbarMessage("Failed to create account. Please try again.");
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <div className="flex flex-col gap-6 w-[330px] sm:w-[360px]">
      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">First Name:</p>
          <Inputs
            type="text"
            placeholder="e.g. John"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            error={!!formErrors.firstName}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">Last Name:</p>
          <Inputs
            type="text"
            placeholder="e.g. Doe"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            error={!!formErrors.lastName}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">Address:</p>
          <Inputs
            type="text"
            placeholder="e.g. Purok 3, Luz Banzon, Jasaan, Misamis Oriental, 90"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            error={!!formErrors.address}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">Date of Birth:</p>
          <Inputs
            type="date"
            placeholder="e.g. 01/01/2000"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            error={!!formErrors.dateOfBirth}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">Mobile Number:</p>
          <Inputs
            type="text"
            placeholder="e.g. 09123456789"
            value={formData.mobileNumber}
            onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
            error={!!formErrors.mobileNumber}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">Email:</p>
          <Inputs
            type="text"
            placeholder="e.g. juan.delacruz@gmail.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!formErrors.email}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">Password:</p>
          <Inputs
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            icon={showPassword ? Eye : EyeSlash}
            onChange={(e) => handleInputChange("password", e.target.value)}
            iconClick={() => setShowPassword(!showPassword)}
            error={!!formErrors.password}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-body-base-reg text-szWhite100">
            Confirm Password:
          </p>
          <Inputs
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            icon={showConfirmPassword ? Eye : EyeSlash}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            iconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            error={!!formErrors.confirmPassword}
          />
        </div>
      </section>

      <div className="space-y-4">
        <Button
          variant="secondaryDark"
          label="CREATE ACCOUNT"
          size="medium"
          type="button"
          fullWidth
          onClick={handleRegister}
        />
        <p className="text-body-small-reg text-szWhite100 text-center">
          Already have an account?{" "}
          <span
            className="text-szSecondary500 cursor-pointer hover:underline transition-colors"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>

      <SnackbarAlert
        isOpen={showSnackbar}
        title={snackbarMessage}
        type={snackbarType}
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </div>
  );
};

export default RegisterForm;
