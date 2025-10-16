import React from "react";
import Button from "../../../global-components/Button";

interface AppointmentData {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  doctorImage?: string;
}

interface PatientAppointmentCardProps {
  appointment: AppointmentData;
  onCancel?: () => void;
  onReschedule?: () => void;
  type?: "telemedicine" | "in_person";
  status?: "pending" | "confirmed" | "completed" | "canceled";
}

const PatientAppointmentCard: React.FC<PatientAppointmentCardProps> = ({
  appointment,
  onCancel,
  onReschedule,
  type,
  status,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "telemedicine":
        return "bg-szPrimary100 text-szPrimary500";
      case "in_person":
        return "bg-szSecondary100 text-szSecondary800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    return type === "telemedicine" ? "Telemedicine" : "In-Person";
  };
  return (
    <div className="bg-szWhite100 rounded-xl p-4 shadow-md border border-szGray200 relative">
      {/* Optional Type and Status Badges */}

      <div className="flex items-start gap-4">
        {/* Doctor's Profile Picture */}
        <div className="h-[110px] bg-szGray200 rounded-lg flex items-center justify-center flex-shrink-0">
          {appointment.doctorImage ? (
            <img
              src={appointment.doctorImage}
              alt={appointment.doctorName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-8 h-8 bg-szGray400 rounded-full flex items-center justify-center">
              <span className="text-szWhite100 text-body-sm-semibold">
                {appointment.doctorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          )}
        </div>

        {/* Doctor's Details */}
        <div className="flex-1 min-w-0">
          <div>
            <h6 className="text-h6">{appointment.doctorName}</h6>
            <p className="text-szDarkGrey600 text-body-base-reg">
              {appointment.specialty}
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-szPrimary900 text-body-small-reg mt-2 font-semibold">
                {appointment.date} - {appointment.time}
              </p>
              {(type || status) && (
                <div className=" top-3 right-3 flex gap-2 z-10">
                  {type && (
                    <p
                      className={`px-2 py-1 rounded-full text-caption-reg ${getTypeColor(
                        type
                      )}`}
                    >
                      {getTypeLabel(type)}
                    </p>
                  )}
                  {status && (
                    <p
                      className={`px-2 py-1 rounded-full text-caption-reg ${getStatusColor(
                        status
                      )}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          {status !== "canceled" && status !== "completed" && (
            <div className="flex gap-3 mt-4 justify-end">
              <Button
                variant="ghost"
                label="Cancel"
                size="small"
                onClick={onCancel}
              />
              <Button
                variant="secondary"
                label="Reschedule"
                size="small"
                onClick={onReschedule}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointmentCard;
