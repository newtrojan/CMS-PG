import { useContext } from "react";
import { AuthContext, AuthContextType } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context as AuthContextType;
};
