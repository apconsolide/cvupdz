// src/lib/api/training.ts
import { supabase } from "../supabase"; // Assuming supabase client is initialized here
import { PostgrestError } from "@supabase/supabase-js";

// --- Types ---
export type TrainingSession = {
  id: string; // UUID
  created_by: string; // UUID of the user who created it (link to profiles/users)
  title: string;
  description: string | null;
  date: string; // YYYY-MM-DD
  start_time: string; // ISO 8601 format timestamp (YYYY-MM-DDTHH:MM:SSZ or similar)
  end_time: string; // ISO 8601 format timestamp
  instructor_id?: string; // Kept for potential direct link, but created_by might be primary
  instructor_name?: string; // Fetched from profiles table
  type: string; // e.g., "webinar", "workshop"
  capacity: number;
  enrolled: number; // Should reflect count from session_participants or be updated via triggers/RPC
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  meet_link: string | null; // General meeting link (e.g., Zoom join URL)
  zoom_meeting_id?: string | null; // Zoom's numeric meeting ID (store as string)
  zoom_meeting_uuid?: string | null; // Zoom's meeting UUID
  zoom_join_url?: string | null; // Specific Zoom join URL
  zoom_password?: string | null; // Specific Zoom password
};

export type SessionParticipant = {
  id: string; // UUID of the participant record
  session_id: string; // UUID of the training session
  user_id: string; // UUID of the user (link to profiles/users)
  user_name?: string; // Fetched from profiles table
  user_email?: string; // // TODO: Fetch from auth.users or add to profiles if needed
  zoom_participant_uuid?: string | null; // Zoom's participant UUID (for linking/syncing)
  zoom_user_id?: string | null; // Zoom's user ID (if participant logged into Zoom)
  attendance_percentage: number | null;
  join_time: string | null; // ISO 8601 format timestamp
  leave_time: string | null; // ISO 8601 format timestamp
  duration_seconds?: number | null; // Duration from Zoom report
  status: "registered" | "present" | "partial" | "absent"; // Reflects attendance status
  notified: boolean; // e.g., if reminder email sent
  attentiveness_score?: number | null; // From Zoom report
};

export type SessionRecording = {
  id: string; // UUID
  session_id: string; // UUID of the training session
  zoom_meeting_id?: string | null; // Link to Zoom meeting if applicable
  title: string;
  date: string; // YYYY-MM-DD (or recording start date)
  start_time?: string | null; // ISO 8601 timestamp
  end_time?: string | null; // ISO 8601 timestamp
  duration_seconds?: number | null; // Calculated or from metadata
  thumbnail_url: string | null;
  file_size_bytes: number | null; // Store size in bytes
  views: number;
  download_url: string | null; // Public or signed URL to the recording file
  storage_path?: string | null; // Path in Supabase storage if applicable
  recording_type?: string | null; // e.g., 'zoom_cloud', 'manual_upload', 'extension_capture'
  password?: string | null; // Password for this specific recording if set
};

// --- Helper to Fetch User Profiles in Bulk ---
const fetchProfiles = async (
  userIds: string[],
): Promise<
  Map<
    string,
    { full_name: string | null /* add other fields like email if available */ }
  >
> => {
  if (userIds.length === 0) {
    return new Map();
  }
  const uniqueIds = [...new Set(userIds)]; // Ensure unique IDs
  const { data, error } = await supabase
    .from("profiles") // Assuming 'profiles' table linked to auth.users
    .select("id, full_name") // Select needed fields (add email if it exists)
    .in("id", uniqueIds);

  if (error) {
    console.error("Error fetching user profiles:", error);
    return new Map(); // Return empty map on error
  }

  const profileMap = new Map<string, { full_name: string | null }>();
  data?.forEach((profile) => {
    profileMap.set(profile.id, { full_name: profile.full_name });
  });
  return profileMap;
};

// --- Training Session Functions ---

export const getTrainingSessions = async (
  status?: TrainingSession["status"],
): Promise<TrainingSession[]> => {
  let query = supabase
    .from("training_sessions")
    .select(
      `
        *,
        profiles:created_by ( full_name )
    `,
    ) // Fetch creator's name via relationship
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (status) {
    console.log("Filtering sessions by status:", status);
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase query error fetching sessions:", error);
    throw error;
  }

  // console.log("Raw session data from DB:", data);

  // Map data and handle potential null profile
  return data.map(
    (session): TrainingSession => ({
      id: session.id,
      created_by: session.created_by,
      title: session.title,
      description: session.description,
      date: session.date,
      start_time: session.start_time,
      end_time: session.end_time,
      // Explicitly access the nested profile data
      instructor_name: session.profiles?.full_name ?? "Unknown Instructor",
      instructor_id: session.instructor_id, // Keep if separate field exists
      type: session.type ?? "webinar", // Provide default if nullable in DB
      capacity: session.capacity ?? 0,
      enrolled: session.enrolled ?? 0, // This should ideally reflect actual participants
      status: session.status ?? "scheduled",
      meet_link: session.meet_link,
      zoom_meeting_id: session.zoom_meeting_id,
      zoom_meeting_uuid: session.zoom_meeting_uuid,
      zoom_join_url: session.zoom_join_url,
      zoom_password: session.zoom_password,
    }),
  );
};

export const getTrainingSession = async (
  sessionId: string,
): Promise<TrainingSession | null> => {
  try {
    const { data: sessionData, error } = await supabase
      .from("training_sessions")
      .select(
        `
        *,
        profiles:created_by ( full_name )
      `,
      )
      .eq("id", sessionId)
      .maybeSingle(); // Use maybeSingle for potentially null result

    if (error) {
      console.error(`Error fetching training session ${sessionId}:`, error);
      throw error; // Re-throw DB errors
    }
    if (!sessionData) {
      console.log(`Training session ${sessionId} not found.`);
      return null; // Not found
    }

    // No need to fetch participants here, keep it focused
    // Participants can be fetched separately using getSessionParticipants if needed

    return {
      id: sessionData.id,
      created_by: sessionData.created_by,
      title: sessionData.title,
      description: sessionData.description,
      date: sessionData.date,
      start_time: sessionData.start_time,
      end_time: sessionData.end_time,
      instructor_name: sessionData.profiles?.full_name ?? "Unknown Instructor",
      instructor_id: sessionData.instructor_id,
      type: sessionData.type ?? "webinar",
      capacity: sessionData.capacity ?? 0,
      enrolled: sessionData.enrolled ?? 0,
      status: sessionData.status ?? "scheduled",
      meet_link: sessionData.meet_link,
      zoom_meeting_id: sessionData.zoom_meeting_id,
      zoom_meeting_uuid: sessionData.zoom_meeting_uuid,
      zoom_join_url: sessionData.zoom_join_url,
      zoom_password: sessionData.zoom_password,
    };
  } catch (error) {
    // Catch unexpected errors during processing
    console.error(
      `Unexpected error in getTrainingSession for ${sessionId}:`,
      error,
    );
    return null; // Return null on any processing error
  }
};

export const createTrainingSession = async (
  sessionData: Omit<
    TrainingSession,
    "id" | "enrolled" | "instructor_name" | "status"
  > & { created_by: string }, // Ensure created_by is passed
): Promise<TrainingSession> => {
  // Return the created session

  // Ensure start/end times are valid ISO strings if needed, or handle formatting
  // The DB should ideally handle defaults for status and enrolled

  const insertData = {
    created_by: sessionData.created_by,
    title: sessionData.title,
    description: sessionData.description,
    date: sessionData.date,
    start_time: sessionData.start_time, // Expecting ISO format
    end_time: sessionData.end_time, // Expecting ISO format
    instructor_id: sessionData.instructor_id, // Pass if available
    type: sessionData.type,
    capacity: sessionData.capacity,
    meet_link: sessionData.meet_link,
    zoom_meeting_id: sessionData.zoom_meeting_id,
    zoom_meeting_uuid: sessionData.zoom_meeting_uuid,
    zoom_join_url: sessionData.zoom_join_url,
    zoom_password: sessionData.zoom_password,
    status: "scheduled", // Set initial status
    enrolled: 0, // Set initial enrolled count
  };

  const { data, error } = await supabase
    .from("training_sessions")
    .insert(insertData)
    .select(
      `
        *,
        profiles:created_by ( full_name )
      `,
    ) // Select the newly created row with instructor name
    .single(); // Expecting a single row back

  if (error) {
    console.error("Error creating training session:", error);
    throw error;
  }
  if (!data) {
    throw new Error("Failed to create training session, no data returned.");
  }

  // Map the returned data to the TrainingSession type
  return {
    id: data.id,
    created_by: data.created_by,
    title: data.title,
    description: data.description,
    date: data.date,
    start_time: data.start_time,
    end_time: data.end_time,
    instructor_name: data.profiles?.full_name ?? "Unknown Instructor",
    instructor_id: data.instructor_id,
    type: data.type,
    capacity: data.capacity,
    enrolled: data.enrolled,
    status: data.status,
    meet_link: data.meet_link,
    zoom_meeting_id: data.zoom_meeting_id,
    zoom_meeting_uuid: data.zoom_meeting_uuid,
    zoom_join_url: data.zoom_join_url,
    zoom_password: data.zoom_password,
  };
};

export const updateTrainingSession = async (
  sessionId: string,
  updates: Partial<
    Omit<TrainingSession, "id" | "enrolled" | "instructor_name" | "created_by">
  >, // Don't allow changing creator
): Promise<TrainingSession> => {
  // Return the updated session
  const updateData: { [key: string]: any } = {};

  // Map TrainingSession fields to DB column names carefully
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined)
    updateData.description = updates.description;
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.start_time !== undefined)
    updateData.start_time = updates.start_time;
  if (updates.end_time !== undefined) updateData.end_time = updates.end_time;
  if (updates.instructor_id !== undefined)
    updateData.instructor_id = updates.instructor_id;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.capacity !== undefined) updateData.capacity = updates.capacity;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.meet_link !== undefined) updateData.meet_link = updates.meet_link;
  if (updates.zoom_meeting_id !== undefined)
    updateData.zoom_meeting_id = updates.zoom_meeting_id;
  if (updates.zoom_meeting_uuid !== undefined)
    updateData.zoom_meeting_uuid = updates.zoom_meeting_uuid;
  if (updates.zoom_join_url !== undefined)
    updateData.zoom_join_url = updates.zoom_join_url;
  if (updates.zoom_password !== undefined)
    updateData.zoom_password = updates.zoom_password;

  if (Object.keys(updateData).length === 0) {
    console.warn("updateTrainingSession called with no updates.");
    // Optionally fetch and return the current session data
    const currentSession = await getTrainingSession(sessionId);
    if (!currentSession)
      throw new Error(`Session ${sessionId} not found for update.`);
    return currentSession;
  }

  const { data, error } = await supabase
    .from("training_sessions")
    .update(updateData)
    .eq("id", sessionId)
    .select(
      `
        *,
        profiles:created_by ( full_name )
      `,
    ) // Select the updated row
    .single(); // Expect single row

  if (error) {
    console.error(`Error updating training session ${sessionId}:`, error);
    throw error;
  }
  if (!data) {
    throw new Error(`Failed to update session ${sessionId}, no data returned.`);
  }

  // Map the returned data
  return {
    id: data.id,
    created_by: data.created_by,
    title: data.title,
    description: data.description,
    date: data.date,
    start_time: data.start_time,
    end_time: data.end_time,
    instructor_name: data.profiles?.full_name ?? "Unknown Instructor",
    instructor_id: data.instructor_id,
    type: data.type,
    capacity: data.capacity,
    enrolled: data.enrolled, // Note: enrolled count not updated here
    status: data.status,
    meet_link: data.meet_link,
    zoom_meeting_id: data.zoom_meeting_id,
    zoom_meeting_uuid: data.zoom_meeting_uuid,
    zoom_join_url: data.zoom_join_url,
    zoom_password: data.zoom_password,
  };
};

export const deleteTrainingSession = async (
  sessionId: string,
): Promise<void> => {
  // Consider related data: should deleting a session also delete participants/recordings?
  // Handled by DB cascade constraints or requires manual deletion here.
  // For simplicity, assume cascade delete or manual cleanup elsewhere.

  const { error } = await supabase
    .from("training_sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    console.error(`Error deleting training session ${sessionId}:`, error);
    throw error;
  }
  console.log(`Training session ${sessionId} deleted successfully.`);
};

// --- Participant Functions ---

export const getSessionParticipants = async (
  sessionId: string,
): Promise<SessionParticipant[]> => {
  try {
    // 1. Fetch participant records for the session
    const { data: participantsData, error: participantsError } = await supabase
      .from("session_participants")
      .select("*") // Select all participant fields
      .eq("session_id", sessionId);

    if (participantsError) {
      console.error(
        `Error fetching participants for session ${sessionId}:`,
        participantsError,
      );
      throw participantsError;
    }

    if (!participantsData || participantsData.length === 0) {
      return []; // No participants found
    }

    // 2. Extract unique user IDs
    const userIds = participantsData
      .map((p) => p.user_id)
      .filter((id): id is string => id !== null && id !== undefined); // Filter out null/undefined IDs

    // 3. Fetch profiles for these users in bulk
    const profileMap = await fetchProfiles(userIds);

    // 4. Map participant data and merge with profile info
    return participantsData.map((participant): SessionParticipant => {
      const profile = participant.user_id
        ? profileMap.get(participant.user_id)
        : undefined;
      return {
        id: participant.id,
        session_id: participant.session_id,
        user_id: participant.user_id,
        user_name: profile?.full_name ?? "Unknown User", // Use fetched name
        user_email: participant.email, // Use email stored on participant record if available
        // TODO: Decide if email should be stored here or fetched from auth.users
        zoom_participant_uuid: participant.zoom_participant_uuid,
        zoom_user_id: participant.zoom_user_id,
        attendance_percentage: participant.attendance_percentage,
        join_time: participant.join_time,
        leave_time: participant.leave_time,
        duration_seconds: participant.duration_seconds,
        status: participant.status ?? "registered", // Default status if null
        notified: participant.notified ?? false,
        attentiveness_score: participant.attentiveness_score,
      };
    });
  } catch (error) {
    console.error(
      `Unexpected error in getSessionParticipants for ${sessionId}:`,
      error,
    );
    return []; // Return empty array on failure
  }
};

// ---- REGISTRATION / CANCELLATION VIA RPC ----
// These functions now call Supabase RPC functions for atomicity.

/*
-- Example SQL for the RPC functions (Run in Supabase SQL Editor)

-- Function to register a user for a session (handles capacity check & count update)
CREATE OR REPLACE FUNCTION register_for_session(p_session_id uuid, p_user_id uuid)
RETURNS TABLE (participant_id uuid, message text, success boolean)
LANGUAGE plpgsql
SECURITY DEFINER -- Important for updating tables user might not have direct access to
AS $$
DECLARE
  v_capacity int;
  v_enrolled int;
  v_new_participant_id uuid;
  v_already_registered boolean;
BEGIN
  -- Check if already registered
  SELECT EXISTS (
    SELECT 1 FROM session_participants sp
    WHERE sp.session_id = p_session_id AND sp.user_id = p_user_id
  ) INTO v_already_registered;

  IF v_already_registered THEN
    RETURN QUERY SELECT null::uuid, 'User already registered for this session.'::text, false::boolean;
    RETURN;
  END IF;

  -- Lock the session row to prevent race conditions on capacity check
  SELECT capacity, enrolled INTO v_capacity, v_enrolled
  FROM training_sessions
  WHERE id = p_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT null::uuid, 'Session not found.'::text, false::boolean;
    RETURN;
  END IF;

  -- Check capacity
  IF v_enrolled >= v_capacity THEN
    RETURN QUERY SELECT null::uuid, 'Session is full.'::text, false::boolean;
    RETURN;
  END IF;

  -- Insert the participant record
  INSERT INTO session_participants (session_id, user_id, status, notified)
  VALUES (p_session_id, p_user_id, 'registered', false)
  RETURNING id INTO v_new_participant_id;

  -- Increment the enrolled count
  UPDATE training_sessions
  SET enrolled = enrolled + 1
  WHERE id = p_session_id;

  -- Return success
  RETURN QUERY SELECT v_new_participant_id, 'Successfully registered.'::text, true::boolean;

EXCEPTION
  WHEN OTHERS THEN
    -- Log the error internally if possible
    RETURN QUERY SELECT null::uuid, 'An unexpected error occurred during registration.'::text, false::boolean;
END;
$$;

-- Function to cancel a user's registration for a session (handles count update)
CREATE OR REPLACE FUNCTION cancel_session_registration(p_session_id uuid, p_user_id uuid)
RETURNS TABLE (message text, success boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_participant_exists boolean;
BEGIN
  -- Check if registration exists
  SELECT EXISTS (
    SELECT 1 FROM session_participants sp
    WHERE sp.session_id = p_session_id AND sp.user_id = p_user_id
  ) INTO v_participant_exists;

  IF NOT v_participant_exists THEN
    RETURN QUERY SELECT 'User is not registered for this session.'::text, false::boolean;
    RETURN;
  END IF;

  -- Lock the session row for count update
  -- (Optional, less critical than on registration unless high contention)
  -- SELECT 1 FROM training_sessions WHERE id = p_session_id FOR UPDATE;

  -- Delete the participant record
  DELETE FROM session_participants
  WHERE session_id = p_session_id AND user_id = p_user_id;

  -- Decrement the enrolled count (ensure it doesn't go below zero)
  UPDATE training_sessions
  SET enrolled = GREATEST(0, enrolled - 1)
  WHERE id = p_session_id;

  -- Return success
  RETURN QUERY SELECT 'Registration successfully cancelled.'::text, true::boolean;

EXCEPTION
  WHEN OTHERS THEN
    -- Log the error
    RETURN QUERY SELECT 'An unexpected error occurred during cancellation.'::text, false::boolean;
END;
$$;

*/

export const registerForSession = async (
  sessionId: string,
  userId: string,
): Promise<{ success: boolean; message: string; participantId?: string }> => {
  if (!userId) {
    return { success: false, message: "User ID is required." };
  }
  if (!sessionId) {
    return { success: false, message: "Session ID is required." };
  }

  console.log(
    `Attempting registration via RPC for user ${userId} to session ${sessionId}`,
  );
  try {
    // Call the Supabase RPC function
    const { data, error } = await supabase.rpc("register_for_session", {
      p_session_id: sessionId,
      p_user_id: userId,
    });

    if (error) {
      console.error("Error calling register_for_session RPC:", error);
      throw error; // Let the caller handle DB/RPC errors
    }

    // Assuming the RPC returns an array with one object like: [{ success: boolean, message: string, participant_id: uuid | null }]
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("Invalid response from register_for_session RPC:", data);
      throw new Error("Invalid response from registration function.");
    }

    const result = data[0];
    console.log("RPC register_for_session result:", result);

    return {
      success: result.success,
      message: result.message,
      participantId: result.participant_id, // Pass back the new participant ID if created
    };
  } catch (error) {
    console.error("Error in registerForSession:", error);
    // Return a generic error message if specific one not available
    const message =
      error instanceof Error
        ? error.message
        : "Registration failed due to an unexpected error.";
    return { success: false, message };
  }
};

export const cancelRegistration = async (
  sessionId: string,
  userId: string,
): Promise<{ success: boolean; message: string }> => {
  if (!userId) {
    return { success: false, message: "User ID is required." };
  }
  if (!sessionId) {
    return { success: false, message: "Session ID is required." };
  }

  console.log(
    `Attempting cancellation via RPC for user ${userId} from session ${sessionId}`,
  );
  try {
    // Call the Supabase RPC function
    const { data, error } = await supabase.rpc("cancel_session_registration", {
      p_session_id: sessionId,
      p_user_id: userId,
    });

    if (error) {
      console.error("Error calling cancel_session_registration RPC:", error);
      throw error;
    }

    // Assuming RPC returns: [{ success: boolean, message: string }]
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error(
        "Invalid response from cancel_session_registration RPC:",
        data,
      );
      throw new Error("Invalid response from cancellation function.");
    }

    const result = data[0];
    console.log("RPC cancel_session_registration result:", result);

    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    console.error("Error in cancelRegistration:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Cancellation failed due to an unexpected error.";
    return { success: false, message };
  }
};

// ---- END RPC BASED REGISTRATION ----

// Update participant details (e.g., status after syncing)
export const updateParticipantDetails = async (
  participantId: string, // The UUID of the session_participants record
  updates: Partial<
    Pick<
      SessionParticipant,
      | "attendance_percentage"
      | "join_time"
      | "leave_time"
      | "status"
      | "notified"
      | "duration_seconds"
      | "attentiveness_score"
    >
  >,
): Promise<SessionParticipant> => {
  // Return updated participant
  const updateData: { [key: string]: any } = {};

  if (updates.attendance_percentage !== undefined)
    updateData.attendance_percentage = updates.attendance_percentage;
  if (updates.join_time !== undefined) updateData.join_time = updates.join_time;
  if (updates.leave_time !== undefined)
    updateData.leave_time = updates.leave_time;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.notified !== undefined) updateData.notified = updates.notified;
  if (updates.duration_seconds !== undefined)
    updateData.duration_seconds = updates.duration_seconds;
  if (updates.attentiveness_score !== undefined)
    updateData.attentiveness_score = updates.attentiveness_score;

  if (Object.keys(updateData).length === 0) {
    throw new Error("No updates provided for participant.");
  }

  const { data, error } = await supabase
    .from("session_participants")
    .update(updateData)
    .eq("id", participantId)
    .select() // Select updated row
    .single();

  if (error) {
    console.error(`Error updating participant ${participantId}:`, error);
    throw error;
  }
  if (!data) {
    throw new Error(`Participant ${participantId} not found or update failed.`);
  }

  // TODO: Fetch profile data again if user_name/email is needed in the return type consistently
  return data as SessionParticipant; // Cast for now, mapping might be needed
};

// --- Recording Functions ---

export const getSessionRecordings = async (
  sessionId?: string,
): Promise<SessionRecording[]> => {
  let query = supabase.from("session_recordings").select("*");

  if (sessionId) {
    query = query.eq("session_id", sessionId);
  }
  query = query.order("start_time", { ascending: false }); // Order by recording time

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching session recordings:", error);
    throw error;
  }

  return data.map(
    (recording): SessionRecording => ({
      id: recording.id,
      session_id: recording.session_id,
      zoom_meeting_id: recording.zoom_meeting_id,
      title: recording.title,
      date:
        recording.date || recording.start_time?.split("T")[0] || "Unknown Date", // Fallback for date
      start_time: recording.start_time,
      end_time: recording.end_time,
      duration_seconds: recording.duration_seconds,
      thumbnail_url: recording.thumbnail_url,
      file_size_bytes: recording.file_size_bytes, // Use byte value
      views: recording.views ?? 0,
      download_url: recording.download_url,
      storage_path: recording.storage_path,
      recording_type: recording.recording_type,
      password: recording.password,
    }),
  );
};

// Example: Uploading a manually recorded file
export const uploadSessionRecording = async (
  sessionId: string,
  file: File,
  metadata: {
    title: string;
    duration_seconds?: number; // Duration in seconds
    start_time?: string; // ISO format
    end_time?: string; // ISO format
    thumbnail_url?: string;
    recording_type?: string; // e.g., 'manual_upload'
  },
  storageBucket = "session-recordings", // Specify your bucket name
): Promise<SessionRecording> => {
  const fileExt = file.name.split(".").pop();
  // Use a more robust naming convention, perhaps including session ID and timestamp
  const uniqueId = crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);
  const fileName = `${sessionId}/${uniqueId}.${fileExt}`;
  const filePath = `${fileName}`; // Path within the bucket

  console.log(
    `Uploading recording to bucket '${storageBucket}' at path '${filePath}'`,
  );

  // 1. Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(storageBucket)
    .upload(filePath, file, {
      // Set cache control and content type for better delivery
      // cacheControl: '3600', // Example: cache for 1 hour
      // contentType: file.type // Use the file's MIME type
    });

  if (uploadError) {
    console.error("Error uploading recording file:", uploadError);
    throw uploadError;
  }
  console.log("File uploaded successfully.");

  // 2. Get public URL (or signed URL if bucket is private)
  const { data: urlData } = supabase.storage
    .from(storageBucket)
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    console.warn(
      `Could not get public URL for ${filePath}. Check bucket permissions.`,
    );
    // Handle scenario where URL is not available (e.g., throw error or proceed without URL)
  }
  const downloadUrl = urlData?.publicUrl ?? null; // Store null if not available
  console.log(`Public URL obtained: ${downloadUrl}`);

  // 3. Create recording record in the database
  const recordingRecord = {
    session_id: sessionId,
    title: metadata.title,
    date:
      metadata.start_time?.split("T")[0] ??
      new Date().toISOString().split("T")[0], // Use start time date or current date
    start_time: metadata.start_time,
    end_time: metadata.end_time,
    duration_seconds: metadata.duration_seconds,
    thumbnail_url: metadata.thumbnail_url || null,
    file_size_bytes: file.size, // Store size in bytes
    views: 0,
    download_url: downloadUrl,
    storage_path: filePath, // Store the path within the bucket
    recording_type: metadata.recording_type || "manual_upload",
  };

  const { data: dbData, error: dbError } = await supabase
    .from("session_recordings")
    .insert(recordingRecord)
    .select()
    .single();

  if (dbError) {
    console.error("Error inserting recording record:", dbError);
    // Consider deleting the uploaded file if DB insert fails (cleanup)
    try {
      await supabase.storage.from(storageBucket).remove([filePath]);
      console.log(`Cleaned up uploaded file ${filePath} after DB error.`);
    } catch (cleanupError) {
      console.error(`Failed to cleanup file ${filePath}:`, cleanupError);
    }
    throw dbError;
  }
  if (!dbData) {
    throw new Error("Failed to insert recording record, no data returned.");
  }

  console.log(`Recording record created with ID: ${dbData.id}`);

  // Map the returned DB data to the SessionRecording type
  return {
    id: dbData.id,
    session_id: dbData.session_id,
    zoom_meeting_id: dbData.zoom_meeting_id, // Will be null here usually
    title: dbData.title,
    date: dbData.date,
    start_time: dbData.start_time,
    end_time: dbData.end_time,
    duration_seconds: dbData.duration_seconds,
    thumbnail_url: dbData.thumbnail_url,
    file_size_bytes: dbData.file_size_bytes,
    views: dbData.views,
    download_url: dbData.download_url,
    storage_path: dbData.storage_path,
    recording_type: dbData.recording_type,
    password: dbData.password,
  };
};

export const deleteSessionRecording = async (
  recordingId: string,
  storageBucket = "session-recordings",
): Promise<void> => {
  // 1. Get recording details to find the storage path
  const { data: recording, error: fetchError } = await supabase
    .from("session_recordings")
    .select("storage_path")
    .eq("id", recordingId)
    .single();

  if (fetchError) {
    console.error(
      `Error fetching recording ${recordingId} for deletion:`,
      fetchError,
    );
    throw fetchError;
  }
  if (!recording) {
    console.warn(`Recording ${recordingId} not found in database.`);
    return; // Or throw error depending on desired behavior
  }

  // 2. Delete the file from storage (if path exists)
  if (recording.storage_path) {
    console.log(
      `Attempting to delete file from storage: ${recording.storage_path}`,
    );
    const { error: storageError } = await supabase.storage
      .from(storageBucket)
      .remove([recording.storage_path]);

    if (storageError) {
      console.error(
        `Error deleting file ${recording.storage_path} from storage:`,
        storageError,
      );
      // Decide whether to proceed with DB deletion or stop
      // For now, log warning and continue to delete DB record
      console.warn(
        "Proceeding with database record deletion despite storage error.",
      );
    } else {
      console.log(`File ${recording.storage_path} deleted from storage.`);
    }
  } else {
    console.log(
      `No storage path found for recording ${recordingId}, skipping storage deletion.`,
    );
  }

  // 3. Delete the record from the database
  const { error: dbError } = await supabase
    .from("session_recordings")
    .delete()
    .eq("id", recordingId);

  if (dbError) {
    console.error(
      `Error deleting recording record ${recordingId} from database:`,
      dbError,
    );
    throw dbError;
  }

  console.log(`Recording ${recordingId} deleted successfully.`);
};
