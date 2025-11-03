import React from "react";
import Avatar from "../../../global-components/Avatar";
import Button from "../../../global-components/Button";
import Chip from "../../../global-components/Chip";

interface TelemedicineCardProps {
  id: string;
  name: string;
  avatar?: string;
  status: "pending" | "accepted" | "serving" | "completed" | "cancelled";
  queueNumber?: number;
  appointmentType?: string;
  date?: string;
  description?: string;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onView?: (appointment: any) => void;
  onMarkAsDone?: (id: string) => void;
}

const TelemedicineCard: React.FC<TelemedicineCardProps> = ({
  id,
  name,
  avatar,
  status,
  queueNumber,
  appointmentType,
  date,
  description,
  onAccept,
  onReject,
  onView,
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
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-2 w-full">
          <Avatar src={avatar} alt={name} size="medium" />
          <div className="flex-1 min-w-0">
            <p className="text-body-small-strong font-semibold text-gray-900 max-w-[100px] md:max-w-full">
              {name}
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            {date && (
              <p className="text-xs text-gray-500 mt-1">
                {date} • {appointmentType}
              </p>
            )}
            {queueNumber && (
              <p className="text-xs text-gray-400 mt-1">
                Queue #{queueNumber} • {appointmentType}
              </p>
            )}
            <div className="mt-2">
              <Chip
                label={getStatusText(status)}
                type="colored"
                color={getStatusColor(status) as any}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          {status === "pending" && (
            <div className="flex items-center gap-[2px] w-fit">
              <Button
                label="Accept"
                size="small"
                variant="secondaryDark"
                onClick={() => onAccept?.(id)}
              />
              <Button
                label="Reject"
                size="small"
                variant="ghost"
                onClick={() => onReject?.(id)}
              />
            </div>
          )}
          {status === "serving" && (
            <div className="flex gap-2">
              <Button
                label="Done"
                size="small"
                variant="secondary"
                onClick={() => onMarkAsDone?.(id)}
              />
              <Button
                label="View"
                size="small"
                variant="primary"
                onClick={() =>
                  onView?.({
                    id,
                    name,
                    avatar,
                    status,
                    queueNumber,
                    description,
                  })
                }
              />
            </div>
          )}
          {status === "accepted" && (
            <Button
              label="View"
              size="small"
              variant="primary"
              onClick={() =>
                onView?.({ id, name, avatar, status, queueNumber, description })
              }
              className="col-span-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TelemedicineCard;
