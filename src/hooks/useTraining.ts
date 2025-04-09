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

import {
  ZoomApiClient,
  ZoomMeeting,
  ZoomParticipant,
  ZoomRecording,
} from "@/lib/zoom";

// Initialize ZoomApiClient - these values should come from environment variables or config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const zoomClient = new ZoomApiClient(SUPABASE_URL, SUPABASE_KEY);

export function useTraining() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [recordings, setRecordings] = useState<SessionRecording[]>([]);
  const [zoomMeetings, setZoomMeetings] = useState<ZoomMeeting[]>([]);
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

      // If the session has a Zoom meeting ID, get the meeting details
      if (details.zoom_meeting_id) {
        try {
          const zoomMeeting = await zoomClient.getMeeting(
            details.zoom_meeting_id,
          );
          details.zoomDetails = zoomMeeting;
        } catch (zoomErr) {
          console.error("Error loading Zoom meeting details:", zoomErr);
          // Don't throw here, just continue with the session details we have
        }
      }

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

        // If there's Zoom data to update and we have a Zoom meeting ID
        if (
          updateData.zoom_meeting_id &&
          (updateData.title || updateData.start_time || updateData.duration)
        ) {
          try {
            await zoomClient.updateMeeting(updateData.zoom_meeting_id, {
              topic: updateData.title,
              startTime: updateData.start_time,
              duration: updateData.duration
                ? Math.ceil(updateData.duration / 60)
                : undefined, // Convert minutes to hours for Zoom API
              agenda: updateData.description,
            });
          } catch (zoomErr) {
            console.error("Error updating Zoom meeting:", zoomErr);
            // Don't throw here, the core session update succeeded
            toast({
              title: "Warning",
              description:
                "Session updated but Zoom meeting details could not be synchronized",
              variant: "warning",
            });
          }
        }

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
    [sessions, toast],
  );

  const { user } = useAuth();

  const register = useCallback(
    async (sessionId: string) => {
      try {
        if (!user?.id) {
          throw new Error("User not authenticated");
        }

        const session = await getSessionDetails(sessionId);
        await registerForSession(sessionId, user.id);

        // If this session has a Zoom meeting, register the user with Zoom as well
        if (session.zoom_meeting_id) {
          try {
            await zoomClient.addRegistrant(session.zoom_meeting_id, {
              email: user.email,
              first_name:
                user.first_name || user.display_name?.split(" ")[0] || "User",
              last_name:
                user.last_name ||
                user.display_name?.split(" ").slice(1).join(" ") ||
                "",
            });
          } catch (zoomErr) {
            console.error("Error registering with Zoom:", zoomErr);
            // Don't throw here, the core registration succeeded
            toast({
              title: "Warning",
              description:
                "Registered for session but Zoom registration may not be complete",
              variant: "warning",
            });
          }
        }

        // Refresh the session details
        await loadSessionsByStatus("scheduled");
        return true;
      } catch (err) {
        console.error("Error registering for session:", err);
        throw err;
      }
    },
    [user, loadSessionsByStatus, toast],
  );

  const cancelRegistration = useCallback(
    async (sessionId: string) => {
      try {
        const session = await getSessionDetails(sessionId);
        await cancelSessionRegistration(sessionId);

        // If this is a Zoom meeting, we might need to cancel the Zoom registration
        // Note: The Zoom API often doesn't provide a direct way to cancel registrations
        // This would need to be handled by the edge function if supported

        // Refresh the sessions
        await loadSessionsByStatus("scheduled");
        return true;
      } catch (err) {
        console.error("Error canceling registration:", err);
        throw err;
      }
    },
    [loadSessionsByStatus],
  );

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

        // Convert the recording data to match what the Zoom API expects
        const zoomRecordingData = {
          recording_start: recordingData.start_time,
          recording_end: recordingData.end_time,
          file_type: "MP4", // Assuming MP4 as default
          file_size: recordingData.file_size || 0,
          play_url: recordingData.file_path || "",
          download_url: recordingData.file_path || "",
          title: recordingData.title,
          thumbnail_url: recordingData.thumbnail_url,
        };

        // Process the recording through the Zoom API client
        const zoomRecording = await zoomClient.processRecording(
          sessionId,
          zoomMeetingId,
          zoomRecordingData,
        );

        // Also process through our existing handler for compatibility
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

  // Sync participants from Zoom to session using the ZoomApiClient
  const syncParticipants = useCallback(
    async (sessionId: string, zoomMeetingId: string) => {
      try {
        setLoading(true);

        // Use the ZoomApiClient to sync participants
        const updatedCount = await zoomClient.syncParticipants(
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

  // Create a Zoom meeting and associate it with a training session
  const createZoomMeeting = useCallback(
    async (
      sessionId: string,
      meetingDetails: {
        topic: string;
        startTime: string;
        duration: number; // in minutes
        agenda?: string;
        settings?: {
          host_video?: boolean;
          participant_video?: boolean;
          join_before_host?: boolean;
          mute_upon_entry?: boolean;
          waiting_room?: boolean;
          breakout_room?: boolean;
          recording?: string;
        };
      },
    ) => {
      try {
        setLoading(true);

        // Convert duration from minutes to hours for Zoom API (which expects duration in minutes)
        const zoomDuration = Math.ceil(meetingDetails.duration); // Round up to nearest minute

        // Create the Zoom meeting
        const zoomMeeting = await zoomClient.createMeeting(
          meetingDetails.topic,
          meetingDetails.startTime,
          zoomDuration,
          meetingDetails.agenda,
          user?.id, // Use current user ID as created_by
          meetingDetails.settings,
        );

        // Update the training session with the Zoom meeting ID
        if (zoomMeeting && zoomMeeting.id) {
          await updateSession(sessionId, {
            zoom_meeting_id: zoomMeeting.id,
            zoom_join_url: zoomMeeting.join_url,
            zoom_password: zoomMeeting.password,
          });
        }

        toast({
          title: "Zoom Meeting Created",
          description: "Successfully created and linked Zoom meeting",
        });

        return zoomMeeting;
      } catch (err) {
        console.error("Error creating Zoom meeting:", err);
        toast({
          title: "Error",
          description:
            err instanceof Error
              ? err.message
              : "Failed to create Zoom meeting",
          variant: "destructive",
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, updateSession, toast],
  );

  // Get Zoom meeting details
  const getZoomMeeting = useCallback(async (meetingId: string) => {
    try {
      const meeting = await zoomClient.getMeeting(meetingId);
      return meeting;
    } catch (err) {
      console.error("Error getting Zoom meeting:", err);
      throw err;
    }
  }, []);

  // Get upcoming Zoom meetings
  const getUpcomingZoomMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const meetings = await zoomClient.getUpcomingMeetings(user?.id);
      setZoomMeetings(meetings);
      return meetings;
    } catch (err) {
      console.error("Error getting upcoming Zoom meetings:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load Zoom meetings",
      );
      setZoomMeetings([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Generate a report for a meeting
  const generateMeetingReport = useCallback(async (zoomMeetingId: string) => {
    try {
      const report = await zoomClient.generateMeetingReport(zoomMeetingId);
      return report;
    } catch (err) {
      console.error("Error generating meeting report:", err);
      throw err;
    }
  }, []);

  // End an active Zoom meeting
  const endZoomMeeting = useCallback(
    async (meetingId: string) => {
      try {
        const success = await zoomClient.endMeeting(meetingId);

        if (success) {
          toast({
            title: "Meeting Ended",
            description: "Zoom meeting has been ended successfully",
          });
        }

        return success;
      } catch (err) {
        console.error("Error ending Zoom meeting:", err);
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to end Zoom meeting",
          variant: "destructive",
        });
        throw err;
      }
    },
    [toast],
  );

  return {
    sessions,
    participants,
    recordings,
    zoomMeetings,
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
    // New Zoom-specific methods
    createZoomMeeting,
    getZoomMeeting,
    getUpcomingZoomMeetings,
    generateMeetingReport,
    endZoomMeeting,
  };
}
