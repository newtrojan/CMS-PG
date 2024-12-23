export enum Role {
  USER = "USER",
  CCA = "CCA", // Call Centre Agent
  CCM = "CCM", // Call Centre Manager
  ADMIN = "ADMIN",
  SUDO = "SUDO", // Super Admin
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.SUDO]: 5,
  [Role.ADMIN]: 4,
  [Role.CCM]: 3,
  [Role.CCA]: 2,
  [Role.USER]: 1,
};

export function isRoleHigherThan(role1: Role, role2: Role): boolean {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
}
