// src/components/layout/MainLayout.tsx
import { Search, Bell, Plus } from "lucide-react";
import { Link, Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { Loading } from "../ui/loading";
import { UserProfile } from "./UserProfile";
import { useState } from "react";
import { NotificationsSidebar } from "./NotificationsSidebar";

export const MainLayout = () => {
  const { user, isLoading } = useAuth();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Global Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/claims/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="h-4 w-4" />
              New Claim
            </Link>

            <NotificationsSidebar />

            <UserProfile />
          </div>
        </header>
        {notification && (
          <div
            className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white z-50 ${
              notification.type === "success" ? "bg-blue-600" : "bg-red-500"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {notification.message}
            </div>
          </div>
        )}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
