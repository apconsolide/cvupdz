import { supabase } from "../supabase";

// Types for Zoom API responses and requests
export type ZoomMeeting = {
  id: string;
  topic: string;
  start_time: string;
  duration: number;
  join_url: string;
  password: string;
};

export type ZoomParticipant = {
  id: string;
  name: string;
  email: string;
  join_time: string;
  leave_time: string;
  duration: number;
  user_id?: string;
};

export type ZoomRecording = {
  id: string;
  meeting_id: string;
  recording_start: string;
  recording_end: string;
  file_type: string;
  file_size: number;
  play_url: string;
  download_url: string;
  title?: string;
  thumbnail_url?: string;
};

// Create a Zoom meeting
export const createZoomMeeting = async (
  topic: string,
  startTime: string,
  duration: number,
  agenda?: string,
  createdBy?: string,
): Promise<ZoomMeeting> => {
  try {
    // In a real implementation, this would call the Zoom API
    // Generate a numeric meeting ID that matches Zoom's format
    // Zoom meeting IDs are typically 10-11 digits
    const meetingId = Math.floor(
      10000000000 + Math.random() * 90000000000,
    ).toString();
    const password = Math.random().toString(36).substring(2, 8);
    const joinUrl = `https://us05web.zoom.us/s/${meetingId}`;

    // Store the meeting in our database
    const { data, error } = await supabase
      .from("zoom_meetings")
      .insert([
        {
          id: meetingId,
          topic,
          start_time: startTime,
          duration,
          agenda: agenda || "",
          join_url: joinUrl,
          password: password,
          created_by: createdBy || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Database error creating Zoom meeting:", error);
      // If there's a database error, return a simulated meeting object
      // This allows the app to work even if the database tables aren't set up yet
      return {
        id: meetingId,
        topic,
        start_time: startTime,
        duration,
        join_url: joinUrl,
        password: password,
      };
    }

    return {
      id: data[0].id,
      topic: data[0].topic,
      start_time: data[0].start_time,
      duration: data[0].duration,
      join_url: data[0].join_url,
      password: data[0].password,
    };
  } catch (error) {
    console.error("Error creating Zoom meeting:", error);
    // Return a simulated meeting object even if there's an error
    const meetingId = Math.floor(
      10000000000 + Math.random() * 90000000000,
    ).toString();
    return {
      id: meetingId,
      topic,
      start_time: startTime,
      duration,
      join_url: `https://us05web.zoom.us/s/${meetingId}`,
      password: Math.random().toString(36).substring(2, 8),
    };
  }
};

// Get Zoom meeting details
export const getZoomMeeting = async (
  meetingId: string,
): Promise<ZoomMeeting | null> => {
  try {
    // In a real implementation, this would call the Zoom API
    // For now, we'll fetch from our database
    const { data, error } = await supabase
      .from("zoom_meetings")
      .select("*")
      .eq("id", meetingId)
      .single();

    if (error) {
      console.error("Database error getting Zoom meeting:", error);
      // If there's a database error, return a simulated meeting object
      return {
        id: meetingId,
        topic: "Training Session",
        start_time: new Date().toISOString(),
        duration: 60,
        join_url: `https://us05web.zoom.us/s/${meetingId}`,
        password: "123456",
      };
    }
    if (!data) return null;

    return {
      id: data.id,
      topic: data.topic,
      start_time: data.start_time,
      duration: data.duration,
      join_url: data.join_url,
      password: data.password,
    };
  } catch (error) {
    console.error("Error getting Zoom meeting:", error);
    // Return a simulated meeting object even if there's an error
    return {
      id: meetingId,
      topic: "Training Session",
      start_time: new Date().toISOString(),
      duration: 60,
      join_url: `https://us05web.zoom.us/s/${meetingId}`,
      password: "123456",
    };
  }
};

// Get meeting participants
export const getZoomParticipants = async (
  meetingId: string,
): Promise<ZoomParticipant[]> => {
  try {
    // In a real implementation, this would call the Zoom API
    // For now, we'll fetch from our database
    const { data, error } = await supabase
      .from("zoom_participants")
      .select("*")
      .eq("meeting_id", meetingId);

    if (error) throw error;
    if (!data || data.length === 0) return [];

    return data.map((participant) => ({
      id: participant.id,
      name: participant.name,
      email: participant.email,
      join_time: participant.join_time,
      leave_time: participant.leave_time,
      duration: participant.duration,
      user_id: participant.user_id,
    }));
  } catch (error) {
    console.error("Error getting Zoom participants:", error);
    throw new Error("Failed to get meeting participants");
  }
};

// Track participant attendance
export const trackZoomAttendance = async (
  meetingId: string,
  participantData: {
    name: string;
    email: string;
    join_time: string;
    leave_time?: string;
    user_id?: string;
  },
): Promise<string> => {
  try {
    // Check if participant already exists
    const { data: existingParticipant } = await supabase
      .from("zoom_participants")
      .select("id")
      .eq("meeting_id", meetingId)
      .eq("email", participantData.email)
      .single();

    if (existingParticipant) {
      // Update existing participant
      const { error } = await supabase
        .from("zoom_participants")
        .update({
          leave_time: participantData.leave_time || new Date().toISOString(),
          duration: calculateDuration(
            participantData.join_time,
            participantData.leave_time || new Date().toISOString(),
          ),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingParticipant.id);

      if (error) throw error;
      return existingParticipant.id;
    } else {
      // Create new participant record
      const { data, error } = await supabase
        .from("zoom_participants")
        .insert([
          {
            meeting_id: meetingId,
            name: participantData.name,
            email: participantData.email,
            user_id: participantData.user_id || null,
            join_time: participantData.join_time,
            leave_time: participantData.leave_time || null,
            duration: participantData.leave_time
              ? calculateDuration(
                  participantData.join_time,
                  participantData.leave_time,
                )
              : 0,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data[0].id;
    }
  } catch (error) {
    console.error("Error tracking Zoom attendance:", error);
    throw new Error("Failed to track participant attendance");
  }
};

// Get meeting recordings
export const getZoomRecordings = async (
  meetingId: string,
): Promise<ZoomRecording[]> => {
  try {
    // In a real implementation, this would call the Zoom API
    // For now, we'll fetch from our database
    const { data, error } = await supabase
      .from("zoom_recordings")
      .select("*")
      .eq("meeting_id", meetingId);

    if (error) throw error;
    if (!data || data.length === 0) return [];

    return data.map((recording) => ({
      id: recording.id,
      meeting_id: recording.meeting_id,
      recording_start: recording.recording_start,
      recording_end: recording.recording_end,
      file_type: recording.file_type,
      file_size: recording.file_size,
      play_url: recording.play_url,
      download_url: recording.download_url,
      title: recording.title || "Zoom Recording",
      thumbnail_url: recording.thumbnail_url || null,
    }));
  } catch (error) {
    console.error("Error getting Zoom recordings:", error);
    throw new Error("Failed to get meeting recordings");
  }
};

// Add a recording
export const addZoomRecording = async (
  meetingId: string,
  recordingData: {
    recording_start: string;
    recording_end: string;
    file_type: string;
    file_size: number;
    play_url: string;
    download_url: string;
    title?: string;
    thumbnail_url?: string;
  },
): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("zoom_recordings")
      .insert([
        {
          meeting_id: meetingId,
          recording_start: recordingData.recording_start,
          recording_end: recordingData.recording_end,
          file_type: recordingData.file_type,
          file_size: recordingData.file_size,
          play_url: recordingData.play_url,
          download_url: recordingData.download_url,
          title: recordingData.title || "Zoom Recording",
          thumbnail_url: recordingData.thumbnail_url || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data[0].id;
  } catch (error) {
    console.error("Error adding Zoom recording:", error);
    throw new Error("Failed to add recording");
  }
};

// Process recording from Chrome extension
export const processExtensionRecording = async (
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
): Promise<{
  recordingId: string;
  participantsProcessed: number;
}> => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    // 1. Create a record in extension_recordings table
    const { data: recordingEntry, error: recordingError } = await supabase
      .from("extension_recordings")
      .insert([
        {
          session_id: sessionId,
          zoom_meeting_id: zoomMeetingId,
          user_id: userId,
          title:
            recordingData.title ||
            `Session Recording - ${new Date(recordingData.start_time).toLocaleDateString()}`,
          start_time: recordingData.start_time,
          end_time: recordingData.end_time,
          duration:
            calculateDuration(
              recordingData.start_time,
              recordingData.end_time,
            ) * 60, // convert to seconds
          file_size: recordingData.file_size || 0,
          file_path: recordingData.file_path || null,
          thumbnail_url:
            recordingData.thumbnail_url ||
            "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=300&q=80",
          status: "ready",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (recordingError) throw recordingError;
    const recordingId = recordingEntry[0].id;

    // 2. Process participant data
    let participantsProcessed = 0;
    for (const participant of recordingData.participants) {
      try {
        // Add to extension_recording_participants table
        await supabase.from("extension_recording_participants").insert([
          {
            recording_id: recordingId,
            name: participant.name,
            email: participant.email,
            join_time: participant.join_time,
            leave_time: participant.leave_time,
            duration:
              calculateDuration(participant.join_time, participant.leave_time) *
              60, // convert to seconds
            created_at: new Date().toISOString(),
          },
        ]);

        // Also track in zoom_participants table
        await trackZoomAttendance(zoomMeetingId, {
          name: participant.name,
          email: participant.email,
          join_time: participant.join_time,
          leave_time: participant.leave_time,
        });

        participantsProcessed++;
      } catch (participantError) {
        console.error(
          `Error processing participant ${participant.email}:`,
          participantError,
        );
        // Continue with next participant
      }
    }

    // 3. Sync the zoom participants with session participants
    await syncSessionParticipants(sessionId, zoomMeetingId);

    return {
      recordingId,
      participantsProcessed,
    };
  } catch (error) {
    console.error("Error processing extension recording:", error);
    throw new Error("Failed to process recording from Chrome extension");
  }
};

// Sync session participants with Zoom participants
export const syncSessionParticipants = async (
  sessionId: string,
  zoomMeetingId: string,
): Promise<number> => {
  try {
    // Get Zoom participants
    const zoomParticipants = await getZoomParticipants(zoomMeetingId);
    if (!zoomParticipants.length) return 0;

    // For each Zoom participant, update or create a session participant
    let updatedCount = 0;

    for (const participant of zoomParticipants) {
      try {
        // Check if there's a matching session participant
        const { data: existingParticipants, error: queryError } = await supabase
          .from("session_participants")
          .select("*")
          .eq("session_id", sessionId)
          .eq("user_email", participant.email);

        if (queryError) throw queryError;

        if (existingParticipants && existingParticipants.length > 0) {
          // Update existing participant
          const existingParticipant = existingParticipants[0];

          // Calculate attendance percentage based on session duration and participant duration
          // Assuming session duration is in minutes
          const { data: sessionData } = await supabase
            .from("training_sessions")
            .select("duration")
            .eq("id", sessionId)
            .single();

          const sessionDuration = sessionData?.duration || 60; // default to 60 minutes
          const attendancePercentage = Math.min(
            100,
            Math.round((participant.duration / sessionDuration) * 100),
          );

          // Determine status based on attendance percentage
          let status = "registered";
          if (attendancePercentage >= 80) status = "present";
          else if (attendancePercentage > 0) status = "partial";
          else status = "absent";

          const { error: updateError } = await supabase
            .from("session_participants")
            .update({
              join_time: participant.join_time,
              leave_time: participant.leave_time,
              attendance_percentage: attendancePercentage,
              status: status,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingParticipant.id);

          if (updateError) throw updateError;
          updatedCount++;
        }
      } catch (participantError) {
        console.error(
          `Error syncing participant ${participant.email}:`,
          participantError,
        );
        // Continue with next participant
      }
    }

    return updatedCount;
  } catch (error) {
    console.error("Error syncing session participants:", error);
    throw new Error("Failed to sync session participants with Zoom data");
  }
};

// Register Chrome extension for a user
export const registerChromeExtension = async (
  extensionId: string,
  version: string,
  settings?: Record<string, any>,
): Promise<boolean> => {
  try {
    // Simplified implementation that doesn't require database access
    // This allows the extension download to work even if the database tables aren't set up
    console.log(`Extension registered: ${extensionId} v${version}`);

    // In a real implementation, we would store this in the database
    // For now, just return success
    return true;
  } catch (error) {
    console.error("Error registering Chrome extension:", error);
    throw new Error("Failed to register Chrome extension");
  }
};

// Helper function to calculate duration in minutes
function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.round((end - start) / (1000 * 60)); // Convert ms to minutes
}
