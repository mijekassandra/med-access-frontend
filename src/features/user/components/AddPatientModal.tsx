import { useState, useEffect } from "react";

//global components
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import Dropdown from "../../../global-components/Dropdown";
import Divider from "../../../global-components/Divider";

//rtk
import { useRegisterUserMutation } from "../api/userApi";

interface Patient {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  address: string;
  email: string;
  contactNumber: string;
  dateRegistered: string;
}

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  patient?: Patient;
  onSave?: (patient: Patient) => void;
}

const AddPatientModal = ({
  isOpen,
  onClose,
  mode,
  patient,
  onSave,
}: AddPatientModalProps) => {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    address: "",
    email: "",
    contactNumber: "",
    password: "",
    gender: "male" as "male" | "female" | "other",
    dateOfBirth: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    firstname: "",
    lastname: "",
    address: "",
    email: "",
    contactNumber: "",
    password: "",
    gender: "",
    dateOfBirth: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // API hooks
  const [registerUser] = useRegisterUserMutation();

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (patient && (mode === "edit" || mode === "view")) {
      setFormData({
        username: patient.username,
        firstname: patient.firstname,
        lastname: patient.lastname,
        address: patient.address,
        email: patient.email,
        contactNumber: patient.contactNumber,
        password: "",
        gender: "male",
        dateOfBirth: "",
      });
    } else if (mode === "add") {
      setFormData({
        username: "",
        firstname: "",
        lastname: "",
        address: "",
        email: "",
        contactNumber: "",
        password: "",
        gender: "male",
        dateOfBirth: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      username: "",
      firstname: "",
      lastname: "",
      address: "",
      email: "",
      contactNumber: "",
      password: "",
      gender: "",
      dateOfBirth: "",
    });
  }, [patient, mode, isOpen]);

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

  // Validation function
  const validateForm = () => {
    const errors = {
      username: "",
      firstname: "",
      lastname: "",
      address: "",
      email: "",
      contactNumber: "",
      password: "",
      gender: "",
      dateOfBirth: "",
    };

    // Check if username is empty
    if (!formData.username.trim()) {
      errors.username = "This field is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Check if firstname is empty
    if (!formData.firstname.trim()) {
      errors.firstname = "This field is required";
    } else if (formData.firstname.length < 2) {
      errors.firstname = "First name must be at least 2 characters";
    }

    // Check if lastname is empty
    if (!formData.lastname.trim()) {
      errors.lastname = "This field is required";
    } else if (formData.lastname.length < 2) {
      errors.lastname = "Last name must be at least 2 characters";
    }

    // Check if address is empty
    if (!formData.address.trim()) {
      errors.address = "This field is required";
    } else if (formData.address.length < 5) {
      errors.address = "Address must be at least 5 characters";
    }

    // Check if email is valid (optional but if provided, must be valid)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Check if contact number is empty
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = "This field is required";
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(formData.contactNumber)) {
      errors.contactNumber = "Please enter a valid phone number";
    }

    // For add mode, check password
    if (mode === "add") {
      if (!formData.password.trim()) {
        errors.password = "This field is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    // Check if gender is selected
    if (!formData.gender.trim()) {
      errors.gender = "This field is required";
    }

    // Check if date of birth is provided
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "This field is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 0 || age > 120) {
        errors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    setFormErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields correctly.");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    if (mode === "add") {
      try {
        setIsLoading(true);

        const registrationData = {
          username: formData.username,
          email: formData.email || undefined,
          password: formData.password,
          firstName: formData.firstname,
          lastName: formData.lastname,
          address: formData.address,
          phone: formData.contactNumber,
          gender: formData.gender,
          dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
          role: "user" as "user" | "admin" | "doctor",
        };

        console.log("Sending registration data:", registrationData);

        await registerUser(registrationData).unwrap();

        setSnackbarMessage("Patient registered successfully");
        setSnackbarType("success");
        setShowSnackbar(true);
        onClose();
      } catch (error: any) {
        console.error("Registration error:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to register patient";
        setSnackbarMessage(errorMessage);
        setSnackbarType("error");
        setShowSnackbar(true);
      } finally {
        setIsLoading(false);
      }
    } else if (mode === "edit" && onSave) {
      onSave({
        id: patient?.id || "",
        ...formData,
        dateRegistered: patient?.dateRegistered || new Date().toISOString(),
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      username: "",
      firstname: "",
      lastname: "",
      address: "",
      email: "",
      contactNumber: "",
      password: "",
      gender: "male",
      dateOfBirth: "",
    });
    setFormErrors({
      username: "",
      firstname: "",
      lastname: "",
      address: "",
      email: "",
      contactNumber: "",
      password: "",
      gender: "",
      dateOfBirth: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD PATIENT";
      case "edit":
        return "EDIT PATIENT";
      case "view":
        return "PATIENT DETAILS";
      default:
        return "PATIENT";
    }
  };

  const getFooterButtons = () => {
    if (mode === "view") {
      return [];
    }

    return [
      {
        label: "Cancel",
        variant: "ghost" as const,
        onClick: handleCancel,
        size: "medium" as const,
      },
      {
        label: mode === "edit" ? "Save Changes" : "Submit",
        variant: "primary" as const,
        onClick: handleSubmit,
        size: "medium" as const,
        loading: isLoading,
      },
    ];
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showButton={false}
        title={getModalTitle()}
        modalWidth="w-[640px]"
        contentHeight="h-[55vh]"
        headerOptions="left"
        showFooter={mode === "view" ? false : true}
        footerOptions={mode === "view" ? "left" : "stacked-left"}
        footerButtons={getFooterButtons()}
        content={
          <div className="space-y-4 mt-2">
            {/* 2-column grid for email and contact number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="FIRSTNAME"
                placeholder="Enter Firstname"
                value={formData.firstname}
                onChange={(e) => handleInputChange("firstname", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.firstname}
              />
              <Inputs
                label="LASTNAME"
                placeholder="Enter Lastname"
                value={formData.lastname}
                onChange={(e) => handleInputChange("lastname", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.lastname}
              />
            </div>
            {/* Full width address */}
            <Inputs
              label="ADDRESS"
              placeholder="Enter Address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={mode === "view"}
              error={!!formErrors.address}
            />
            {/* 2-column grid for email and contact number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="EMAIL"
                placeholder="Enter Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.email}
              />
              <Inputs
                label="CONTACT NUMBER"
                placeholder="Enter Contact Number"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) =>
                  handleInputChange("contactNumber", e.target.value)
                }
                disabled={mode === "view"}
                error={!!formErrors.contactNumber}
              />
            </div>
            {/* Gender and Date of Birth in a 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Dropdown
                label="GENDER"
                size="small"
                placeholder="Select Gender"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
                value={
                  formData.gender
                    ? {
                        label:
                          formData.gender === "male"
                            ? "Male"
                            : formData.gender === "female"
                            ? "Female"
                            : "Other",
                        value: formData.gender,
                      }
                    : undefined
                }
                onSelectionChange={(selected) => {
                  const genderValue = Array.isArray(selected)
                    ? selected[0]?.value
                    : selected?.value;
                  handleInputChange("gender", genderValue || "");
                }}
                disabled={false}
                error={!!formErrors.gender}
                usePortal={true}
              />

              <Inputs
                label="DATE OF BIRTH"
                placeholder="YYYY-MM-DD"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                error={!!formErrors.dateOfBirth}
              />
            </div>
            <Divider className="my-10" />
            {/* Additional fields for registration */}
            {mode === "add" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                  <Inputs
                    label="USERNAME"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    disabled={false}
                    error={!!formErrors.username}
                  />
                  <Inputs
                    label="PASSWORD"
                    placeholder="Enter Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    error={!!formErrors.password}
                  />
                </div>
              </>
            )}
          </div>
        }
      ></Modal>

      <SnackbarAlert
        isOpen={showSnackbar}
        title={snackbarMessage}
        type={snackbarType}
        onClose={handleCloseSnackbar}
        duration={3000}
      />
    </>
  );
};

export default AddPatientModal;
