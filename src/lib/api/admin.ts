import { supabase } from "../supabase";

export type AdminStats = {
  totalUsers: number;
  totalCVs: number;
  totalTrainingSessions: number;
  monthlyGrowth: number;
};

export type UserData = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastLogin: string | null;
};

export const getAdminStats = async (): Promise<AdminStats> => {
  // In a real implementation, this would be a more complex query
  // For now, we'll use separate queries and combine the results

  const { count: userCount, error: userError } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (userError) throw userError;

  const { count: cvCount, error: cvError } = await supabase
    .from("user_cvs")
    .select("id", { count: "exact", head: true });

  if (cvError) throw cvError;

  const { count: sessionCount, error: sessionError } = await supabase
    .from("training_sessions")
    .select("id", { count: "exact", head: true });

  if (sessionError) throw sessionError;

  // Calculate monthly growth (mock data for now)
  const monthlyGrowth = 24;

  return {
    totalUsers: userCount || 0,
    totalCVs: cvCount || 0,
    totalTrainingSessions: sessionCount || 0,
    monthlyGrowth,
  };
};

export const getUsers = async (status?: string): Promise<UserData[]> => {
  let query = supabase
    .from("profiles")
    .select("*, users!inner(email, role, status, created_at, last_login)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("users.status", status);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map((user) => ({
    id: user.id,
    email: user.users.email,
    fullName: user.full_name,
    role: user.users.role || "user",
    status: user.users.status,
    createdAt: user.users.created_at,
    lastLogin: user.users.last_login,
  }));
};

export const getUserDetails = async (
  userId: string,
): Promise<
  UserData & {
    title: string | null;
    bio: string | null;
    avatarUrl: string | null;
  }
> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, users!inner(email, role, status, created_at, last_login)")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    email: data.users.email,
    fullName: data.full_name,
    role: data.users.role || "user",
    status: data.users.status,
    createdAt: data.users.created_at,
    lastLogin: data.users.last_login,
    title: data.title,
    bio: data.bio,
    avatarUrl: data.avatar_url,
  };
};

export const updateUserStatus = async (
  userId: string,
  status: "active" | "inactive",
): Promise<void> => {
  const { error } = await supabase
    .from("users")
    .update({ status })
    .eq("id", userId);

  if (error) throw error;
};

export const updateUserRole = async (
  userId: string,
  role: string,
): Promise<void> => {
  // Get role_id from roles table
  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", role)
    .single();

  if (roleError) throw roleError;

  // Update user metadata with new role
  const { error: userUpdateError } = await supabase.auth.admin.updateUserById(
    userId,
    { user_metadata: { role } },
  );

  if (userUpdateError) throw userUpdateError;

  // Also update the role and role_id in the profiles table
  const { error: profileUpdateError } = await supabase
    .from("profiles")
    .update({
      role,
      role_id: roleData.id,
      updated_at: new Date(),
    })
    .eq("id", userId);

  if (profileUpdateError) throw profileUpdateError;
};

export const deleteUser = async (userId: string): Promise<void> => {
  // In a real implementation, this would be a more complex operation
  // that handles cascading deletes or soft deletes
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) throw error;
};
