import MobileNotifCard, {
  type Notification,
} from "../mobile-global-components/MobileNotifCard";
import Button from "../../../global-components/Button";
import { ArrowLeft } from "iconsax-react";
import { useNavigate } from "react-router-dom";

const MobileNotification = () => {
  const navigate = useNavigate();

  // Mock notification data based on the image description
  const mockNotifications: Notification[] = [
    {
      notification_id: 1,
      user_id: 1,
      title: "New Medical Record Available",
      message:
        "Your latest medical record from Dr. Maria Santos has been uploaded. Please review your diagnosis and treatment plan.",
      notif_type: "medical_record",
      status: "sent", // unread
      timestamp: new Date("2024-02-15T18:30:00"),
    },
    {
      notification_id: 2,
      user_id: 1,
      title: "Appointment Reminder",
      message:
        "Your appointment with Dr. John Rodriguez is scheduled for tomorrow at 2:00 PM. Please arrive 15 minutes early.",
      notif_type: "appointment",
      status: "read",
      timestamp: new Date("2024-02-14T17:15:00"),
    },
    {
      notification_id: 3,
      user_id: 1,
      title: "New Health Announcement",
      message:
        "Important health advisory: Monkeypox disease outbreak in the municipality. Please review safety precautions.",
      notif_type: "announcement",
      status: "read",
      timestamp: new Date("2024-02-14T00:45:00"),
    },
    {
      notification_id: 4,
      user_id: 1,
      title: "System Maintenance Notice",
      message:
        "Scheduled system maintenance will occur on February 20th from 2:00 AM to 4:00 AM. Some features may be temporarily unavailable.",
      notif_type: "system",
      status: "read",
      timestamp: new Date("2024-02-12T19:20:00"),
    },
  ];

  const handleNotificationClick = (notification: Notification) => {
    console.log("Notification clicked:", notification);
    // Handle notification click - could navigate to details or mark as read
  };

  const handleMarkAllRead = () => {
    console.log("Mark all notifications as read");
    // Handle marking all notifications as read
  };

  const unreadCount = mockNotifications.filter(
    (n) => n.status === "sent"
  ).length;

  return (
    <div className="min-h-screen bg-szGrey150">
      {/* Page Header */}
      <div className="flex flex-row px-4 py-4 gap-2 ">
        <ArrowLeft
          size={28}
          className="text-szPrimary700 cursor-pointer"
          onClick={() => navigate("/patient-dashboard")}
        />
        <div className="flex flex-row justify-between gap-2 w-full">
          <div className="flex flex-col ">
            <div className="flex flex-col gap-2">
              <h3 className="text-h3 text-szBlack700 font-bold">
                Notifications
              </h3>
            </div>
            <p className="text-szDarkGrey600 text-body-base-reg">{`${unreadCount} unread notification${
              unreadCount !== 1 ? "s" : ""
            }`}</p>
          </div>

          {/* Mark all read button */}
          <div className="mt-3">
            <Button
              label="Mark all read"
              variant="ghost"
              size="small"
              onClick={handleMarkAllRead}
              className="text-szPrimary700"
            />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 py-4 space-y-3">
        {mockNotifications.map((notification) => (
          <MobileNotifCard
            key={notification.notification_id}
            notification={notification}
            onClick={() => handleNotificationClick(notification)}
          />
        ))}
      </div>

      {/* Load More Button */}
      <div className="px-4 pb-6">
        <Button
          label="Load More"
          variant="secondaryDark"
          size="large"
          fullWidth
          onClick={() => console.log("Load more notifications")}
        />
      </div>
    </div>
  );
};

export default MobileNotification;
