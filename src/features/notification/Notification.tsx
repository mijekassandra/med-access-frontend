import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  type Notification as ApiNotification,
} from "./api/notificationApi";

// Notification types
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  isRead: boolean;
  category?: "system" | "medical" | "appointment" | "inventory" | "user";
  relatedId?: string | null;
  relatedType?: string | null;
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
  notifications = [],
  onNotificationClick,
  onMarkAsRead,
  onDeleteNotification,
  onMarkAllAsRead,
  className = "",
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // RTK Query hooks
  const {
    data: notificationsData,
    isLoading,
    error,
  } = useGetNotificationsQuery();
  const [markNotificationRead, { isLoading: isMarkingRead }] =
    useMarkNotificationReadMutation();
  const [markAllNotificationsRead, { isLoading: isMarkingAllRead }] =
    useMarkAllNotificationsReadMutation();

  // Map API notification type to UI notification type
  const mapNotificationType = (
    type: ApiNotification["type"]
  ): "info" | "success" | "warning" | "error" => {
    switch (type) {
      case "system":
        return "info";
      case "appointment":
      case "announcement":
      case "health_education":
        return "info";
      case "medical":
        return "success";
      case "inventory":
        return "warning";
      case "user":
        return "success";
      default:
        return "info";
    }
  };

  // Map API notification to UI notification item
  const mapApiNotificationToItem = (
    apiNotification: ApiNotification
  ): NotificationItem => {
    return {
      id: apiNotification._id,
      title: apiNotification.title,
      message: apiNotification.message,
      type: mapNotificationType(apiNotification.type),
      timestamp: new Date(apiNotification.createdAt),
      isRead: apiNotification.status === "read",
      category:
        apiNotification.type === "health_education"
          ? undefined
          : (apiNotification.type as any),
      relatedId: apiNotification.relatedId || null,
      relatedType: apiNotification.relatedType || null,
    };
  };

  // Get navigation path based on relatedType
  const getNavigationPath = (
    relatedType: string | null | undefined,
    relatedId: string | null | undefined
  ): string | null => {
    if (!relatedType || !relatedId) return null;

    const routeMap: Record<string, string> = {
      appointment: "/appointments",
      announcement: "/announcements",
      health_education: "/health-education",
      medical_record: "/medical-records",
      pregnancy_record: "/medical-records",
    };

    const basePath = routeMap[relatedType];
    if (!basePath) return null;

    // For appointments and medical records, we might want to navigate to a specific item
    // For now, navigate to the list page. You can enhance this later to navigate to specific items
    return basePath;
  };

  // Convert API notifications to display format
  const apiNotifications: NotificationItem[] = notificationsData?.data
    ? notificationsData.data.map(mapApiNotificationToItem)
    : [];

  const displayNotifications =
    notifications.length > 0 ? notifications : apiNotifications;
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
  const handleNotificationClick = async (notification: NotificationItem) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      try {
        await markNotificationRead(notification.id).unwrap();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
      // Also call the prop handler if provided
      if (onMarkAsRead) {
        onMarkAsRead(notification.id);
      }
    }

    // Navigate to related page if applicable
    const navPath = getNavigationPath(
      notification.relatedType,
      notification.relatedId
    );
    if (navPath) {
      navigate(navPath);
      setIsOpen(false);
      return;
    }

    // Call custom handler if provided
    if (onNotificationClick) {
      onNotificationClick(notification);
    }

    // Show detail modal
    setSelectedNotification(notification);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead().unwrap();
      // Also call the prop handler if provided
      if (onMarkAllAsRead) {
        onMarkAllAsRead();
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
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
                  label={isMarkingAllRead ? "Marking..." : "Mark all read"}
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAllRead}
                  className="text-sm text-szPrimary500 hover:text-szPrimary700 font-medium"
                />
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">
                <p>Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-gray-500">
                <p>Error loading notifications</p>
              </div>
            ) : displayNotifications.length === 0 ? (
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
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors group ${
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
                        {onDeleteNotification && (
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
                        )}
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
                  label={isMarkingRead ? "Marking..." : "Mark as read"}
                  onClick={async () => {
                    if (!selectedNotification.isRead) {
                      try {
                        await markNotificationRead(
                          selectedNotification.id
                        ).unwrap();
                      } catch (error) {
                        console.error(
                          "Failed to mark notification as read:",
                          error
                        );
                      }
                    }
                    if (onMarkAsRead) onMarkAsRead(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                  disabled={isMarkingRead || selectedNotification.isRead}
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
