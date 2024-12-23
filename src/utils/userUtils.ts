import { User } from "../types/auth";

export const getUserDisplayInfo = (user: User) => {
  const firstName = user.firstName || user.email.split("@")[0];
  const lastName = user.lastName || "";

  const displayName =
    firstName && lastName ? `${firstName} ${lastName}` : firstName;

  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : firstName.slice(0, 2).toUpperCase();

  const roleDisplay =
    user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();

  return {
    displayName,
    initials,
    roleDisplay,
  };
};
