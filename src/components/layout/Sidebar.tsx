import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Users,
  Settings,
  Search,
} from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r h-screen fixed left-0 top-0">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          </div>
          <h1 className="text-xl font-bold text-gray-800">CCMS</h1>
        </div>
      </div>
      <nav className="p-4 space-y-2">
        <SidebarLink
          href="/"
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active={location.pathname === "/"}
        />
        <SidebarLink
          href="/reports"
          icon={<FileText size={20} />}
          text="Reports"
          active={location.pathname === "/reports"}
        />
        <SidebarLink
          href="/insurer"
          icon={<Building2 size={20} />}
          text="Insurer"
          active={location.pathname === "/insurer"}
        />
        <SidebarLink
          href="/customers"
          icon={<Users size={20} />}
          text="Customers"
          active={location.pathname === "/customers"}
        />
        <SidebarLink
          href="/settings"
          icon={<Settings size={20} />}
          text="Settings"
          active={location.pathname === "/settings"}
        />
      </nav>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

export const SidebarLink = ({ href, icon, text, active }: SidebarLinkProps) => {
  return (
    <Link
      to={href}
      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
        ${
          active
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      <span className="mr-3">{icon}</span>
      {text}
    </Link>
  );
};
