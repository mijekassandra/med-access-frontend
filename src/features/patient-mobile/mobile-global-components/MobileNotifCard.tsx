import React from "react";
import Button from "../../../global-components/Button";

// Notification interface based on the database schema
export interface Notification {
  notification_id: number;
  user_id: number;
  message: string;
  notif_type: string;
  status: "sent" | "read" | "acknowledged";
  timestamp: Date;
  title?: string; // Optional title field
}

interface MobileNotifCardProps {
  notification: Notification;
  onClick: () => void;
}

const MobileNotifCard: React.FC<MobileNotifCardProps> = ({
  notification,
  onClick,
}) => {
  // Format date and time
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get notification type color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "appointment":
        return "bg-szPrimary500";
      case "medical_record":
        return "bg-szPrimary200";
      case "announcement":
        return "bg-szWarning500";
      case "system":
        return "bg-szGrey500";
      default:
        return "bg-szPrimary500";
    }
  };

  // Check if notification is unread
  const isUnread = notification.status === "sent";

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm ${
        isUnread ? "border-l-4 border-l-szPrimary500" : ""
      }`}
    >
      <div className="flex flex-col gap-4">
        {/* Header with title and view button */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start flex-1 gap-2">
            {isUnread && (
              <div className="w-2 h-2 rounded-full bg-szSecondary500 flex-shrink-0 mt-1" />
            )}
            <h5
              className={`text-h5 leading-tight ${
                isUnread ? "text-szPrimary500" : "text-szBlack700"
              }`}
            >
              {notification.title || "Notification"}
            </h5>
          </div>
          {notification.notif_type !== "system" && (
            <Button
              label="View"
              size="small"
              variant="secondary"
              onClick={onClick}
            />
          )}
        </div>

        {/* Message content */}
        <p className="text-body-base-reg text-szGrey600 leading-5">
          {notification.message}
        </p>

        {/* Footer with type indicator and timestamp */}
        <div className="flex items-center justify-between mt-1">
          <div
            className={`px-2 py-1 rounded-full ${getTypeColor(
              notification.notif_type
            )}`}
          >
            <p className="text-white text-caption-reg uppercase px-1 font-semibold">
              {notification.notif_type.replace("_", " ").toUpperCase()}
            </p>
          </div>
          <span className="text-caption text-szGrey500 text-xs">
            {formatDate(notification.timestamp)} •{" "}
            {formatTime(notification.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileNotifCard;
