import React from "react";
import Avatar from "../../../global-components/Avatar";
import Button from "../../../global-components/Button";
import Chip from "../../../global-components/Chip";
import ButtonsIcon from "../../../global-components/ButtonsIcon";

interface TelemedicineCardProps {
  id: string;
  name: string;
  avatar?: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  time?: string;
  description?: string;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onView?: (id: string) => void;
  isSelected?: boolean;
}

const TelemedicineCard: React.FC<TelemedicineCardProps> = ({
  id,
  name,
  avatar,
  status,
  time,
  description,
  onAccept,
  onReject,
  onView,
  isSelected = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "accepted":
        return "green";
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
        <div className="flex items-start gap-2 flex-1">
          <Avatar src={avatar} alt={name} size="medium" />
          <div className="flex-1 min-w-0">
            <p className="text-body-small-strong font-semibold text-gray-900 truncate">
              {name}
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            {time && <p className="text-xs text-gray-400 mt-1">{time}</p>}
            {/* <div className="mt-2">
              <Chip
                label={getStatusText(status)}
                type="colored"
                color={getStatusColor(status) as any}
              />
            </div> */}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {status === "pending" && (
            <>
              <Button
                label="Accept"
                size="small"
                variant="secondaryDark"
                onClick={() => {}}
              />
              <Button
                label="Delete"
                size="small"
                variant="ghost"
                onClick={() => {}}
              />
            </>
          )}
          {status === "accepted" && (
            <Button
              label="View"
              size="small"
              variant="primary"
              onClick={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TelemedicineCard;
