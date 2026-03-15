import React from "react";
import Modal from "../../../global-components/Modal";
import Chip from "../../../global-components/Chip";
import Button from "../../../global-components/Button";

interface AppointmentDetailProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onOpenUploadPrescription?: (appointmentId: string) => void;
}

// Simple hash function to mask patient ID
const hashPatientId = (id: string): string => {
  if (!id) return "";

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to positive hex string and take first 12 characters
  const hashStr = Math.abs(hash)
    .toString(16)
    .padStart(12, "0")
    .substring(0, 12);
  return `#${hashStr.toUpperCase()}`;
};

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
  isOpen,
  onClose,
  appointment,
  onOpenUploadPrescription,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "accepted":
        return "green";
      case "serving":
        return "purple";
      case "completed":
        return "blue";
      case "cancelled":
      case "denied":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "serving":
        return "Serving";
      case "completed":
        return "Completed";
      case "cancelled":
      case "denied":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const isCancelledStatus =
    appointment?.status === "cancelled" || appointment?.status === "denied";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick
      showButton={false}
      title="Appointment Details"
      contentHeight="h-auto"
      modalWidth="w-[600px] pb-4"
      showFooter={false}
      content={
        appointment && (
          <div className="space-y-6">
            {/* Patient Information */}
            <div className="flex items-center gap-x-2">
              {/* <Avatar
                firstName={appointment.firstName}
                lastName={appointment.lastName}
                alt={appointment.firstName + " " + appointment.lastName}
                size="medium"
              /> */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {appointment.name || appointment.patientName || "N/A"}
                </h3>
                <p className="text-sm text-gray-600">
                  Patient ID:{" "}
                  {hashPatientId(appointment.patientId || appointment.id)}
                </p>
              </div>
            </div>

            {/* Appointment Information */}
            <div className="space-y-4">
              <div
                className={`grid gap-4 ${
                  appointment.status === "pending"
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                <div>
                  <p className="appointment-card-label-style">Status</p>
                  <div className="mt-1">
                    <Chip
                      label={getStatusText(appointment.status)}
                      type="colored"
                      color={getStatusColor(appointment.status) as any}
                    />
                  </div>
                </div>
                {appointment.status !== "pending" && (
                  <div>
                    <p className="appointment-card-label-style">Queue Number</p>
                    <p className="mt-1 appointment-card-value-style bold text-success700">
                      # {appointment.queueNumber}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="appointment-card-label-style">
                    Appointment Type
                  </p>
                  <p className="mt-1 appointment-card-value-style">
                    {appointment.appointmentType === "telemedicine"
                      ? "Telemedicine"
                      : appointment.appointmentType === "in-person"
                        ? "In-Person"
                        : appointment.appointmentType}
                  </p>
                </div>
                {/* <div>
                  <p className="appointment-card-label-style">Doctor</p>
                  <p className="mt-1 appointment-card-value-style">
                    {appointment.doctor || "No doctor provided"}
                  </p>
                </div> */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="appointment-card-label-style">Reason</p>
                <p className="mt-1 appointment-card-value-style">
                  {appointment.reason}
                </p>
              </div>
            </div>

            {/* Cancellation Remarks - only when status is cancelled or denied */}
            {isCancelledStatus && (
              <div className="space-y-1">
                <p className="appointment-card-label-style">
                  Cancellation Remarks
                </p>
                <p className="mt-1 appointment-card-value-style">
                  {appointment.doctorCancellationRemarks ||
                    appointment.cancellationRemarks ||
                    appointment.cancellation_remarks ||
                    "No remarks provided"}
                </p>
              </div>
            )}

            {/* Prescription - when uploaded (clickable to view image/PDF) */}
            {(appointment.prescriptionUrl ||
              appointment.prescriptionFileName) && (
              <div className="space-y-1">
                <p className="appointment-card-label-style">Prescription</p>
                <div className="mt-1">
                  {appointment.prescriptionUrl ? (
                    <a
                      href={appointment.prescriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="appointment-card-value-style text-primary700 hover:underline cursor-pointer inline-flex items-center gap-1 font-medium"
                    >
                      {appointment.prescriptionFileName || "View prescription"}
                      <span className="text-caption-reg text-primary600">
                        (opens in new tab)
                      </span>
                    </a>
                  ) : (
                    <span className="appointment-card-value-style">
                      {appointment.prescriptionFileName}
                    </span>
                  )}
                  {(appointment.prescriptionUploadedAt ||
                    appointment.prescriptionUploadedBy) && (
                    <p className="text-caption-reg text-szBlack600 mt-1">
                      Uploaded
                      {appointment.prescriptionUploadedAt &&
                        ` at ${new Date(
                          appointment.prescriptionUploadedAt,
                        ).toLocaleString()}`}
                      {appointment.prescriptionUploadedBy &&
                        ` by ${appointment.prescriptionUploadedBy}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Upload prescription - for staff when completed or serving */}
            {onOpenUploadPrescription &&
              (appointment.status === "completed" ||
                appointment.status === "serving") && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button
                    label="Upload prescription"
                    size="medium"
                    variant="primary"
                    onClick={() => onOpenUploadPrescription(appointment.id)}
                  />
                </div>
              )}
            {/* {appointment?.status === "serving" && onMarkAsDone && (
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  label="Mark as Done"
                  size="medium"
                  variant="primary"
                  onClick={() => onMarkAsDone(appointment.id)}
                />
              </div>
            )} */}
          </div>
        )
      }
    />
  );
};

export default AppointmentDetail;
