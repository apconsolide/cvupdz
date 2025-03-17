import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export type UserActivity = {
  id: string;
  activityType: string;
  description: string;
  createdAt: string;
};

export function useUserActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const loadUserActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("user_activities")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (fetchError) throw fetchError;

        const formattedActivities: UserActivity[] = data.map((item) => ({
          id: item.id,
          activityType: item.activity_type,
          description: item.description,
          createdAt: item.created_at,
        }));

        setActivities(formattedActivities);
      } catch (err) {
        console.error("Error loading user activities:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load activities",
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserActivities();
  }, [user]);

  const addActivity = async (activityType: string, description: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const now = new Date().toISOString();
      const { data, error: insertError } = await supabase
        .from("user_activities")
        .insert([
          {
            user_id: user.id,
            activity_type: activityType,
            description,
            created_at: now,
          },
        ])
        .select();

      if (insertError) throw insertError;

      // Update local state with the new activity
      if (data && data.length > 0) {
        const newActivity: UserActivity = {
          id: data[0].id,
          activityType: data[0].activity_type,
          description: data[0].description,
          createdAt: data[0].created_at,
        };

        setActivities((prev) => [newActivity, ...prev]);
      }

      return true;
    } catch (err) {
      console.error("Error adding activity:", err);
      setError(err instanceof Error ? err.message : "Failed to add activity");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { activities, loading, error, addActivity };
}
