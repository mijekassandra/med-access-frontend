import React, { useState, useEffect } from "react";

// components
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import RadioButton from "../../../global-components/RadioButton";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

// types
import type { AppointmentUpdate, Appointment } from "../api/appointmentApi";

// RTK Query
import { useUpdateAppointmentMutation } from "../api/appointmentApi";

interface UpdateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSave?: (appointment: Appointment) => void;
}

export interface AppointmentFormData {
  type: "telemedicine" | "in-person";
  date: string;
  reason: string;
}

const UpdateAppointmentModal: React.FC<UpdateAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSave,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    type: "in-person",
    date: "",
    reason: "",
  });

  const [formErrors, setFormErrors] = useState({
    type: "",
    date: "",
    reason: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // RTK Query mutations
  const [updateAppointment, { isLoading: isUpdating }] =
    useUpdateAppointmentMutation();

  // Initialize form data when modal opens or appointment changes
  useEffect(() => {
    if (isOpen && appointment) {
      const appointmentDate = new Date(appointment.date);
      const dateString = appointmentDate.toISOString().split("T")[0];

      setFormData({
        type: appointment.type,
        date: dateString,
        reason: appointment.reason,
      });
      setFormErrors({
        type: "",
        date: "",
        reason: "",
      });
    }
  }, [isOpen, appointment]);

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
    if (!appointment) return;

    // Validate form first
    if (!validateForm()) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarType("error");
      setShowSnackbar(true);
      return;
    }

    try {
      // Convert date to ISO 8601 format
      const isoDate = convertToISO8601(formData.date);

      // Prepare data for API call
      const appointmentData: AppointmentUpdate = {
        type: formData.type,
        date: isoDate,
        reason: formData.reason,
      };

      const result = await updateAppointment({
        id: appointment._id,
        data: appointmentData,
      }).unwrap();

      if (result.success && result.data) {
        setSnackbarMessage("Appointment has been updated successfully!");
        setSnackbarType("success");
        setShowSnackbar(true);

        // Call onSave with the result if provided
        if (onSave) {
          onSave(result.data);
        }

        onClose();
      } else {
        throw new Error(result.message || "Failed to update appointment");
      }
    } catch (err: any) {
      console.error("Error updating appointment:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to update appointment. Please try again.";

      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  const handleCancel = () => {
    if (appointment) {
      const appointmentDate = new Date(appointment.date);
      const dateString = appointmentDate.toISOString().split("T")[0];

      setFormData({
        type: appointment.type,
        date: dateString,
        reason: appointment.reason,
      });
    }
    setFormErrors({
      type: "",
      date: "",
      reason: "",
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
        disabled: isUpdating,
      },
      {
        label: "Update",
        variant: "primary" as const,
        onClick: handleSubmit,
        size: "medium" as const,
        loading: isUpdating,
      },
    ];
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showButton={false}
        title="UPDATE APPOINTMENT"
        modalWidth="w-[640px]"
        contentHeight="h-[55vh]"
        headerOptions="left"
        showFooter={true}
        footerOptions="stacked-left"
        footerButtons={getFooterButtons()}
        content={
          <div className="space-y-4 mt-2">
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
                  disabled={isUpdating}
                />
                <RadioButton
                  id="telemedicine"
                  name="appointmentType"
                  label="Telemedicine"
                  value="telemedicine"
                  checked={formData.type === "telemedicine"}
                  onChange={() => handleInputChange("type", "telemedicine")}
                  disabled={isUpdating}
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
              disabled={isUpdating}
              error={!!formErrors.date}
            />

            {/* Reason */}
            <Inputs
              label="REASON"
              placeholder="Enter appointment reason..."
              isTextarea
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              disabled={isUpdating}
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

export default UpdateAppointmentModal;
