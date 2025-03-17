export type UserRole = "admin" | "supervisor" | "participant";

export interface UserPermissions {
  canManageUsers: boolean;
  canManageTrainingSessions: boolean;
  canCreateTrainingSessions: boolean;
  canEditTrainingSessions: boolean;
  canDeleteTrainingSessions: boolean;
  canViewAllParticipants: boolean;
  canManageContent: boolean;
  canViewAnalytics: boolean;
  canAccessAdminPanel: boolean;
}

export const getRolePermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case "admin":
      return {
        canManageUsers: true,
        canManageTrainingSessions: true,
        canCreateTrainingSessions: true,
        canEditTrainingSessions: true,
        canDeleteTrainingSessions: true,
        canViewAllParticipants: true,
        canManageContent: true,
        canViewAnalytics: true,
        canAccessAdminPanel: true,
      };
    case "supervisor":
      return {
        canManageUsers: false,
        canManageTrainingSessions: true,
        canCreateTrainingSessions: true,
        canEditTrainingSessions: true,
        canDeleteTrainingSessions: false,
        canViewAllParticipants: true,
        canManageContent: true,
        canViewAnalytics: true,
        canAccessAdminPanel: true,
      };
    case "participant":
      return {
        canManageUsers: false,
        canManageTrainingSessions: false,
        canCreateTrainingSessions: false,
        canEditTrainingSessions: false,
        canDeleteTrainingSessions: false,
        canViewAllParticipants: false,
        canManageContent: false,
        canViewAnalytics: false,
        canAccessAdminPanel: false,
      };
    default:
      return {
        canManageUsers: false,
        canManageTrainingSessions: false,
        canCreateTrainingSessions: false,
        canEditTrainingSessions: false,
        canDeleteTrainingSessions: false,
        canViewAllParticipants: false,
        canManageContent: false,
        canViewAnalytics: false,
        canAccessAdminPanel: false,
      };
  }
};
