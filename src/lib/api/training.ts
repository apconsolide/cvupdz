import { supabase } from "../supabase";

export type TrainingSession = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  instructorId: string;
  instructorName: string;
  type: string;
  capacity: number;
  enrolled: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  meetLink: string | null;
  zoomMeetingId?: string | null;
};

export type SessionParticipant = {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  attendancePercentage: number | null;
  joinTime: string | null;
  leaveTime: string | null;
  status: "registered" | "present" | "partial" | "absent";
  notified: boolean;
};

export type SessionRecording = {
  id: string;
  sessionId: string;
  title: string;
  date: string;
  duration: string;
  thumbnailUrl: string;
  fileSize: string;
  views: number;
  downloadUrl: string;
};
export const getTrainingSessions = async (
  status?: string,
): Promise<TrainingSession[]> => {
  let query = supabase
    .from("training_sessions")
    .select("*")
    .order("date", { ascending: true });

  if (status) {
    console.log("Filtering by status:", status);
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase query error:", error);
    throw error;
  }

  console.log("Raw session data from DB:", data);

  if (error) throw error;

  return data.map((session) => ({
    id: session.id,
    title: session.title,
    description: session.description,
    date: session.date,
    startTime: session.start_time,
    endTime: session.end_time,
    instructorId: session.instructor_id,
    instructorName: "Unknown", // Set a default value instead of accessing the relation
    type: session.type,
    capacity: session.capacity,
    enrolled: session.enrolled,
    status: session.status,
    meetLink: session.meet_link,
    zoomMeetingId: session.zoom_meeting_id,
  }));
};
export const getTrainingSession = async (
  sessionId: string,
): Promise<
  (TrainingSession & { participants?: SessionParticipant[] }) | null
> => {
  try {
    const { data, error } = await supabase
      .from("training_sessions")
      .select("*") // Remove the join with instructors
      .eq("id", sessionId)
      .single();

    if (error) {
      console.error("Error fetching training session:", error);
      return null;
    }
    if (!data) return null;

    // Get participants for this session
    const participants = await getSessionParticipants(sessionId);

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      instructorId: data.created_by || "Unknown", // Use created_by as instructorId
      instructorName: "Unknown", // Set a default value instead of accessing the relation
      type: data.type || "webinar",
      capacity: data.capacity || 20,
      enrolled: data.enrolled || 0,
      status: data.status || "scheduled",
      meetLink: data.meet_link,
      zoomMeetingId: data.zoom_meeting_id,
      participants: participants, // Add participants to the session object
    };
  } catch (error) {
    console.error("Unexpected error in getTrainingSession:", error);
    return null;
  }
};
export const createTrainingSession = async (
  sessionData: Omit<TrainingSession, "id" | "enrolled" | "instructorName">,
  zoomMeetingId?: string,
): Promise<string> => {
  // Format the timestamps correctly
  const startTimestamp = `${sessionData.date}T${sessionData.startTime}:00`;
  const endTimestamp = `${sessionData.date}T${sessionData.endTime}:00`;

  const { data, error } = await supabase
    .from("training_sessions")
    .insert([
      {
        title: sessionData.title,
        description: sessionData.description,
        date: sessionData.date,
        start_time: startTimestamp, // Use the formatted timestamp
        end_time: endTimestamp, // Use the formatted timestamp
        created_by: sessionData.created_by,
        capacity: sessionData.capacity,
        meet_link: sessionData.meetLink,
        zoom_meeting_id: zoomMeetingId,
      },
    ])
    .select();

  if (error) throw error;
  return data[0].id;
};

export const updateTrainingSession = async (
  sessionId: string,
  updates: Partial<
    Omit<TrainingSession, "id" | "enrolled" | "instructorName" | "instructorId">
  >,
): Promise<void> => {
  const updateData: any = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined)
    updateData.description = updates.description;
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.startTime !== undefined)
    updateData.start_time = updates.startTime;
  if (updates.endTime !== undefined) updateData.end_time = updates.endTime;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.capacity !== undefined) updateData.capacity = updates.capacity;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.meetLink !== undefined) updateData.meet_link = updates.meetLink;

  const { error } = await supabase
    .from("training_sessions")
    .update(updateData)
    .eq("id", sessionId);

  if (error) throw error;
};

export const deleteTrainingSession = async (
  sessionId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("training_sessions")
    .delete()
    .eq("id", sessionId);

  if (error) throw error;
};

export const getSessionParticipants = async (
  sessionId: string,
): Promise<SessionParticipant[]> => {
  try {
    // First, get the session participants without the join
    const { data, error } = await supabase
      .from("session_participants")
      .select("*")
      .eq("session_id", sessionId);

    if (error) {
      console.error("Error fetching session participants:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // For each participant, get the user profile separately if needed
    const participantsWithProfiles = await Promise.all(
      data.map(async (participant) => {
        let userName = "Unknown";
        let userEmail = "Unknown";

        if (participant.user_id) {
          try {
            // Get user profile data - note that we're only selecting full_name as email doesn't exist
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", participant.user_id)
              .single();

            if (!profileError && profileData) {
              userName = profileData.full_name || "Unknown";
              // Since email doesn't exist in profiles table, we'll use a placeholder
              // In a real app, you might want to get this from auth.users or another table
              userEmail = `user-${participant.user_id}@example.com`;
            }
          } catch (profileErr) {
            console.error("Error fetching user profile:", profileErr);
          }
        }

        return {
          id: participant.id,
          sessionId: participant.session_id,
          userId: participant.user_id,
          userName,
          userEmail,
          attendancePercentage: participant.attendance_percentage,
          joinTime: participant.join_time,
          leaveTime: participant.leave_time,
          status: participant.status,
          notified: participant.notified,
        };
      }),
    );

    return participantsWithProfiles;
  } catch (error) {
    console.error("Unexpected error in getSessionParticipants:", error);
    return [];
  }
};

export const registerForSession = async (
  sessionId: string,
  userId?: string,
): Promise<void> => {
  // Check if userId is provided
  if (!userId) {
    console.error("User ID is undefined, cannot register for session");
    throw new Error("User ID is required to register for a session");
  }

  try {
    // First, check if already registered
    const { data: existingRegistration, error: checkError } = await supabase
      .from("session_participants")
      .select("id")
      .eq("session_id", sessionId)
      .eq("user_id", userId);

    if (checkError) {
      console.error("Error checking existing registration:", checkError);
      throw checkError;
    }

    if (existingRegistration && existingRegistration.length > 0) {
      // Already registered
      return;
    }

    // Get session to check capacity
    const session = await getTrainingSession(sessionId);
    if (!session) throw new Error("Session not found");

    if (session.enrolled >= session.capacity) {
      throw new Error("Session is at full capacity");
    }

    // Start a transaction to register and update enrolled count
    const { error: registrationError } = await supabase
      .from("session_participants")
      .insert([
        {
          session_id: sessionId,
          user_id: userId,
          status: "registered",
          notified: false,
        },
      ]);

    if (registrationError) {
      console.error("Error registering for session:", registrationError);
      throw registrationError;
    }

    // Update enrolled count
    const { error: updateError } = await supabase
      .from("training_sessions")
      .update({ enrolled: session.enrolled + 1 })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Error updating enrolled count:", updateError);
      throw updateError;
    }
  } catch (error) {
    console.error("Error in registerForSession:", error);
    throw error;
  }
};

export const cancelRegistration = async (
  sessionId: string,
  userId: string,
): Promise<void> => {
  // Get session to update enrolled count
  const session = await getTrainingSession(sessionId);
  if (!session) throw new Error("Session not found");

  // Delete registration
  const { error: deleteError } = await supabase
    .from("session_participants")
    .delete()
    .eq("session_id", sessionId)
    .eq("user_id", userId);

  if (deleteError) throw deleteError;

  // Update enrolled count
  const { error: updateError } = await supabase
    .from("training_sessions")
    .update({ enrolled: Math.max(0, session.enrolled - 1) })
    .eq("id", sessionId);

  if (updateError) throw updateError;
};

export const updateParticipantAttendance = async (
  participantId: string,
  attendanceData: {
    attendancePercentage?: number;
    joinTime?: string;
    leaveTime?: string;
    status?: "present" | "partial" | "absent";
  },
): Promise<void> => {
  const updateData: any = {};

  if (attendanceData.attendancePercentage !== undefined) {
    updateData.attendance_percentage = attendanceData.attendancePercentage;
  }
  if (attendanceData.joinTime !== undefined)
    updateData.join_time = attendanceData.joinTime;
  if (attendanceData.leaveTime !== undefined)
    updateData.leave_time = attendanceData.leaveTime;
  if (attendanceData.status !== undefined)
    updateData.status = attendanceData.status;

  const { error } = await supabase
    .from("session_participants")
    .update(updateData)
    .eq("id", participantId);

  if (error) throw error;
};

export const getSessionRecordings = async (
  sessionId?: string,
): Promise<SessionRecording[]> => {
  let query = supabase.from("session_recordings").select("*");

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map((recording) => ({
    id: recording.id,
    sessionId: recording.session_id,
    title: recording.title,
    date: recording.date,
    duration: recording.duration,
    thumbnailUrl: recording.thumbnail_url,
    fileSize: recording.file_size,
    views: recording.views,
    downloadUrl: recording.download_url,
  }));
};

export const uploadSessionRecording = async (
  sessionId: string,
  file: File,
  metadata: {
    title: string;
    duration: string;
    thumbnailUrl?: string;
  },
): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${sessionId}-${Math.random()}.${fileExt}`;
  const filePath = `session-recordings/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("training-content")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("training-content")
    .getPublicUrl(filePath);
  const downloadUrl = data.publicUrl;

  // Create recording record
  const { data: recordingData, error } = await supabase
    .from("session_recordings")
    .insert([
      {
        session_id: sessionId,
        title: metadata.title,
        date: new Date().toISOString().split("T")[0],
        duration: metadata.duration,
        thumbnail_url: metadata.thumbnailUrl || "",
        file_size: `${Math.round((file.size / 1024 / 1024) * 10) / 10} MB`,
        views: 0,
        download_url: downloadUrl,
      },
    ])
    .select();

  if (error) throw error;
  return recordingData[0].id;
};
