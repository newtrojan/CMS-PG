// src/components/layout/Header.tsx
import { Search, Bell } from "lucide-react";
import { UserProfile } from "./UserProfile";

export const Header = () => {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Global Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <UserProfile />
      </div>
    </header>
  );
};
