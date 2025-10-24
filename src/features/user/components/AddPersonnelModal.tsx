import { useState, useEffect } from "react";

//global components
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import Dropdown from "../../../global-components/Dropdown";
import RadioButton from "../../../global-components/RadioButton";
import Divider from "../../../global-components/Divider";

//icons
import { Eye, EyeSlash } from "iconsax-react";

//rtk
import { useRegisterUserMutation, useUpdateUserMutation } from "../api/userApi";

//utils
import { convertIsoToDateInput } from "../../../utils/dateUtils";
import {
  getPhoneValidationError,
  handlePhilippinePhoneNumberChange,
} from "../../../utils/phoneValidation";

interface Personnel {
  id: string;
  fullName: string;
  firstname: string;
  lastname: string;
  specialization: string;
  prcLicenseNumber: string;
  contactNumber: string;
  gender: "male" | "female" | "other" | "";
  role: "admin" | "doctor";
  username?: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
}

interface AddPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  personnel?: Personnel;
  onSave?: (personnel: Personnel) => void;
}

const AddPersonnelModal = ({
  isOpen,
  onClose,
  mode,
  personnel,
  onSave,
}: AddPersonnelModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    firstname: "",
    lastname: "",
    specialization: "",
    prcLicenseNumber: "",
    contactNumber: "+639",
    gender: "" as "male" | "female" | "other" | "",
    role: "doctor" as "admin" | "doctor",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    firstname: "",
    lastname: "",
    specialization: "",
    prcLicenseNumber: "",
    contactNumber: "",
    gender: "",
    role: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [showPassword, setShowPassword] = useState(false);

  // RTK Query mutations
  const [registerUser] = useRegisterUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (personnel && (mode === "edit" || mode === "view")) {
      setFormData({
        fullName: personnel.fullName,
        firstname: personnel.firstname,
        lastname: personnel.lastname,
        specialization: personnel.specialization,
        prcLicenseNumber: personnel.prcLicenseNumber,
        contactNumber: personnel.contactNumber,
        gender: personnel.gender || "",
        role: personnel.role || "doctor",
        username: personnel.username || "",
        email: personnel.email || "",
        password: "",
        dateOfBirth: personnel.dateOfBirth
          ? convertIsoToDateInput(personnel.dateOfBirth)
          : "",
        address: personnel.address || "",
      });
    } else if (mode === "add") {
      setFormData({
        fullName: "",
        firstname: "",
        lastname: "",
        specialization: "",
        prcLicenseNumber: "",
        contactNumber: "+639",
        gender: "",
        role: "doctor",
        username: "",
        email: "",
        password: "",
        dateOfBirth: "",
        address: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      fullName: "",
      firstname: "",
      lastname: "",
      specialization: "",
      prcLicenseNumber: "",
      contactNumber: "",
      gender: "",
      role: "",
      username: "",
      email: "",
      password: "",
      dateOfBirth: "",
      address: "",
    });

    // Reset password visibility
    setShowPassword(false);
  }, [personnel, mode, isOpen]);

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
      fullName: "",
      firstname: "",
      lastname: "",
      specialization: "",
      prcLicenseNumber: "",
      contactNumber: "",
      gender: "",
      role: "",
      username: "",
      email: "",
      password: "",
      dateOfBirth: "",
      address: "",
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

    // Check if email is provided and valid
    if (!formData.email.trim()) {
      errors.email = "This field is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Check if contact number is valid using strict validation
    const phoneError = getPhoneValidationError(formData.contactNumber);
    if (phoneError) {
      errors.contactNumber = phoneError;
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
    if (!formData.gender || formData.gender.trim() === "") {
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

    // Check if role is selected
    if (!formData.role.trim()) {
      errors.role = "This field is required";
    }

    // Check if specialization is empty (only for doctor role)
    if (formData.role === "doctor") {
      if (!formData.specialization.trim()) {
        errors.specialization = "This field is required";
      } else if (formData.specialization.length < 3) {
        errors.specialization = "Specialization must be at least 3 characters";
      }

      // Check if PRC license number is empty (only for doctor role)
      if (!formData.prcLicenseNumber.trim()) {
        errors.prcLicenseNumber = "This field is required";
      } else if (formData.prcLicenseNumber.length < 5) {
        errors.prcLicenseNumber =
          "License number must be at least 5 characters";
      }
    }

    // Update fullName based on firstname and lastname
    const fullName = `${formData.firstname} ${formData.lastname}`.trim();
    if (!fullName) {
      errors.fullName = "Full name is required";
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

    setIsLoading(true);

    try {
      // Prepare data for API call
      const userData = {
        username: formData.username,
        email: formData.email || undefined,
        firstName: formData.firstname,
        lastName: formData.lastname,
        address: formData.address,
        phone: formData.contactNumber,
        gender: formData.gender as "male" | "female" | "other",
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        role: formData.role,
        ...(formData.role === "doctor" && {
          specialization: formData.specialization,
          prcLicenseNumber: formData.prcLicenseNumber,
        }),
      };

      if (mode === "add") {
        // For new personnel, we need to add password
        const personnelData = {
          ...userData,
          password: formData.password,
        };

        console.log("Sending personnel registration data:", personnelData);

        const result = await registerUser(personnelData).unwrap();

        setSnackbarMessage("Personnel has been added successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the result if provided
        if (onSave && result.data) {
          onSave({
            id: result.data.id,
            fullName: result.data.fullName,
            firstname: result.data.firstName,
            lastname: result.data.lastName,
            specialization: formData.specialization,
            prcLicenseNumber: formData.prcLicenseNumber,
            contactNumber: result.data.phone,
            gender: result.data.gender,
            role: result.data.role as "admin" | "doctor",
            username: result.data.username,
            email: result.data.email,
            address: result.data.address,
            dateOfBirth: result.data.dateOfBirth,
          });
        }
      } else if (mode === "edit" && personnel?.id) {
        // For editing, use updateUser
        const updateData = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          address: userData.address,
          phone: userData.phone,
          gender: userData.gender,
          dateOfBirth: userData.dateOfBirth,
          role: userData.role,
          ...(userData.role === "doctor" && {
            specialization: userData.specialization,
            prcLicenseNumber: userData.prcLicenseNumber,
          }),
        };

        await updateUser({
          id: personnel.id,
          data: updateData,
        }).unwrap();

        setSnackbarMessage("Personnel has been updated successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the updated data if provided
        if (onSave) {
          onSave({
            id: personnel.id,
            fullName: `${updateData.firstName} ${updateData.lastName}`,
            firstname: updateData.firstName,
            lastname: updateData.lastName,
            specialization: formData.specialization,
            prcLicenseNumber: formData.prcLicenseNumber,
            contactNumber: updateData.phone,
            gender: updateData.gender,
            role: updateData.role,
            username: formData.username,
            email: updateData.email,
            address: updateData.address,
            dateOfBirth: updateData.dateOfBirth,
          });
        }
      }

      onClose();
    } catch (err: any) {
      console.error("Error saving personnel:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        `Failed to ${
          mode === "add" ? "add" : "update"
        } personnel. Please try again.`;
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      firstname: "",
      lastname: "",
      specialization: "",
      prcLicenseNumber: "",
      contactNumber: "+639",
      gender: "",
      role: "doctor",
      username: "",
      email: "",
      password: "",
      dateOfBirth: "",
      address: "",
    });
    setFormErrors({
      fullName: "",
      firstname: "",
      lastname: "",
      specialization: "",
      prcLicenseNumber: "",
      contactNumber: "",
      gender: "",
      role: "",
      username: "",
      email: "",
      password: "",
      dateOfBirth: "",
      address: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD PERSONNEL";
      case "edit":
        return "EDIT PERSONNEL";
      case "view":
        return "PERSONNEL DETAILS";
      default:
        return "PERSONNEL";
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
        disabled: isLoading,
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
        contentHeight="h-[60vh]"
        headerOptions="left"
        showFooter={mode === "view" ? false : true}
        footerOptions={mode === "view" ? "left" : "stacked-left"}
        footerButtons={getFooterButtons()}
        content={
          <div className="space-y-4 mt-2 mb-6">
            {/* Full width inputs */}
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
                placeholder="Enter # No. (e.g., +639123456789)"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) =>
                  handlePhilippinePhoneNumberChange(
                    e.target.value,
                    (value: string) => handleInputChange("contactNumber", value)
                  )
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
                disabled={mode === "view"}
                error={!!formErrors.gender}
                usePortal={true}
              />

              <Inputs
                label="DATE OF BIRTH (dd/mm/yyyy)"
                placeholder="dd/mm/yyyy"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                disabled={mode === "view"}
                error={!!formErrors.dateOfBirth}
              />
            </div>

            {/* Role Selection */}

            <div className="space-y-2">
              <div className="flex items-center gap-2 pt-2 pb-1">
                <h6 className="text-h6 text-szBlack700 w-[270px]">
                  ROLE ASSIGNMENT
                </h6>
                <Divider className="w-full" />
              </div>
              <div className="flex gap-6">
                <RadioButton
                  id="role-doctor"
                  name="role"
                  label="Doctor"
                  value="doctor"
                  checked={formData.role === "doctor"}
                  onChange={(value) => handleInputChange("role", value)}
                  disabled={mode === "view" || mode === "edit"}
                />
                <RadioButton
                  id="role-admin"
                  name="role"
                  label="Admin"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={(value) => handleInputChange("role", value)}
                  disabled={mode === "view" || mode === "edit"}
                />
              </div>
              {formErrors.role && (
                <p className="text-body-small-reg text-red-500">
                  {formErrors.role}
                </p>
              )}
            </div>

            {/* Doctor-specific fields */}
            {formData.role === "doctor" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                <Inputs
                  label="SPECIALIZATION"
                  placeholder="Enter Specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    handleInputChange("specialization", e.target.value)
                  }
                  disabled={mode === "view"}
                  error={!!formErrors.specialization}
                />
                <Inputs
                  label="PRC LICENSE NUMBER"
                  placeholder="Enter PRC License Number"
                  value={formData.prcLicenseNumber}
                  onChange={(e) =>
                    handleInputChange("prcLicenseNumber", e.target.value)
                  }
                  disabled={mode === "view"}
                  error={!!formErrors.prcLicenseNumber}
                />
              </div>
            )}

            {/* Additional fields for registration */}
            {mode === "add" && (
              <>
                <div className="flex items-center gap-2 pt-2 pb-1">
                  <h6 className="text-h6 text-szBlack700 w-[220px]">
                    ACCOUNT ACCESS
                  </h6>
                  <Divider className="w-full" />
                </div>
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
                    label="PASSWORD (min 6 characters)"
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    error={!!formErrors.password}
                    icon={showPassword ? EyeSlash : Eye}
                    iconClick={togglePasswordVisibility}
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

export default AddPersonnelModal;
