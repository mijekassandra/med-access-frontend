import React, { useState, useEffect } from "react";

// components
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import RadioButton from "../../../global-components/RadioButton";
import SnackbarAlert from "../../../global-components/SnackbarAlert";
import Dropdown, { type Option } from "../../../global-components/Dropdown";

// types
import type { AppointmentCreate, Appointment } from "../api/appointmentApi";

// RTK Query
import {
  useCreateAppointmentMutation,
  useGetAppointmentsQuery,
} from "../api/appointmentApi";
import { useGetAllUsersQuery } from "../../user/api/userApi";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (appointment: Appointment) => void;
}

export interface AppointmentFormData {
  type: "telemedicine" | "in-person";
  date: string;
  reason: string;
  patient: string;
}

const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    type: "in-person",
    date: "",
    reason: "",
    patient: "",
  });

  const [formErrors, setFormErrors] = useState({
    type: "",
    date: "",
    reason: "",
    patient: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // RTK Query mutations
  const [createAppointment, { isLoading: isCreating }] =
    useCreateAppointmentMutation();

  // Fetch all users for the dropdown
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersQuery(undefined, {
    skip: !isOpen, // Only fetch when modal is open
  });

  // Fetch appointments for the selected date to check for duplicates
  const { data: existingAppointmentsData, isLoading: checkingAppointments } =
    useGetAppointmentsQuery(
      { date: formData.date },
      {
        skip: !formData.date || !isOpen, // Only fetch when date is selected and modal is open
      }
    );

  // Transform users data into dropdown options (only users with role "user")
  const userOptions: Option[] =
    usersData?.data
      ?.filter((user) => user.role === "user")
      ?.map((user) => ({
        label: `${user.lastName}, ${user.firstName}`,
        value: user.id,
      })) || [];

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: "in-person",
        date: "",
        reason: "",
        patient: "",
      });
      setFormErrors({
        type: "",
        date: "",
        reason: "",
        patient: "",
      });
    }
  }, [isOpen]);

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
      type: "",
      date: "",
      reason: "",
      patient: "",
    };

    // Check if type is selected
    if (!formData.type) {
      errors.type = "This field is required";
    }

    // Check if date is empty
    if (!formData.date.trim()) {
      errors.date = "This field is required";
    }

    // Check if reason is empty
    if (!formData.reason.trim()) {
      errors.reason = "This field is required";
    }

    // Check if patient is selected
    if (!formData.patient.trim()) {
      errors.patient = "This field is required";
    }

    setFormErrors(errors);

    // Return true if no errors
    return !Object.values(errors).some((error) => error !== "");
  };

  // Convert date to ISO 8601 format (with default time at midnight UTC)
  const convertToISO8601 = (date: string): string => {
    if (!date) return "";

    // Parse the date string (YYYY-MM-DD format)
    const [year, month, day] = date.split("-").map(Number);

    // Create date at UTC midnight to avoid timezone issues
    const dateTime = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

    // Return ISO 8601 format
    return dateTime.toISOString();
  };

  const handleSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    // Wait for appointments data to load if still checking
    if (checkingAppointments) {
      setSnackbarMessage(
        "Please wait while we check for existing appointments..."
      );
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    // Check if patient already has an appointment on the selected date
    if (existingAppointmentsData?.data && formData.patient && formData.date) {
      const selectedDate = formData.date; // YYYY-MM-DD format

      // Check if there's an existing appointment for this patient on this date
      const existingAppointment = existingAppointmentsData.data.find((apt) => {
        // Skip appointments with deleted patients
        if (!apt.patient) return false;

        // Compare patient IDs
        const isSamePatient = apt.patient._id === formData.patient;

        // Compare dates (extract date part from ISO string)
        const appointmentDate = new Date(apt.date).toISOString().split("T")[0];
        const isSameDate = appointmentDate === selectedDate;

        return isSamePatient && isSameDate;
      });

      if (existingAppointment) {
        setSnackbarMessage(
          "This patient already has an appointment on the selected date. Please choose a different date."
        );
        setSnackbarType("error");
        setShowSnackbar(true);
        setFormErrors((prev) => ({
          ...prev,
          date: "An appointment already exists for this date",
        }));
        return;
      }
    }

    try {
      // Convert date to ISO 8601 format
      const isoDate = convertToISO8601(formData.date);

      // Prepare data for API call
      const appointmentData: AppointmentCreate = {
        type: formData.type,
        date: isoDate,
        reason: formData.reason,
        patient: formData.patient || undefined,
      };

      const result = await createAppointment(appointmentData).unwrap();

      if (result.success && result.data) {
        setSnackbarMessage("Appointment has been created successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the result if provided
        if (onSave) {
          onSave(result.data);
        }

        onClose();
      } else {
        throw new Error(result.message || "Failed to create appointment");
      }
    } catch (err: any) {
      console.error("Error creating appointment:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to create appointment. Please try again.";

      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      type: "in-person",
      date: "",
      reason: "",
      patient: "",
    });
    setFormErrors({
      type: "",
      date: "",
      reason: "",
      patient: "",
    });
    onClose();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getFooterButtons = () => {
    return [
      {
        label: "Cancel",
        variant: "ghost" as const,
        onClick: handleCancel,
        size: "medium" as const,
        disabled: isCreating,
      },
      {
        label: "Submit",
        variant: "primary" as const,
        onClick: handleSubmit,
        size: "medium" as const,
        loading: isCreating,
      },
    ];
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showButton={false}
        title="CREATE APPOINTMENT"
        modalWidth="w-[640px]"
        contentHeight="h-[55vh]"
        headerOptions="left"
        showFooter={true}
        footerOptions="stacked-left"
        footerButtons={getFooterButtons()}
        content={
          <div className="space-y-4 mt-2">
            {/* Patient Selection */}
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
              disabled={usersLoading || !!usersError || isCreating}
              error={!!formErrors.patient}
              usePortal={true}
            />

            {/* Appointment Type */}
            <div className="space-y-2">
              <p className="text-body-base-strong text-szBlack700">
                APPOINTMENT TYPE
              </p>
              <div className="flex gap-6">
                <RadioButton
                  id="in-person"
                  name="appointmentType"
                  label="In-Person"
                  value="in-person"
                  checked={formData.type === "in-person"}
                  onChange={() => handleInputChange("type", "in-person")}
                  disabled={isCreating}
                />
                <RadioButton
                  id="telemedicine"
                  name="appointmentType"
                  label="Telemedicine"
                  value="telemedicine"
                  checked={formData.type === "telemedicine"}
                  onChange={() => handleInputChange("type", "telemedicine")}
                  disabled={isCreating}
                />
              </div>
              {formErrors.type && (
                <p className="text-caption-reg text-error700 ml-1">
                  {formErrors.type}
                </p>
              )}
            </div>

            {/* Date */}
            <Inputs
              label="DATE"
              placeholder="Select Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              disabled={isCreating || checkingAppointments}
              error={!!formErrors.date}
            />

            {/* Reason */}
            <Inputs
              label="REASON"
              placeholder="Enter appointment reason..."
              isTextarea
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              disabled={isCreating}
              error={!!formErrors.reason}
              className="min-h-[100px]"
            />
          </div>
        }
      />

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

export default CreateAppointmentModal;
