import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getProfile,
  updateProfile,
  Profile,
  ProfileUpdateData,
} from "@/lib/api/profiles";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userProfile = await getProfile(user.id);
        setProfile(userProfile);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const updateUserProfile = async (profileData: ProfileUpdateData) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      await updateProfile(user.id, profileData);

      // Refresh profile data
      const updatedProfile = await getProfile(user.id);
      setProfile(updatedProfile);

      return updatedProfile;
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile: updateUserProfile };
}
