"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Role } from "../types/auth";
import { STORAGE_KEYS } from "../constants/storage";

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  logout: () => void;
  setAuthInfo: (user: User, token: string) => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // Validate user data
        if (
          parsedUser &&
          parsedUser.id &&
          parsedUser.email &&
          parsedUser.role
        ) {
          setToken(storedToken);
          setUser(parsedUser);
        } else {
          throw new Error("Invalid stored user data");
        }
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      // Clear invalid data
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.TOKEN) {
        // Token removed in another tab
        if (!e.newValue) {
          setToken(null);
          setUser(null);
          return;
        }
        // Token added/updated in another tab
        setToken(e.newValue);
      }

      if (e.key === STORAGE_KEYS.USER) {
        // User removed in another tab
        if (!e.newValue) {
          setUser(null);
          return;
        }
        // User added/updated in another tab
        try {
          const parsedUser = JSON.parse(e.newValue);
          if (
            parsedUser &&
            parsedUser.id &&
            parsedUser.email &&
            parsedUser.role
          ) {
            setUser(parsedUser);
          }
        } catch (error) {
          console.error("Error parsing user data from storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error("Logout error occurred");
      throw error;
    }
  };

  const setAuthInfo = (user: User, token: string) => {
    try {
      if (!user || !token) {
        throw new Error("Invalid auth data");
      }

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      setUser(user);
      setToken(token);

      console.log("Auth state updated:", {
        token: token.substring(0, 10) + "...",
        user: {
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error saving auth state:", error);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      throw error;
    }
  };

  const getStoredRole = (): Role | null => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.role;
      }
      return null;
    } catch {
      return null;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        logout,
        setAuthInfo,
        isLoading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
