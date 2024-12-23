// src/components/layout/Header.tsx
import { Search, Bell } from "lucide-react";

const Header = () => {
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
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
          <span className="font-medium">John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
