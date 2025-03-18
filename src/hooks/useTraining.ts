import React, { useState, useCallback } from "react";

import {
  TrainingSession,
  SessionParticipant,
  getTrainingSessions as getSessionsByStatus,
  getTrainingSession as getSessionDetails,
  updateTrainingSession,
  registerForSession,
  cancelRegistration as cancelSessionRegistration,
} from "@/lib/api/training";

export function useTraining() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessionsByStatus = useCallback(async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const sessionsData = await getSessionsByStatus(status);
      setSessions(sessionsData);
      return sessionsData;
    } catch (err) {
      console.error("Error loading sessions:", err);
      setError(err instanceof Error ? err.message : "Failed to load sessions");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSessionDetails = useCallback(async (sessionId: string) => {
    try {
      const details = await getSessionDetails(sessionId);
      return details;
    } catch (err) {
      console.error("Error loading session details:", err);
      throw err;
    }
  }, []);

  const updateSession = useCallback(
    async (sessionId: string, updateData: Partial<TrainingSession>) => {
      try {
        await updateTrainingSession(sessionId, updateData);
        // Refresh sessions
        const updatedSessions = sessions.map((session) =>
          session.id === sessionId ? { ...session, ...updateData } : session,
        );
        setSessions(updatedSessions);
        return updatedSessions.find((s) => s.id === sessionId);
      } catch (err) {
        console.error("Error updating session:", err);
        throw err;
      }
    },
    [sessions],
  );

  const register = useCallback(async (sessionId: string) => {
    try {
      await registerForSession(sessionId);
      // You might want to refresh the session details here
      return true;
    } catch (err) {
      console.error("Error registering for session:", err);
      throw err;
    }
  }, []);

  const cancelRegistration = useCallback(async (sessionId: string) => {
    try {
      await cancelSessionRegistration(sessionId);
      // You might want to refresh the session details here
      return true;
    } catch (err) {
      console.error("Error canceling registration:", err);
      throw err;
    }
  }, []);

  return {
    sessions,
    loading,
    error,
    loadSessionsByStatus,
    loadSessionDetails,
    updateSession,
    register,
    cancelRegistration,
  };
}

// Method 1: Named export
// export const useTraining = useTraining ;

// Method 2: Default export
// export default useTrainingHook;

// Method 3: Direct export of the function
// export function useTraining() { ... } - This was your original approach
