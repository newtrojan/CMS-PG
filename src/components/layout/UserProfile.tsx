import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";

interface UserProfileData {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export const UserProfile = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/v1/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Profile fetch error:", errorData);
          throw new Error(errorData.message || "Failed to fetch profile");
        }

        const data = await response.json();
        if (data.success) {
          setProfileData(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Maybe show a notification here
        if (error instanceof Error) {
          showNotification({
            type: "error",
            message: error.message,
          });
        }
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  // Get display name
  const displayName =
    profileData?.firstName && profileData?.lastName
      ? `${profileData.firstName} ${profileData.lastName}`
      : user.email;

  // Get initials
  const initials =
    profileData?.firstName && profileData?.lastName
      ? `${profileData.firstName[0]}${profileData.lastName[0]}`
      : user.email.split("@")[0].slice(0, 2).toUpperCase();

  // Format role for display
  const roleDisplay =
    (profileData?.role || user.role).charAt(0) +
    (profileData?.role || user.role).slice(1).toLowerCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-700">{initials}</span>
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-700">{displayName}</p>
          <p className="text-xs text-gray-500">{roleDisplay}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              navigate("/profile");
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              handleLogout();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
