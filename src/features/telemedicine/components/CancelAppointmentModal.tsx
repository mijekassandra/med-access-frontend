import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// components
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";

// RTK
import { useUpdateAppointmentStatusMutation } from "../api/appointmentApi";
import type { RootState } from "../../../store";

export interface CancelAppointmentModalAppointment {
  id: string;
  patientName?: string;
}

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: CancelAppointmentModalAppointment | null;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSuccess,
  onError,
}) => {
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const [updateAppointmentStatus, { isLoading }] =
    useUpdateAppointmentStatusMutation();

  const isStaff = user?.role === "doctor" || user?.role === "admin";

  useEffect(() => {
    if (isOpen) {
      setRemarks("");
      setRemarksError("");
    }
  }, [isOpen, appointment]);

  const handleSubmit = async () => {
    if (!appointment) return;
    setRemarksError("");
    if (isStaff && !remarks.trim()) {
      setRemarksError("Remarks are required when cancelling as staff.");
      return;
    }
    if (remarks.length > 1000) {
      setRemarksError("Remarks must be 1000 characters or less.");
      return;
    }
    try {
      await updateAppointmentStatus({
        id: appointment.id,
        status: "denied",
        doctorCancellationRemarks: remarks.trim() || undefined,
      }).unwrap();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Failed to cancel appointment.";
      onError?.(message);
      setRemarksError(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Appointment"
      showButton={false}
      showCloseIcon={true}
      showHeaderDivider={true}
      showFooterDivider={true}
      modalWidth="max-w-[544px]"
      contentHeight="max-h-[50vh]"
      footerButtons={[
        {
          label: "Cancel",
          variant: "ghost",
          onClick: onClose,
          size: "medium",
          disabled: isLoading,
        },
        {
          label: "Cancel appointment",
          variant: "secondaryDark",
          onClick: handleSubmit,
          size: "medium",
          disabled: isLoading,
          loading: isLoading,
          loadingText: "Submitting...",
        },
      ]}
      content={
        <div className="flex flex-col gap-4 py-2">
          <p className="text-body-small-reg text-szBlack700">
            Please provide a reason for cancelling this appointment
            {appointment?.patientName ? ` for ${appointment.patientName}` : ""}
            {isStaff ? " (required for staff)." : "."}
          </p>
          <Inputs
            label="Remarks"
            placeholder="Enter reason for cancellation (required for staff)."
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              if (remarksError) setRemarksError("");
            }}
            isTextarea={true}
            maxCharacter={1000}
          />
          {remarksError && (
            <p className="text-caption-reg text-error700">{remarksError}</p>
          )}
        </div>
      }
    />
  );
};

export default CancelAppointmentModal;
