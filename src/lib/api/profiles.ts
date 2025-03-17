import { supabase } from "../supabase";

export type Profile = {
  id: string;
  fullName: string;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type ProfileUpdateData = {
  fullName?: string;
  title?: string;
  bio?: string;
  avatarUrl?: string;
};

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    title: data.title,
    bio: data.bio,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const updateProfile = async (
  userId: string,
  profile: ProfileUpdateData,
) => {
  const updates = {
    ...(profile.fullName && { full_name: profile.fullName }),
    ...(profile.title !== undefined && { title: profile.title }),
    ...(profile.bio !== undefined && { bio: profile.bio }),
    ...(profile.avatarUrl !== undefined && { avatar_url: profile.avatarUrl }),
    updated_at: new Date(),
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) throw error;
};

export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("user-content")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("user-content").getPublicUrl(filePath);
  const avatarUrl = data.publicUrl;

  // Update user profile with new avatar URL
  await updateProfile(userId, { avatarUrl });

  return avatarUrl;
};
