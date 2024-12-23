import React, { createContext, useContext, useState } from "react";

export type NotificationItem = {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  timestamp: Date;
  read: boolean;
};

type NotificationsContextType = {
  notifications: NotificationItem[];
  addNotification: (
    notification: Omit<NotificationItem, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
};

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function NotificationsHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (
    notification: Omit<NotificationItem, "id" | "timestamp" | "read">
  ) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, markAsRead, clearNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotificationsHistory = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotificationsHistory must be used within NotificationsHistoryProvider"
    );
  }
  return context;
};
