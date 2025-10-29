import React from "react";
import Modal from "../../../global-components/Modal";
import Button from "../../../global-components/Button";
import Chip from "../../../global-components/Chip";

interface AppointmentDetailProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onMarkAsDone?: (id: string) => void;
}

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
  isOpen,
  onClose,
  appointment,
  onMarkAsDone,
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
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

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
              <img
                src={appointment.avatar}
                alt={appointment.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {appointment.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Patient ID: {appointment.id}
                </p>
              </div>
            </div>

            {/* Appointment Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <p className="appointment-card-label-style">Queue Number</p>
                  <p className="mt-1 appointment-card-value-style bold text-success700">
                    # 20{" "}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="appointment-card-label-style">
                    Appointment Type
                  </p>
                  <p className="mt-1 appointment-card-value-style">
                    Telemedicine
                  </p>
                </div>
                <div>
                  <p className="appointment-card-label-style">Doctor</p>
                  <p className="mt-1 appointment-card-value-style">
                    {appointment.doctor || "No doctor provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="appointment-card-label-style">Description</p>
                <p className="mt-1 appointment-card-value-style">
                  {appointment.description || "No description provided"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
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
