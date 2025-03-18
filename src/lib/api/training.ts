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
    .select("*") // Remove the join with instructors for now
    .order("date", { ascending: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

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
  }));
};
export const getTrainingSession = async (
  sessionId: string,
): Promise<TrainingSession | null> => {
  const { data, error } = await supabase
    .from("training_sessions")
    .select("*") // Remove the join with instructors
    .eq("id", sessionId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    startTime: data.start_time,
    endTime: data.end_time,
    instructorId: data.instructor_id,
    instructorName: "Unknown", // Set a default value instead of accessing the relation
    type: data.type,
    capacity: data.capacity,
    enrolled: data.enrolled,
    status: data.status,
    meetLink: data.meet_link,
  };
};

export const createTrainingSession = async (
  sessionData: Omit<TrainingSession, "id" | "enrolled" | "instructorName">,
): Promise<string> => {
  const { data, error } = await supabase
    .from("training_sessions")
    .insert([
      {
        title: sessionData.title,
        description: sessionData.description,
        date: sessionData.date,
        start_time: sessionData.startTime,
        end_time: sessionData.endTime,
        instructor_id: sessionData.instructorId,
        type: sessionData.type,
        capacity: sessionData.capacity,
        enrolled: 0,
        status: sessionData.status,
        meet_link: sessionData.meetLink,
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
  const { data, error } = await supabase
    .from("session_participants")
    .select("*, profiles(full_name, email)")
    .eq("session_id", sessionId);

  if (error) throw error;

  return data.map((participant) => ({
    id: participant.id,
    sessionId: participant.session_id,
    userId: participant.user_id,
    userName: participant.profiles?.full_name || "Unknown",
    userEmail: participant.profiles?.email || "Unknown",
    attendancePercentage: participant.attendance_percentage,
    joinTime: participant.join_time,
    leaveTime: participant.leave_time,
    status: participant.status,
    notified: participant.notified,
  }));
};

export const registerForSession = async (
  sessionId: string,
  userId: string,
): Promise<void> => {
  // First, check if already registered
  const { data: existingRegistration } = await supabase
    .from("session_participants")
    .select("id")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .single();

  if (existingRegistration) {
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

  if (registrationError) throw registrationError;

  // Update enrolled count
  const { error: updateError } = await supabase
    .from("training_sessions")
    .update({ enrolled: session.enrolled + 1 })
    .eq("id", sessionId);

  if (updateError) throw updateError;
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
