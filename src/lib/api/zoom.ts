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
};

// Create a Zoom meeting
export const createZoomMeeting = async (
  topic: string,
  startTime: string,
  duration: number,
  agenda?: string,
): Promise<ZoomMeeting> => {
  try {
    // In a real implementation, this would call the Zoom API
    // For now, we'll simulate a response
    const meetingId = `zoom-${Math.random().toString(36).substring(2, 11)}`;

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
          join_url: `https://zoom.us/j/${meetingId}`,
          password: Math.random().toString(36).substring(2, 8),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return {
      id: meetingId,
      topic,
      start_time: startTime,
      duration,
      join_url: `https://zoom.us/j/${meetingId}`,
      password: Math.random().toString(36).substring(2, 8),
    };
  } catch (error) {
    console.error("Error creating Zoom meeting:", error);
    throw new Error("Failed to create Zoom meeting");
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

    if (error) throw error;
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
    throw new Error("Failed to get Zoom meeting details");
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

// Helper function to calculate duration in minutes
function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.round((end - start) / (1000 * 60)); // Convert ms to minutes
}
