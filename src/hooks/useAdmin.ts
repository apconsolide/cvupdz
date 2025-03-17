import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getAdminStats,
  getUsers,
  getUserDetails,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  AdminStats,
  UserData,
} from "@/lib/api/admin";

export function useAdmin() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      if (!user) {
        setStats(null);
        setUsers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if user has admin role
        // This would typically be done by checking user.app_metadata.role
        // For now, we'll assume the check is done elsewhere

        const [statsData, usersData] = await Promise.all([
          getAdminStats(),
          getUsers(),
        ]);

        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        console.error("Error loading admin data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load admin data",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [user]);

  const loadUsersByStatus = async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const filteredUsers = await getUsers(status);
      setUsers(filteredUsers);
      return filteredUsers;
    } catch (err) {
      console.error("Error loading users by status:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      return await getUserDetails(userId);
    } catch (err) {
      console.error("Error loading user details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load user details",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeUserStatus = async (
    userId: string,
    status: "active" | "inactive",
  ) => {
    try {
      setLoading(true);
      setError(null);
      await updateUserStatus(userId, status);

      // Update local state
      setUsers(
        users.map((u) => {
          if (u.id === userId) {
            return { ...u, status };
          }
          return u;
        }),
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update user status",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (userId: string, role: string) => {
    try {
      setLoading(true);
      setError(null);
      await updateUserRole(userId, role);

      // Update local state
      setUsers(
        users.map((u) => {
          if (u.id === userId) {
            return { ...u, role };
          }
          return u;
        }),
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update user role",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteUser(userId);

      // Update local state
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err instanceof Error ? err.message : "Failed to delete user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    users,
    loading,
    error,
    loadUsersByStatus,
    loadUserDetails,
    changeUserStatus,
    changeUserRole,
    removeUser,
  };
}
