export const ROLES = {
  SUDO: "SUDO",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  USER: "USER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Helper functions for role checks
export const isAdmin = (role?: Role | null) =>
  role === ROLES.ADMIN || role === ROLES.SUDO;
export const isManager = (role?: Role | null) => role === ROLES.MANAGER;
export const isSudo = (role?: Role | null) => role === ROLES.SUDO;

// For role-based permissions
export const ROLE_PERMISSIONS = {
  [ROLES.SUDO]: ["all"],
  [ROLES.ADMIN]: [
    "create_user",
    "edit_user",
    "view_all_claims",
    "manage_insurers",
  ],
  [ROLES.MANAGER]: ["view_team_claims", "approve_claims", "edit_claims"],
  [ROLES.USER]: ["view_own_claims", "create_claims"],
} as const;
