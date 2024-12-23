import { useState } from "react";
import { X, Bell, Check, XCircle, CheckCircle, Info } from "lucide-react";
import {
  useNotificationsHistory,
  NotificationItem,
} from "../../contexts/NotificationsHistoryContext";
import { formatDistanceToNow } from "date-fns";

export const NotificationsSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, clearNotifications } =
    useNotificationsHistory();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <>
      {/* Notification Bell with Badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-gray-50 rounded-full"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">Notifications</h2>
                  <p className="text-sm text-gray-500">
                    {unreadCount} unread notifications
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          {getIcon(notification.type)}
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Check className="h-4 w-4 text-blue-600" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Bell className="h-12 w-12 mb-2 stroke-1" />
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
