import { useState, useEffect } from "react";
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import Dropdown, { type Option } from "../../../global-components/Dropdown";
import { useGetAllUsersQuery } from "../../user/api/userApi";
import {
  useCreatePregnancyRecordMutation,
  useUpdatePregnancyRecordMutation,
  type PregnancyRecord,
  type PregnancyRecordCreate,
  type PregnancyRecordUpdate,
} from "../api/pregnancyRecordApi";

interface AddPregnancyRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  pregnancyRecord?: PregnancyRecord;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const AddPregnancyRecordModal = ({
  isOpen,
  onClose,
  mode,
  pregnancyRecord,
  onSuccess,
  onError,
}: AddPregnancyRecordModalProps) => {
  const [formData, setFormData] = useState({
    patient: "", // Patient ID (MongoDB ObjectId)
    firstDayOfLastPeriod: "",
    numberOfWeeks: 0,
    status: "",
    remarks: "",
  });
  const [formErrors, setFormErrors] = useState({
    patient: "",
    firstDayOfLastPeriod: "",
    numberOfWeeks: "",
  });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // RTK Query mutations
  const [createPregnancyRecord, { isLoading: isCreating }] =
    useCreatePregnancyRecordMutation();
  const [updatePregnancyRecord, { isLoading: isUpdating }] =
    useUpdatePregnancyRecordMutation();

  const isLoading = isCreating || isUpdating;

  // Fetch all users for the dropdown
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersQuery(undefined, {
    skip: !isOpen || mode === "view", // Only fetch when modal is open and not in view mode
  });

  // Transform users data into dropdown options (only users with role "user" and gender "female")
  const userOptions: Option[] =
    usersData?.data
      ?.filter((user) => user.role === "user" && user.gender === "female")
      ?.map((user) => ({
        label: `${user.lastName}, ${user.firstName}`,
        value: user.id, // Store user ID instead of fullName
      })) || [];

  // Initialize form data when editing or viewing
  useEffect(() => {
    if (pregnancyRecord && (mode === "edit" || mode === "view")) {
      setFormData({
        patient: pregnancyRecord.patient._id,
        firstDayOfLastPeriod:
          pregnancyRecord.firstDayOfLastPeriod.split("T")[0], // Extract date part
        numberOfWeeks: pregnancyRecord.numberOfWeeks,
        status: pregnancyRecord.status || "",
        remarks: pregnancyRecord.remarks || "",
      });
    } else if (mode === "add") {
      setFormData({
        patient: "",
        firstDayOfLastPeriod: "",
        numberOfWeeks: 0,
        status: "",
        remarks: "",
      });
    }

    // Clear errors when modal opens or mode changes
    setFormErrors({
      patient: "",
      firstDayOfLastPeriod: "",
      numberOfWeeks: "",
    });
  }, [pregnancyRecord, mode, isOpen]);

  const handleInputChange = (field: string, value: string | number) => {
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
      patient: "",
      firstDayOfLastPeriod: "",
      numberOfWeeks: "",
    };

    if (!formData.patient) {
      errors.patient = "Patient is required";
    }

    if (!formData.firstDayOfLastPeriod) {
      errors.firstDayOfLastPeriod = "First day of last period is required";
    }

    if (formData.numberOfWeeks < 0 || formData.numberOfWeeks > 45) {
      errors.numberOfWeeks = "Number of weeks must be between 0 and 45";
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields correctly");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    try {
      if (mode === "add") {
        const createData: PregnancyRecordCreate = {
          patient: formData.patient,
          firstDayOfLastPeriod: formData.firstDayOfLastPeriod,
          numberOfWeeks: formData.numberOfWeeks,
          status: formData.status || undefined,
          remarks: formData.remarks || undefined,
        };

        await createPregnancyRecord(createData).unwrap();
        setSnackbarMessage("Pregnancy record created successfully");
        setSnackbarType("success");
        setShowSnackbar(true);
        onSuccess?.();
        onClose();
      } else if (mode === "edit" && pregnancyRecord) {
        const updateData: PregnancyRecordUpdate = {
          firstDayOfLastPeriod: formData.firstDayOfLastPeriod,
          numberOfWeeks: formData.numberOfWeeks,
          status: formData.status || undefined,
          remarks: formData.remarks || undefined,
        };

        await updatePregnancyRecord({
          id: pregnancyRecord._id,
          data: updateData,
        }).unwrap();
        setSnackbarMessage("Pregnancy record updated successfully");
        setSnackbarType("success");
        setShowSnackbar(true);
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        `Failed to ${
          mode === "add" ? "create" : "update"
        } pregnancy record. Please try again.`;
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
      onError?.(errorMessage);
    }
  };

  const handleCancel = () => {
    setFormData({
      patient: "",
      firstDayOfLastPeriod: "",
      numberOfWeeks: 0,
      status: "",
      remarks: "",
    });
    setFormErrors({
      patient: "",
      firstDayOfLastPeriod: "",
      numberOfWeeks: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "ADD PREGNANCY RECORD";
      case "edit":
        return "EDIT PREGNANCY RECORD";
      case "view":
        return "PREGNANCY RECORD DETAILS";
      default:
        return "PREGNANCY RECORD";
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
            {/* Patient Selection */}
            {mode === "view" && pregnancyRecord ? (
              <Inputs
                label="PATIENT"
                value={pregnancyRecord.patient
                  ? `${pregnancyRecord.patient.firstName} ${pregnancyRecord.patient.lastName}`
                  : "Unknown Patient"}
                disabled={true}
              />
            ) : (
              <>
                <Dropdown
                  label="PATIENT"
                  size="small"
                  searchable={true}
                  placeholder={
                    usersLoading
                      ? "Loading patients..."
                      : usersError
                      ? "Error loading patients"
                      : "Select Patient"
                  }
                  options={userOptions}
                  value={userOptions.find(
                    (option) => option.value === formData.patient
                  )}
                  onSelectionChange={(selected) => {
                    const selectedValue = Array.isArray(selected)
                      ? selected[0]?.value
                      : selected.value;
                    handleInputChange("patient", selectedValue || "");
                  }}
                  disabled={
                    mode === "view" || usersLoading || !!usersError || isLoading
                  }
                  error={!!formErrors.patient}
                  usePortal={true}
                />
                {formErrors.patient && (
                  <span className="text-body-small-reg text-error700">
                    {formErrors.patient}
                  </span>
                )}
              </>
            )}

            {/* 2-column grid for date and weeks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <div>
                <Inputs
                  label="FIRST DAY OF LAST PERIOD"
                  placeholder="Enter Date"
                  type="date"
                  value={formData.firstDayOfLastPeriod}
                  onChange={(e) =>
                    handleInputChange("firstDayOfLastPeriod", e.target.value)
                  }
                  disabled={mode === "view" || isLoading}
                  error={!!formErrors.firstDayOfLastPeriod}
                />
                {formErrors.firstDayOfLastPeriod && (
                  <span className="text-body-small-reg text-error700 mt-1 block">
                    {formErrors.firstDayOfLastPeriod}
                  </span>
                )}
              </div>
              <div>
                <Inputs
                  label="NUMBER OF WEEKS"
                  placeholder="Enter Weeks (0-45)"
                  type="number"
                  value={formData.numberOfWeeks.toString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    // Enforce min/max constraints
                    const constrainedValue = Math.min(Math.max(value, 0), 45);
                    handleInputChange("numberOfWeeks", constrainedValue);
                  }}
                  disabled={mode === "view" || isLoading}
                  error={!!formErrors.numberOfWeeks}
                />
                {formErrors.numberOfWeeks && (
                  <span className="text-body-small-reg text-error700 mt-1 block">
                    {formErrors.numberOfWeeks}
                  </span>
                )}
              </div>
            </div>

            {/* Status */}
            <Inputs
              label="STATUS"
              placeholder="Enter Status (optional, max 100 characters)"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              disabled={mode === "view" || isLoading}
              maxCharacter={100}
            />

            {/* Remarks */}
            <Inputs
              label="REMARKS"
              placeholder="Enter Remarks (optional, max 2000 characters)"
              isTextarea
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              disabled={mode === "view" || isLoading}
              maxCharacter={2000}
              className="h-[100px]"
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

export default AddPregnancyRecordModal;
