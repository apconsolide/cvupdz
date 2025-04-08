import React, { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

import {
  TrainingSession,
  SessionParticipant,
  SessionRecording,
  getTrainingSessions as getSessionsByStatus,
  getTrainingSession as getSessionDetails,
  updateTrainingSession,
  registerForSession,
  cancelRegistration as cancelSessionRegistration,
  getSessionParticipants,
  getSessionRecordings,
} from "@/lib/api/training";

import {
  syncSessionParticipants,
  processExtensionRecording,
  registerChromeExtension,
} from "@/lib/api/zoom";

export function useTraining() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [recordings, setRecordings] = useState<SessionRecording[]>([]);
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
      // Return empty array instead of throwing to prevent UI errors
      setSessions([]);
      return [];
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

  const { user } = useAuth();

  const register = useCallback(
    async (sessionId: string) => {
      try {
        if (!user?.id) {
          throw new Error("User not authenticated");
        }
        await registerForSession(sessionId, user.id);
        // Refresh the session details
        await loadSessionsByStatus("scheduled");
        return true;
      } catch (err) {
        console.error("Error registering for session:", err);
        throw err;
      }
    },
    [user, loadSessionsByStatus],
  );

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

  // Load participants for a session
  const loadSessionParticipants = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      const participantsData = await getSessionParticipants(sessionId);
      setParticipants(participantsData);
      return participantsData;
    } catch (err) {
      console.error("Error loading session participants:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load participants",
      );
      setParticipants([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load recordings for a session
  const loadSessionRecordings = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      const recordingsData = await getSessionRecordings(sessionId);
      setRecordings(recordingsData);
      return recordingsData;
    } catch (err) {
      console.error("Error loading session recordings:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load recordings",
      );
      setRecordings([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Process a recording from the Chrome extension
  const processRecording = useCallback(
    async (
      sessionId: string,
      zoomMeetingId: string,
      recordingData: {
        start_time: string;
        end_time: string;
        title?: string;
        file_size?: number;
        file_path?: string;
        thumbnail_url?: string;
        participants: Array<{
          name: string;
          email: string;
          join_time: string;
          leave_time: string;
        }>;
      },
    ) => {
      try {
        setLoading(true);
        const result = await processExtensionRecording(
          sessionId,
          zoomMeetingId,
          recordingData,
        );

        toast({
          title: "Recording Processed",
          description: `Successfully processed recording with ${result.participantsProcessed} participants`,
        });

        // Refresh recordings
        await loadSessionRecordings(sessionId);

        // Refresh participants
        await loadSessionParticipants(sessionId);

        return result;
      } catch (err) {
        console.error("Error processing recording:", err);
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to process recording",
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast, loadSessionRecordings, loadSessionParticipants],
  );

  // Sync participants from Zoom to session
  const syncParticipants = useCallback(
    async (sessionId: string, zoomMeetingId: string) => {
      try {
        setLoading(true);
        const updatedCount = await syncSessionParticipants(
          sessionId,
          zoomMeetingId,
        );

        toast({
          title: "Participants Synced",
          description: `Updated attendance data for ${updatedCount} participants`,
        });

        // Refresh participants
        await loadSessionParticipants(sessionId);

        return updatedCount;
      } catch (err) {
        console.error("Error syncing participants:", err);
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to sync participants",
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast, loadSessionParticipants],
  );

  // Register Chrome extension
  const registerExtension = useCallback(
    async (
      extensionId: string,
      version: string,
      settings?: Record<string, any>,
    ) => {
      try {
        setLoading(true);
        const success = await registerChromeExtension(
          extensionId,
          version,
          settings,
        );

        if (success) {
          toast({
            title: "Extension Registered",
            description: "Chrome extension successfully registered",
          });
        }

        return success;
      } catch (err) {
        console.error("Error registering extension:", err);
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to register extension",
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return {
    sessions,
    participants,
    recordings,
    loading,
    error,
    loadSessionsByStatus,
    loadSessionDetails,
    loadSessionParticipants,
    loadSessionRecordings,
    updateSession,
    register,
    cancelRegistration,
    processRecording,
    syncParticipants,
    registerExtension,
  };
}
