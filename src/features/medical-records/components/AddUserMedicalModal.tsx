import { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import { useGetAllUsersQuery } from "../../user/api/userApi";
import {
  useCreateMedicalRecordMutation,
  useUpdateMedicalRecordMutation,
  type MedicalRecordCreate,
  type MedicalRecordUpdate,
} from "../api/medicalRecordsApi";

interface MedicalRecord {
  id: string;
  fullName: string;
  patientId?: string; // Optional patient ID for edit mode
  diagnosis: string;
  dateOfRecord: string;
  treatmentPlan: string;
}

interface AddUserMedicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  medicalRecord?: MedicalRecord;
  prefilledPatientId?: string; // Patient ID to auto-fill and disable the full name field
  prefilledDate?: string; // Date to auto-fill the date of record field (YYYY-MM-DD format)
  onSave?: (medicalRecord: MedicalRecord) => void;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

const AddUserMedicalModal = ({
  isOpen,
  onClose,
  mode,
  medicalRecord,
  prefilledPatientId,
  prefilledDate,
  onSave,
  onError,
  onSuccess,
}: AddUserMedicalModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    diagnosis: "",
    dateOfRecord: "",
    treatmentPlan: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    diagnosis: "",
    dateOfRecord: "",
    treatmentPlan: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // API hooks
  const [createMedicalRecord, { isLoading: isCreating }] =
    useCreateMedicalRecordMutation();
  const [updateMedicalRecord, { isLoading: isUpdating }] =
    useUpdateMedicalRecordMutation();

  // Fetch all users for the dropdown
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersQuery(undefined, {
    skip: !isOpen, // Only fetch when modal is open
  });

  // Transform users data into dropdown options (only users with role "user")
  // Store user ID along with fullName for API calls
  const userOptions: Option[] =
    usersData?.data
      ?.filter((user) => user.role === "user")
      ?.map((user) => ({
        label: user.fullName,
        value: user.id, // Store user ID instead of fullName
        fullName: user.fullName, // Keep fullName for display
      })) || [];

  // Get user by ID helper
  const getUserById = (userId: string) => {
    return usersData?.data?.find((user) => user.id === userId);
  };

  // Get user by fullName helper (for edit mode)
  const getUserByFullName = (fullName: string) => {
    return usersData?.data?.find((user) => user.fullName === fullName);
  };

  // Update loading state
  useEffect(() => {
    setIsLoading(isCreating || isUpdating);
  }, [isCreating, isUpdating]);

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (medicalRecord && (mode === "edit" || mode === "view")) {
      // For edit mode, use patientId if available, otherwise find by fullName
      const patientId = medicalRecord.patientId
        ? medicalRecord.patientId
        : getUserByFullName(medicalRecord.fullName)?.id;

      setFormData({
        fullName: patientId || medicalRecord.fullName, // Use ID if found, otherwise keep fullName
        diagnosis: medicalRecord.diagnosis,
        dateOfRecord: medicalRecord.dateOfRecord.includes("T")
          ? medicalRecord.dateOfRecord.split("T")[0]
          : medicalRecord.dateOfRecord, // Convert ISO date to date input format if needed
        treatmentPlan: medicalRecord.treatmentPlan,
      });
    } else if (mode === "add") {
      // If prefilledPatientId is provided, use it; otherwise start with empty
      // If prefilledDate is provided, use it; otherwise start with empty
      setFormData({
        fullName: prefilledPatientId || "",
        diagnosis: "",
        dateOfRecord: prefilledDate || "",
        treatmentPlan: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      fullName: "",
      diagnosis: "",
      dateOfRecord: "",
      treatmentPlan: "",
    });
  }, [
    medicalRecord,
    mode,
    isOpen,
    usersData,
    prefilledPatientId,
    prefilledDate,
  ]);

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
      diagnosis: "",
      dateOfRecord: "",
      treatmentPlan: "",
    };

    // Check if patient is selected
    // When prefilledPatientId is provided, formData.fullName contains the patient ID
    // We need to check if it's a valid non-empty string
    if (
      !formData.fullName ||
      (typeof formData.fullName === "string" && !formData.fullName.trim())
    ) {
      errors.fullName = "This field is required";
    }

    // Check if diagnosis is empty
    if (!formData.diagnosis.trim()) {
      errors.diagnosis = "This field is required";
    } else if (formData.diagnosis.trim().length < 3) {
      errors.diagnosis = "Diagnosis must be at least 3 characters";
    }

    // Check if date of record is provided
    if (!formData.dateOfRecord) {
      errors.dateOfRecord = "This field is required";
    } else {
      // Parse date in local timezone to avoid UTC issues
      // When date is in YYYY-MM-DD format, create date at local midnight
      const dateParts = formData.dateOfRecord.split("-");
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(dateParts[2], 10);
        const recordDate = new Date(year, month, day);
        recordDate.setHours(23, 59, 59, 999); // Set to end of the day
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Set to end of today

        if (recordDate > today) {
          errors.dateOfRecord = "Date of record cannot be in the future";
        }
      } else {
        // Fallback to original validation if date format is unexpected
        const recordDate = new Date(formData.dateOfRecord);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Set to end of today

        if (isNaN(recordDate.getTime()) || recordDate > today) {
          errors.dateOfRecord = "Date of record cannot be in the future";
        }
      }
    }

    // Check if treatment plan is empty
    if (!formData.treatmentPlan.trim()) {
      errors.treatmentPlan = "This field is required";
    } else if (formData.treatmentPlan.trim().length < 5) {
      errors.treatmentPlan = "Treatment plan must be at least 5 characters";
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
      if (onError) onError("Please fill in all required fields correctly.");
      return;
    }

    try {
      // Convert date to ISO string
      const dateOfRecordISO = new Date(formData.dateOfRecord).toISOString();

      if (mode === "add") {
        // Create new medical record
        const createData: MedicalRecordCreate = {
          patient: formData.fullName, // This should be the user ID
          diagnosis: formData.diagnosis.trim(),
          dateOfRecord: dateOfRecordISO,
          treatmentPlan: formData.treatmentPlan.trim(),
        };

        await createMedicalRecord(createData).unwrap();
        const successMsg = "Medical record added successfully";
        setSnackbarMessage(successMsg);
        setSnackbarType("success");
        setShowSnackbar(true);
        if (onSuccess) onSuccess(successMsg);
        if (onSave) {
          onSave({
            id: "",
            fullName:
              getUserById(formData.fullName)?.fullName || formData.fullName,
            diagnosis: formData.diagnosis,
            dateOfRecord: dateOfRecordISO,
            treatmentPlan: formData.treatmentPlan,
          });
        }

        // Reset form and close modal immediately
        setFormData({
          fullName: "",
          diagnosis: "",
          dateOfRecord: "",
          treatmentPlan: "",
        });
        setFormErrors({
          fullName: "",
          diagnosis: "",
          dateOfRecord: "",
          treatmentPlan: "",
        });
        onClose();
      } else if (mode === "edit" && medicalRecord?.id) {
        // Update existing medical record
        const updateData: MedicalRecordUpdate = {
          diagnosis: formData.diagnosis.trim(),
          dateOfRecord: dateOfRecordISO,
          treatmentPlan: formData.treatmentPlan.trim(),
        };

        await updateMedicalRecord({
          id: medicalRecord.id,
          data: updateData,
        }).unwrap();
        const successMsg = "Medical record updated successfully";
        setSnackbarMessage(successMsg);
        setSnackbarType("success");
        setShowSnackbar(true);
        if (onSuccess) onSuccess(successMsg);
        if (onSave) {
          onSave({
            id: medicalRecord.id,
            fullName:
              getUserById(formData.fullName)?.fullName || formData.fullName,
            diagnosis: formData.diagnosis,
            dateOfRecord: dateOfRecordISO,
            treatmentPlan: formData.treatmentPlan,
          });
        }

        // Reset form and close modal immediately
        setFormData({
          fullName: "",
          diagnosis: "",
          dateOfRecord: "",
          treatmentPlan: "",
        });
        setFormErrors({
          fullName: "",
          diagnosis: "",
          dateOfRecord: "",
          treatmentPlan: "",
        });
        onClose();
      }
    } catch (error: any) {
      const errorMsg =
        error?.data?.message ||
        (mode === "add"
          ? "Failed to create medical record"
          : "Failed to update medical record");
      setSnackbarMessage(errorMsg);
      setSnackbarType("error");
      setShowSnackbar(true);
      if (onError) onError(errorMsg);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      diagnosis: "",
      dateOfRecord: "",
      treatmentPlan: "",
    });
    setFormErrors({
      fullName: "",
      diagnosis: "",
      dateOfRecord: "",
      treatmentPlan: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD PATIENT MEDICAL RECORD";
      case "edit":
        return "EDIT PATIENT MEDICAL RECORD";
      case "view":
        return "PATIENT MEDICAL RECORD DETAILS";
      default:
        return "PATIENT MEDICAL RECORD";
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
        contentHeight="h-[55vh]"
        headerOptions="left"
        showFooter={mode === "view" ? false : true}
        footerOptions={mode === "view" ? "left" : "stacked-left"}
        footerButtons={getFooterButtons()}
        content={
          <div className="space-y-4 mt-2">
            {/* Full width inputs */}
            <Dropdown
              label="FULL NAME"
              size="small"
              searchable={true}
              placeholder={
                usersLoading
                  ? "Loading users..."
                  : usersError
                  ? "Error loading users"
                  : "Select Full Name"
              }
              options={userOptions}
              value={userOptions.find(
                (option) => option.value === formData.fullName
              )}
              onSelectionChange={(selected) => {
                const selectedValue = Array.isArray(selected)
                  ? selected[0]?.value
                  : selected.value;
                handleInputChange("fullName", selectedValue || "");
              }}
              disabled={
                mode === "view" ||
                mode === "edit" ||
                !!prefilledPatientId || // Disable if patient is prefilled (from appointment)
                usersLoading ||
                !!usersError ||
                isLoading
              }
              error={!!formErrors.fullName}
              usePortal={true}
            />

            {/* 2-column grid for other inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <Inputs
                label="DIAGNOSIS"
                placeholder="Enter Diagnosis"
                value={formData.diagnosis}
                onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                disabled={mode === "view" || isLoading}
                error={!!formErrors.diagnosis}
              />
              <Inputs
                label="DATE OF RECORD (dd/mm/yyyy)"
                placeholder="Enter Date of Record"
                type="date"
                value={formData.dateOfRecord}
                onChange={(e) =>
                  handleInputChange("dateOfRecord", e.target.value)
                }
                disabled={mode === "view" || !!prefilledDate || isLoading}
                error={!!formErrors.dateOfRecord}
              />
            </div>

            <Inputs
              label="TREATMENT PLAN"
              placeholder="Enter Treatment Plan"
              isTextarea
              maxCharacter={500}
              value={formData.treatmentPlan}
              onChange={(e) =>
                handleInputChange("treatmentPlan", e.target.value)
              }
              disabled={mode === "view" || isLoading}
              error={!!formErrors.treatmentPlan}
              className="h-[140px]"
            />
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

export default AddUserMedicalModal;
