import React, { useState, useEffect } from "react";

import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";
import SnackbarAlert from "../../../global-components/SnackbarAlert";

import type { Appointment, AppointmentReschedule } from "../api/appointmentApi";
import { useRescheduleAppointmentMutation } from "../api/appointmentApi";

interface RescheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess?: () => void;
}

const convertToISO8601 = (date: string): string => {
  if (!date) return "";
  const [year, month, day] = date.split("-").map(Number);
  const dateTime = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  return dateTime.toISOString();
};

const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}) => {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [dateError, setDateError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success",
  );

  const [rescheduleAppointment, { isLoading }] =
    useRescheduleAppointmentMutation();

  useEffect(() => {
    if (isOpen && appointment) {
      const d = new Date(appointment.date);
      setDate(d.toISOString().split("T")[0]);
      setReason(appointment.reason || "");
      setDateError("");
    }
  }, [isOpen, appointment]);

  const handleSubmit = async () => {
    if (!appointment) return;
    setDateError("");
    if (!date.trim()) {
      setDateError("New date is required.");
      return;
    }
    try {
      const body: AppointmentReschedule = {
        date: convertToISO8601(date),
        ...(reason.trim() && { reason: reason.trim() }),
      };
      await rescheduleAppointment({ id: appointment._id, data: body }).unwrap();
      setSnackbarMessage("Appointment rescheduled.");
      setSnackbarType("success");
      setShowSnackbar(true);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.message ||
        "Failed to reschedule appointment.";
      setSnackbarMessage(message);
      setSnackbarType("error");
      setShowSnackbar(true);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        showButton={false}
        title="Reschedule appointment"
        modalWidth="w-[640px]"
        contentHeight="h-auto"
        headerOptions="left"
        showFooter={true}
        footerOptions="stacked-left"
        footerButtons={[
          {
            label: "Cancel",
            variant: "ghost",
            onClick: onClose,
            size: "medium",
            disabled: isLoading,
          },
          {
            label: "Reschedule",
            variant: "primary",
            onClick: handleSubmit,
            size: "medium",
            loading: isLoading,
            disabled: isLoading,
          },
        ]}
        content={
          <div className="space-y-4 mt-2">
            <Inputs
              label="New date"
              placeholder="Select date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (dateError) setDateError("");
              }}
              disabled={isLoading}
              error={!!dateError}
            />
            {dateError && (
              <p className="text-caption-reg text-error700">{dateError}</p>
            )}
            <Inputs
              label="Reason (optional)"
              placeholder="Enter reason..."
              isTextarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
              className="min-h-[80px]"
            />
          </div>
        }
      />
      <SnackbarAlert
        isOpen={showSnackbar}
        title={snackbarMessage}
        type={snackbarType}
        onClose={() => setShowSnackbar(false)}
        duration={3000}
      />
    </>
  );
};

export default RescheduleAppointmentModal;
