import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";
import { UserRole } from "@/types/auth";

export type SignUpCredentials = {
  email: string;
  password: string;
  fullName: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export const signUp = async ({
  email,
  password,
  fullName,
}: SignUpCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "participant", // Default role for all new users
      },
    },
  });

  if (error) throw error;

  // Profile creation is now handled by database trigger
  // No need to manually create profile here

  return data;
};

export const signIn = async ({ email, password }: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
};

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;
};

export const updateUserRole = async (userId: string, role: UserRole) => {
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

type ProfileData = {
  fullName: string;
  title?: string;
  bio?: string;
  avatarUrl?: string;
  role?: UserRole;
};

// Profile creation is now handled by database trigger
// This function is kept for reference but no longer used
const createProfile = async (userId: string, profileData: ProfileData) => {
  const { error } = await supabase.from("profiles").insert([
    {
      id: userId,
      full_name: profileData.fullName,
      title: profileData.title || null,
      bio: profileData.bio || null,
      avatar_url: profileData.avatarUrl || null,
      role: "participant",
      created_at: new Date(),
    },
  ]);

  if (error) throw error;
};
