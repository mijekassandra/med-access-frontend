import { useState, useEffect } from "react";

//global components
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import Dropdown from "../../../global-components/Dropdown";
import Divider from "../../../global-components/Divider";

//icons
import { Eye, EyeSlash } from "iconsax-react";

//rtk
import { useRegisterUserMutation } from "../api/userApi";

//utils
import { convertIsoToDateInput } from "../../../utils/dateUtils";
import {
  getPhoneValidationError,
  handlePhilippinePhoneNumberChange,
} from "../../../utils/phoneValidation";

interface Patient {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  address: string;
  email: string;
  contactNumber: string;
  gender: "male" | "female" | "other" | "";
  dateOfBirth: string;
  dateRegistered: string;
  // Patient-specific fields
  contactPerson?: string;
  age?: number;
  sex?: string;
  bloodType?: string;
  religion?: string;
  civilStatus?: string;
  height?: number;
  occupation?: string;
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
    contactNumber: "+639",
    password: "",
    gender: "" as "male" | "female" | "other" | "",
    dateOfBirth: "",
    // Patient-specific fields
    contactPerson: "",
    age: "",
    sex: "",
    bloodType: "",
    religion: "",
    civilStatus: "",
    height: "",
    occupation: "",
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
    // Patient-specific fields
    contactPerson: "",
    age: "",
    sex: "",
    bloodType: "",
    religion: "",
    civilStatus: "",
    height: "",
    occupation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [showPassword, setShowPassword] = useState(false);

  // API hooks
  const [registerUser] = useRegisterUserMutation();

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): string => {
    if (!dateOfBirth) return "";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 0 ? age.toString() : "";
  };

  // Auto-calculate age when date of birth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const calculatedAge = calculateAge(formData.dateOfBirth);
      setFormData((prev) => ({
        ...prev,
        age: calculatedAge,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        age: "",
      }));
    }
  }, [formData.dateOfBirth]);

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (patient && (mode === "edit" || mode === "view")) {
      const dob = convertIsoToDateInput(patient.dateOfBirth);
      setFormData({
        username: patient.username,
        firstname: patient.firstname,
        lastname: patient.lastname,
        address: patient.address,
        email: patient.email,
        contactNumber: patient.contactNumber,
        password: "",
        gender: patient.gender || "",
        dateOfBirth: dob,
        contactPerson: patient.contactPerson || "",
        age: dob ? calculateAge(dob) : "", // Recalculate age from date of birth
        sex: patient.sex || "",
        bloodType: patient.bloodType || "",
        religion: patient.religion || "",
        civilStatus: patient.civilStatus || "",
        height: patient.height?.toString() || "",
        occupation: patient.occupation || "",
      });
    } else if (mode === "add") {
      setFormData({
        username: "",
        firstname: "",
        lastname: "",
        address: "",
        email: "",
        contactNumber: "+639",
        password: "",
        gender: "",
        dateOfBirth: "",
        contactPerson: "",
        age: "",
        sex: "",
        bloodType: "",
        religion: "",
        civilStatus: "",
        height: "",
        occupation: "",
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
      contactPerson: "",
      age: "",
      sex: "",
      bloodType: "",
      religion: "",
      civilStatus: "",
      height: "",
      occupation: "",
    });

    // Reset password visibility
    setShowPassword(false);
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
      contactPerson: "",
      age: "",
      sex: "",
      bloodType: "",
      religion: "",
      civilStatus: "",
      height: "",
      occupation: "",
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

    // Age is auto-calculated from date of birth, so no manual validation needed
    // The date of birth validation already ensures a valid age

    // Validate contact person (required)
    if (!formData.contactPerson.trim()) {
      errors.contactPerson = "This field is required";
    } else if (formData.contactPerson.trim().length < 2) {
      errors.contactPerson = "Contact person must be at least 2 characters";
    } else if (formData.contactPerson.trim().length > 100) {
      errors.contactPerson = "Contact person cannot exceed 100 characters";
    }

    // Validate blood type (required)
    if (!formData.bloodType.trim()) {
      errors.bloodType = "This field is required";
    } else if (formData.bloodType.trim().length > 10) {
      errors.bloodType = "Blood type cannot exceed 10 characters";
    }

    // Validate religion (required)
    if (!formData.religion.trim()) {
      errors.religion = "This field is required";
    } else if (formData.religion.trim().length < 2) {
      errors.religion = "Religion must be at least 2 characters";
    } else if (formData.religion.trim().length > 100) {
      errors.religion = "Religion cannot exceed 100 characters";
    }

    // Validate civil status (required)
    if (!formData.civilStatus || formData.civilStatus.trim() === "") {
      errors.civilStatus = "This field is required";
    } else {
      const validCivilStatuses = [
        "single",
        "married",
        "widowed",
        "legally separated",
        "annulled",
      ];
      if (!validCivilStatuses.includes(formData.civilStatus.toLowerCase())) {
        errors.civilStatus = "Please select a valid civil status";
      }
    }

    // Validate height (required)
    if (!formData.height || formData.height.trim() === "") {
      errors.height = "This field is required";
    } else {
      const heightNum = parseFloat(formData.height);
      if (isNaN(heightNum) || heightNum < 0) {
        errors.height = "Height must be a positive number";
      }
    }

    // Validate occupation (required)
    if (!formData.occupation.trim()) {
      errors.occupation = "This field is required";
    } else if (formData.occupation.trim().length < 2) {
      errors.occupation = "Occupation must be at least 2 characters";
    } else if (formData.occupation.trim().length > 100) {
      errors.occupation = "Occupation cannot exceed 100 characters";
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
          gender: formData.gender as "male" | "female" | "other",
          dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
          role: "user" as "user" | "admin" | "doctor",
          // Patient-specific fields
          contactPerson: formData.contactPerson.trim() || undefined,
          age: formData.age ? parseInt(formData.age, 10) : undefined,
          sex: "", // Send empty string, using gender instead
          bloodType: formData.bloodType.trim() || undefined,
          religion: formData.religion.trim() || undefined,
          civilStatus: formData.civilStatus.trim() || undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          occupation: formData.occupation.trim() || undefined,
        };

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
        age: formData.age ? parseInt(formData.age, 10) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
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
      contactNumber: "+639",
      password: "",
      gender: "",
      dateOfBirth: "",
      contactPerson: "",
      age: "",
      sex: "",
      bloodType: "",
      religion: "",
      civilStatus: "",
      height: "",
      occupation: "",
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
      contactPerson: "",
      age: "",
      sex: "",
      bloodType: "",
      religion: "",
      civilStatus: "",
      height: "",
      occupation: "",
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
          <div className="space-y-4 mt-2 mb-2">
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
                placeholder="Enter Contact Number (e.g., +639123456789)"
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
              <Inputs
                label="AGE"
                placeholder="Auto-calculated"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                disabled={true}
                error={!!formErrors.age}
              />
            </div>
            {/* Patient Information Section */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <h6 className="text-h6 text-szBlack700 w-[300px]">
                ADDITIONAL PATIENT INFORMATION
              </h6>
              <Divider className="w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="BLOOD TYPE"
                placeholder="Enter Blood Type (e.g., O+, A-, B+)"
                value={formData.bloodType}
                onChange={(e) => handleInputChange("bloodType", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.bloodType}
              />
              <Inputs
                label="HEIGHT (cm)"
                placeholder="Enter Height in cm"
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.height}
              />
              <Inputs
                label="RELIGION"
                placeholder="Enter Religion"
                value={formData.religion}
                onChange={(e) => handleInputChange("religion", e.target.value)}
                disabled={mode === "view"}
                error={!!formErrors.religion}
              />
              <Dropdown
                label="CIVIL STATUS"
                size="small"
                placeholder="Select Civil Status"
                options={[
                  { label: "Single", value: "single" },
                  { label: "Married", value: "married" },
                  { label: "Widowed", value: "widowed" },
                  { label: "Legally Separated", value: "legally separated" },
                  { label: "Annulled", value: "annulled" },
                ]}
                value={
                  formData.civilStatus
                    ? {
                        label:
                          formData.civilStatus === "single"
                            ? "Single"
                            : formData.civilStatus === "married"
                            ? "Married"
                            : formData.civilStatus === "widowed"
                            ? "Widowed"
                            : formData.civilStatus === "legally separated"
                            ? "Legally Separated"
                            : formData.civilStatus === "annulled"
                            ? "Annulled"
                            : formData.civilStatus,
                        value: formData.civilStatus,
                      }
                    : undefined
                }
                onSelectionChange={(selected) => {
                  const civilStatusValue = Array.isArray(selected)
                    ? selected[0]?.value
                    : selected?.value;
                  handleInputChange("civilStatus", civilStatusValue || "");
                }}
                disabled={mode === "view"}
                error={!!formErrors.civilStatus}
                usePortal={true}
              />

              <Inputs
                label="OCCUPATION"
                placeholder="Enter Occupation"
                value={formData.occupation}
                onChange={(e) =>
                  handleInputChange("occupation", e.target.value)
                }
                disabled={mode === "view"}
                error={!!formErrors.occupation}
              />
              <Inputs
                label="CONTACT PERSON"
                placeholder="Enter Contact Person"
                value={formData.contactPerson}
                onChange={(e) =>
                  handleInputChange("contactPerson", e.target.value)
                }
                disabled={mode === "view"}
                error={!!formErrors.contactPerson}
              />
            </div>
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

export default AddPatientModal;
