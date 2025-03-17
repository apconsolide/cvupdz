import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getTrainingSessions,
  getTrainingSession,
  createTrainingSession,
  updateTrainingSession,
  deleteTrainingSession,
  getSessionParticipants,
  registerForSession,
  cancelRegistration,
  updateParticipantAttendance,
  getSessionRecordings,
  uploadSessionRecording,
  TrainingSession,
  SessionParticipant,
  SessionRecording,
} from "@/lib/api/training";

export function useTraining() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [recordings, setRecordings] = useState<SessionRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        setError(null);
        const sessionsData = await getTrainingSessions();
        setSessions(sessionsData);
      } catch (err) {
        console.error("Error loading training sessions:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load training sessions",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, []);

  const loadSessionsByStatus = async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const filteredSessions = await getTrainingSessions(status);
      setSessions(filteredSessions);
      return filteredSessions;
    } catch (err) {
      console.error("Error loading sessions by status:", err);
      setError(err instanceof Error ? err.message : "Failed to load sessions");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadSessionDetails = async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);
      const [sessionDetails, sessionParticipants, sessionRecordings] =
        await Promise.all([
          getTrainingSession(sessionId),
          getSessionParticipants(sessionId),
          getSessionRecordings(sessionId),
        ]);

      setParticipants(sessionParticipants);
      setRecordings(sessionRecordings);

      return {
        session: sessionDetails,
        participants: sessionParticipants,
        recordings: sessionRecordings,
      };
    } catch (err) {
      console.error("Error loading session details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load session details",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (
    sessionData: Omit<TrainingSession, "id" | "enrolled" | "instructorName">,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const sessionId = await createTrainingSession(sessionData);

      // Refresh sessions
      const updatedSessions = await getTrainingSessions();
      setSessions(updatedSessions);

      return sessionId;
    } catch (err) {
      console.error("Error creating training session:", err);
      setError(err instanceof Error ? err.message : "Failed to create session");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (
    sessionId: string,
    updates: Partial<
      Omit<
        TrainingSession,
        "id" | "enrolled" | "instructorName" | "instructorId"
      >
    >,
  ) => {
    try {
      setLoading(true);
      setError(null);
      await updateTrainingSession(sessionId, updates);

      // Refresh sessions
      const updatedSessions = await getTrainingSessions();
      setSessions(updatedSessions);
    } catch (err) {
      console.error("Error updating training session:", err);
      setError(err instanceof Error ? err.message : "Failed to update session");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTrainingSession(sessionId);

      // Update local state
      setSessions(sessions.filter((session) => session.id !== sessionId));
    } catch (err) {
      console.error("Error deleting training session:", err);
      setError(err instanceof Error ? err.message : "Failed to delete session");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (sessionId: string) => {
    if (!user) throw new Error("User must be logged in");

    try {
      setLoading(true);
      setError(null);
      await registerForSession(sessionId, user.id);

      // Refresh sessions and participants
      const [updatedSessions, updatedParticipants] = await Promise.all([
        getTrainingSessions(),
        getSessionParticipants(sessionId),
      ]);

      setSessions(updatedSessions);
      setParticipants(updatedParticipants);
    } catch (err) {
      console.error("Error registering for session:", err);
      setError(
        err instanceof Error ? err.message : "Failed to register for session",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelRegistrationForSession = async (sessionId: string) => {
    if (!user) throw new Error("User must be logged in");

    try {
      setLoading(true);
      setError(null);
      await cancelRegistration(sessionId, user.id);

      // Refresh sessions and participants
      const [updatedSessions, updatedParticipants] = await Promise.all([
        getTrainingSessions(),
        getSessionParticipants(sessionId),
      ]);

      setSessions(updatedSessions);
      setParticipants(updatedParticipants);
    } catch (err) {
      console.error("Error canceling registration:", err);
      setError(
        err instanceof Error ? err.message : "Failed to cancel registration",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = async (
    participantId: string,
    attendanceData: {
      attendancePercentage?: number;
      joinTime?: string;
      leaveTime?: string;
      status?: "present" | "partial" | "absent";
    },
  ) => {
    try {
      setLoading(true);
      setError(null);
      await updateParticipantAttendance(participantId, attendanceData);

      // Update local state
      setParticipants(
        participants.map((p) => {
          if (p.id === participantId) {
            return {
              ...p,
              ...(attendanceData.attendancePercentage !== undefined && {
                attendancePercentage: attendanceData.attendancePercentage,
              }),
              ...(attendanceData.joinTime !== undefined && {
                joinTime: attendanceData.joinTime,
              }),
              ...(attendanceData.leaveTime !== undefined && {
                leaveTime: attendanceData.leaveTime,
              }),
              ...(attendanceData.status !== undefined && {
                status: attendanceData.status,
              }),
            };
          }
          return p;
        }),
      );
    } catch (err) {
      console.error("Error updating attendance:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update attendance",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadRecording = async (
    sessionId: string,
    file: File,
    metadata: {
      title: string;
      duration: string;
      thumbnailUrl?: string;
    },
  ) => {
    try {
      setLoading(true);
      setError(null);
      const recordingId = await uploadSessionRecording(
        sessionId,
        file,
        metadata,
      );

      // Refresh recordings
      const updatedRecordings = await getSessionRecordings(sessionId);
      setRecordings(updatedRecordings);

      return recordingId;
    } catch (err) {
      console.error("Error uploading recording:", err);
      setError(
        err instanceof Error ? err.message : "Failed to upload recording",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sessions,
    participants,
    recordings,
    loading,
    error,
    loadSessionsByStatus,
    loadSessionDetails,
    createSession,
    updateSession,
    deleteSession,
    register,
    cancelRegistration: cancelRegistrationForSession,
    updateAttendance,
    uploadRecording,
  };
}
