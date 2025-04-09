// src/lib/zoom-api-client.ts
import { createClient } from "@supabase/supabase-js";

// Types for Zoom API responses and requests
export type ZoomMeeting = {
  uuid?: string;
  id: string;
  topic: string;
  type?: number;
  start_time: string;
  duration: number;
  timezone?: string;
  agenda?: string;
  created_at?: string;
  join_url: string;
  password: string;
  settings?: {
    host_video?: boolean;
    participant_video?: boolean;
    join_before_host?: boolean;
    mute_upon_entry?: boolean;
    waiting_room?: boolean;
    breakout_room?: boolean;
    recording?: string;
  };
  status?: string;
};

export type ZoomParticipant = {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  join_time: string;
  leave_time: string;
  duration: number;
  status?: string;
  attentiveness_score?: number;
};

export type ZoomRecording = {
  id: string;
  uuid?: string;
  meeting_id: string;
  recording_start: string;
  recording_end: string;
  file_type: string;
  file_size: number;
  play_url: string;
  download_url: string;
  status?: string;
  recording_type?: string;
  title?: string;
  password?: string;
  share_url?: string;
  thumbnail_url?: string;
};

// Client to interact with the Supabase Edge Function
export class ZoomApiClient {
  private supabase;
  private functionName = "zoom-api";

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Helper method to call the edge function
  private async callEdgeFunction(action: string, params: any) {
    const { data, error } = await this.supabase.functions.invoke(
      this.functionName,
      {
        body: { action, params },
      },
    );

    if (error) {
      console.error(`Error calling ${action}:`, error);
      throw new Error(error.message || "Error calling Zoom API");
    }

    return data;
  }

  // Create a Zoom meeting
  async createMeeting(
    topic: string,
    startTime: string,
    duration: number,
    agenda?: string,
    createdBy?: string,
    settings?: {
      host_video?: boolean;
      participant_video?: boolean;
      join_before_host?: boolean;
      mute_upon_entry?: boolean;
      waiting_room?: boolean;
      breakout_room?: boolean;
      recording?: string;
    },
  ): Promise<ZoomMeeting> {
    return this.callEdgeFunction("createMeeting", {
      topic,
      startTime,
      duration,
      agenda,
      createdBy,
      settings,
    });
  }

  // Get a Zoom meeting by ID
  async getMeeting(meetingId: string): Promise<ZoomMeeting | null> {
    return this.callEdgeFunction("getMeeting", { meetingId });
  }

  // Get meeting participants
  async getParticipants(
    meetingId: string,
    includeAttentiveness: boolean = false,
  ): Promise<ZoomParticipant[]> {
    return this.callEdgeFunction("getParticipants", {
      meetingId,
      includeAttentiveness,
    });
  }

  // Get meeting recordings
  async getRecordings(meetingId: string): Promise<ZoomRecording[]> {
    return this.callEdgeFunction("getRecordings", { meetingId });
  }

  // Get meeting registrants
  async getRegistrants(meetingId: string): Promise<
    Array<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      status: string;
      create_time: string;
      join_url?: string;
    }>
  > {
    return this.callEdgeFunction("getRegistrants", { meetingId });
  }

  // Add a registrant to a meeting
  async addRegistrant(
    meetingId: string,
    registrantData: {
      email: string;
      first_name: string;
      last_name: string;
      status?: string;
    },
  ): Promise<{ id: string; join_url: string }> {
    return this.callEdgeFunction("addRegistrant", {
      meetingId,
      registrantData,
    });
  }

  // Update meeting status
  async updateMeetingStatus(
    meetingId: string,
    status: "waiting" | "started" | "finished" | "cancelled",
  ): Promise<boolean> {
    return this.callEdgeFunction("updateMeetingStatus", {
      meetingId,
      status,
    });
  }

  // Track participant attendance
  async trackAttendance(
    meetingId: string,
    participantData: {
      name: string;
      email: string;
      join_time: string;
      leave_time?: string;
      user_id?: string;
      attentiveness_score?: number;
    },
  ): Promise<string> {
    return this.callEdgeFunction("trackAttendance", {
      meetingId,
      participantData,
    });
  }

  // Sync session participants with Zoom participants
  async syncParticipants(
    sessionId: string,
    zoomMeetingId: string,
  ): Promise<number> {
    return this.callEdgeFunction("syncParticipants", {
      sessionId,
      zoomMeetingId,
    });
  }

  // Process recording from extension
  async processRecording(
    sessionId: string,
    zoomMeetingId: string,
    recordingData: {
      recording_start: string;
      recording_end: string;
      file_type: string;
      file_size: number;
      play_url: string;
      download_url: string;
      title?: string;
      password?: string;
      share_url?: string;
      thumbnail_url?: string;
    },
  ): Promise<ZoomRecording> {
    return this.callEdgeFunction("processRecording", {
      sessionId,
      zoomMeetingId,
      recordingData,
    });
  }

  // Delete a Zoom meeting
  async deleteMeeting(meetingId: string): Promise<boolean> {
    return this.callEdgeFunction("deleteMeeting", { meetingId });
  }

  // Update meeting details
  async updateMeeting(
    meetingId: string,
    updateData: {
      topic?: string;
      startTime?: string;
      duration?: number;
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
  ): Promise<ZoomMeeting> {
    return this.callEdgeFunction("updateMeeting", {
      meetingId,
      updateData,
    });
  }

  // Generate a Zoom report for a specific meeting
  async generateMeetingReport(meetingId: string): Promise<{
    meeting_details: ZoomMeeting;
    participants: ZoomParticipant[];
    total_participants: number;
    average_duration: number;
    recordings: ZoomRecording[];
  }> {
    return this.callEdgeFunction("generateMeetingReport", { meetingId });
  }

  // End an active Zoom meeting
  async endMeeting(meetingId: string): Promise<boolean> {
    return this.callEdgeFunction("endMeeting", { meetingId });
  }

  // Get a list of all upcoming meetings
  async getUpcomingMeetings(userId?: string): Promise<ZoomMeeting[]> {
    return this.callEdgeFunction("getUpcomingMeetings", { userId });
  }

  // List past meetings
  async getPastMeetings(
    userId?: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<ZoomMeeting[]> {
    return this.callEdgeFunction("getPastMeetings", {
      userId,
      fromDate,
      toDate,
    });
  }
}
