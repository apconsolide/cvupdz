import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export type ModuleProgress = {
  module: string;
  progress: number;
  lastActivity: string | null;
};

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProgress([]);
      setLoading(false);
      return;
    }

    const loadUserProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id);

        if (fetchError) throw fetchError;

        const formattedProgress: ModuleProgress[] = data.map((item) => ({
          module: item.module,
          progress: item.progress,
          lastActivity: item.last_activity,
        }));

        setProgress(formattedProgress);
      } catch (err) {
        console.error("Error loading user progress:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load progress",
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, [user]);

  const updateModuleProgress = async (module: string, newProgress: number) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Check if a record already exists for this module
      const { data: existingData } = await supabase
        .from("user_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("module", module)
        .single();

      const now = new Date().toISOString();

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("user_progress")
          .update({
            progress: newProgress,
            last_activity: now,
            updated_at: now,
          })
          .eq("id", existingData.id);

        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from("user_progress")
          .insert([
            {
              user_id: user.id,
              module,
              progress: newProgress,
              last_activity: now,
              created_at: now,
              updated_at: now,
            },
          ]);

        if (insertError) throw insertError;
      }

      // Update local state
      setProgress((prev) => {
        const updatedProgress = [...prev];
        const existingIndex = updatedProgress.findIndex(
          (p) => p.module === module,
        );

        if (existingIndex >= 0) {
          updatedProgress[existingIndex] = {
            ...updatedProgress[existingIndex],
            progress: newProgress,
            lastActivity: now,
          };
        } else {
          updatedProgress.push({
            module,
            progress: newProgress,
            lastActivity: now,
          });
        }

        return updatedProgress;
      });

      return true;
    } catch (err) {
      console.error("Error updating module progress:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update progress",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { progress, loading, error, updateModuleProgress };
}
