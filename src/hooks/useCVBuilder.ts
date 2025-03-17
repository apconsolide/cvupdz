import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCVTemplates,
  getUserCVs,
  createUserCV,
  updateUserCV,
  deleteUserCV,
  getCVOptimizationScore,
  CVTemplate,
  UserCV,
} from "@/lib/api/cv-builder";

export function useCVBuilder() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [userCVs, setUserCVs] = useState<UserCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Load templates regardless of user login status
        const templatesData = await getCVTemplates();
        setTemplates(templatesData);

        // Only load user CVs if logged in
        if (user) {
          const userCVsData = await getUserCVs(user.id);
          setUserCVs(userCVsData);
        }
      } catch (err) {
        console.error("Error loading CV data:", err);
        setError(err instanceof Error ? err.message : "Failed to load CV data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const createCV = async (
    templateId: string,
    title: string,
    initialContent: any,
  ) => {
    if (!user) throw new Error("User must be logged in");

    try {
      setLoading(true);
      setError(null);
      const cvId = await createUserCV(
        user.id,
        templateId,
        title,
        initialContent,
      );

      // Refresh user CVs
      const updatedUserCVs = await getUserCVs(user.id);
      setUserCVs(updatedUserCVs);

      return cvId;
    } catch (err) {
      console.error("Error creating CV:", err);
      setError(err instanceof Error ? err.message : "Failed to create CV");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCV = async (
    cvId: string,
    updates: { title?: string; content?: any },
  ) => {
    if (!user) throw new Error("User must be logged in");

    try {
      setLoading(true);
      setError(null);
      await updateUserCV(cvId, updates);

      // Refresh user CVs
      const updatedUserCVs = await getUserCVs(user.id);
      setUserCVs(updatedUserCVs);
    } catch (err) {
      console.error("Error updating CV:", err);
      setError(err instanceof Error ? err.message : "Failed to update CV");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCV = async (cvId: string) => {
    if (!user) throw new Error("User must be logged in");

    try {
      setLoading(true);
      setError(null);
      await deleteUserCV(cvId);

      // Update local state
      setUserCVs(userCVs.filter((cv) => cv.id !== cvId));
    } catch (err) {
      console.error("Error deleting CV:", err);
      setError(err instanceof Error ? err.message : "Failed to delete CV");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOptimizationScore = async (cvId: string) => {
    try {
      setLoading(true);
      setError(null);
      return await getCVOptimizationScore(cvId);
    } catch (err) {
      console.error("Error getting optimization score:", err);
      setError(
        err instanceof Error ? err.message : "Failed to get optimization score",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    templates,
    userCVs,
    loading,
    error,
    createCV,
    updateCV,
    deleteCV,
    getOptimizationScore,
  };
}
