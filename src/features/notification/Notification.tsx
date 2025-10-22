import React, { useState, useRef, useEffect } from "react";
import {
  Notification as NotificationIcon,
  CloseCircle,
  TickCircle,
  InfoCircle,
  Warning2,
  Trash,
} from "iconsax-react";
import Badge from "../../global-components/Badge";
import Button from "../../global-components/Button";

// Notification types
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  isRead: boolean;
  category?: "system" | "medical" | "appointment" | "inventory" | "user";
}

// Props interface
interface NotificationProps {
  userRole?: "admin" | "doctor" | "user";
  notifications?: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onDeleteNotification?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  className?: string;
}

const Notification: React.FC<NotificationProps> = ({
  userRole = "doctor",
  notifications = [],
  onNotificationClick,
  onMarkAsRead,
  onDeleteNotification,
  onMarkAllAsRead,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sample notifications based on user role
  const getSampleNotifications = (): NotificationItem[] => {
    const baseNotifications: NotificationItem[] = [
      {
        id: "1",
        title: "System Update",
        message:
          "The system will be under maintenance tonight from 2:00 AM to 4:00 AM.",
        type: "info",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        category: "system",
      },
      {
        id: "2",
        title: "Appointment Reminder",
        message:
          "You have an upcoming appointment with Patient #12345 in 2 hours.",
        type: "info",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: false,
        category: "appointment",
      },
    ];

    if (userRole === "admin") {
      return [
        ...baseNotifications,
        {
          id: "3",
          title: "New User Registration",
          message: "Dr. Sarah Johnson has registered as a new doctor.",
          type: "success",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          isRead: true,
          category: "user",
        },
        {
          id: "4",
          title: "Low Inventory Alert",
          message: "Paracetamol 500mg is running low. Current stock: 15 units.",
          type: "warning",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          isRead: false,
          category: "inventory",
        },
        {
          id: "5",
          title: "System Error",
          message:
            "Database connection timeout detected. Please check server logs.",
          type: "error",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
          isRead: false,
          category: "system",
        },
      ];
    } else if (userRole === "doctor") {
      return [
        ...baseNotifications,
        {
          id: "3",
          title: "Patient Record Updated",
          message: "Patient Maria Santos' medical record has been updated.",
          type: "success",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          isRead: true,
          category: "medical",
        },
        {
          id: "4",
          title: "Lab Results Ready",
          message: "Blood test results for Patient #12345 are now available.",
          type: "info",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          isRead: false,
          category: "medical",
        },
      ];
    } else {
      // Patient role
      return [
        {
          id: "1",
          title: "Appointment Confirmed",
          message:
            "Your appointment with Dr. Smith has been confirmed for tomorrow at 10:00 AM.",
          type: "success",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
          isRead: false,
          category: "appointment",
        },
        {
          id: "2",
          title: "Prescription Ready",
          message: "Your prescription is ready for pickup at the pharmacy.",
          type: "info",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          isRead: true,
          category: "medical",
        },
      ];
    }
  };

  const displayNotifications =
    notifications.length > 0 ? notifications : getSampleNotifications();
  const unreadCount = displayNotifications.filter((n) => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <TickCircle
            variant="Linear"
            className="mt-[2px] w-5 h-5 text-szPrimary500"
          />
        );
      case "warning":
        return (
          <Warning2
            variant="Linear"
            className="mt-[2px] w-5 h-5 text-szSecondary700"
          />
        );
      case "error":
        return (
          <CloseCircle
            variant="Linear"
            className="mt-[2px] w-5 h-5 text-red-600"
          />
        );
      default:
        return (
          <InfoCircle
            variant="Linear"
            className="mt-[2px] w-5 h-5 text-szPrimary700"
          />
        );
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Handle notification click
  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    setSelectedNotification(notification);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  // Handle delete notification
  const handleDeleteNotification = (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    if (onDeleteNotification) {
      onDeleteNotification(notificationId);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Icon with Badge */}
      <>
        <Badge
          badgeContent={unreadCount > 0 ? unreadCount.toString() : undefined}
          variant={unreadCount > 0 ? "standard" : "dot"}
          color={"#E4970B"}
        >
          <NotificationIcon
            variant="Bulk"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-7 h-7 cursor-pointer text-szSecondary500`}
          />
        </Badge>
      </>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-72 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  size="small"
                  variant="ghost"
                  label="Mark all read"
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-szPrimary500 hover:text-szPrimary700 font-medium"
                />
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <NotificationIcon
                  variant="Linear"
                  className="w-12 h-12 mx-auto mb-2 text-gray-300"
                />
                <p>No notifications</p>
              </div>
            ) : (
              displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    notification.isRead
                      ? "bg-white hover:bg-szPrimary50"
                      : "bg-szSecondary50 hover:bg-szSecondary100"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-body-base-strong mt-[2px] ${
                            notification.isRead
                              ? "text-gray-900"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) =>
                              handleDeleteNotification(notification.id, e)
                            }
                            className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash
                              variant="Linear"
                              className="w-3 h-3 text-gray-400"
                            />
                          </button>
                        </div>
                      </div>

                      <p className="text-body-small-reg text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-caption-reg text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-szSecondary500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {displayNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification Detail Modal (for mobile or detailed view) */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-2">
          <div className="bg-white rounded-lg max-w-md w-full p-4">
            <div className="flex items-start gap-3 mb-4 rounded-lg ">
              {getNotificationIcon(selectedNotification.type)}
              <div className="flex-1">
                <h6 className="text-h6">{selectedNotification.title}</h6>
                <p className="text-caption-reg text-gray-500">
                  {formatTimestamp(selectedNotification.timestamp)}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{selectedNotification.message}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="primary"
                  label="Mark as read"
                  onClick={() => {
                    if (onMarkAsRead) onMarkAsRead(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                />
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => setSelectedNotification(null)}
                  label="Close"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
