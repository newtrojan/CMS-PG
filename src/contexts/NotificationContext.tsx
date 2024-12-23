import React, { createContext, useContext, useState } from "react";
import { useNotificationsHistory } from "./NotificationsHistoryContext";
import { CheckCircle, XCircle } from "lucide-react";

type NotificationType = {
  type: "success" | "error";
  message: string;
};

type NotificationContextType = {
  showNotification: (notification: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );
  const { addNotification } = useNotificationsHistory();

  const showNotification = (newNotification: NotificationType) => {
    setNotification(newNotification);
    addNotification({
      type: newNotification.type,
      message: newNotification.message,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white z-50 ${
            notification.type === "success" ? "bg-green-600" : "bg-red-500"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            {notification.message}
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
