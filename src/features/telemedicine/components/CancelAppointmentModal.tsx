import React, { useState, useEffect } from "react";

// components
import Modal from "../../../global-components/Modal";
import Inputs from "../../../global-components/Inputs";

// icons
import { CloseCircle } from "iconsax-react";

export interface CancelAppointmentModalAppointment {
  id: string;
  patientName?: string;
}

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: CancelAppointmentModalAppointment | null;
  onSubmit?: (appointmentId: string, remarks: string) => void | Promise<void>;
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSubmit,
}) => {
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens or appointment changes
  useEffect(() => {
    if (isOpen) {
      setRemarks("");
      setIsLoading(false);
    }
  }, [isOpen, appointment]);

  const handleSubmit = async () => {
    if (!appointment) return;
    setIsLoading(true);
    try {
      if (onSubmit) {
        await Promise.resolve(onSubmit(appointment.id, remarks));
      } else {
        // Frontend-only: simulate submit delay
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      onClose();
    } finally {
      setIsLoading(false);
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
          label: "Submit",
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
            {appointment?.patientName ? ` for ${appointment.patientName}` : ""}.
          </p>
          <Inputs
            label="Remarks"
            placeholder="Enter reason for cancellation..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            isTextarea={true}
            maxCharacter={500}
          />
        </div>
      }
    />
  );
};

export default CancelAppointmentModal;
