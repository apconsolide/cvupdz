import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getLinkedInProfile,
  createOrUpdateLinkedInProfile,
  getProfileOptimizations,
  getContentIdeas,
  analyzeLinkedInProfile,
  LinkedInProfile,
  ProfileOptimization,
  ContentIdea,
} from "@/lib/api/linkedin";

export function useLinkedIn() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [optimizations, setOptimizations] = useState<ProfileOptimization[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Load optimizations and content ideas regardless of user login status
        const [optimizationsData, ideasData] = await Promise.all([
          getProfileOptimizations(),
          getContentIdeas(),
        ]);

        setOptimizations(optimizationsData);
        setContentIdeas(ideasData);

        // Only load user profile if logged in
        if (user) {
          const profileData = await getLinkedInProfile(user.id);
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Error loading LinkedIn data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load LinkedIn data",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const updateProfile = async (
    profileData: Partial<
      Omit<LinkedInProfile, "id" | "userId" | "lastUpdated">
    >,
  ) => {
    if (!user) throw new Error("User must be logged in");

    try {
      setLoading(true);
      setError(null);
      await createOrUpdateLinkedInProfile(user.id, profileData);

      // Refresh profile
      const updatedProfile = await getLinkedInProfile(user.id);
      setProfile(updatedProfile);

      return updatedProfile;
    } catch (err) {
      console.error("Error updating LinkedIn profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getContentIdeasByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const filteredIdeas = await getContentIdeas(category);
      return filteredIdeas;
    } catch (err) {
      console.error("Error getting content ideas by category:", err);
      setError(
        err instanceof Error ? err.message : "Failed to get content ideas",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const analyzeProfile = async (profileData: any) => {
    try {
      setLoading(true);
      setError(null);
      return await analyzeLinkedInProfile(profileData);
    } catch (err) {
      console.error("Error analyzing LinkedIn profile:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze profile",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    optimizations,
    contentIdeas,
    loading,
    error,
    updateProfile,
    getContentIdeasByCategory,
    analyzeProfile,
  };
}
