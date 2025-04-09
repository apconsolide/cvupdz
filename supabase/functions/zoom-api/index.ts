// supabase/functions/zoom-api/index.ts
import { serve } from "https://deno.land/std@0.218.2/http/server.ts"; // Updated
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.39.7"; // Updated
import * as base64 from "https://deno.land/std@0.218.2/encoding/base64.ts"; // Updated
import * as djwt from "https://deno.land/x/djwt@v3.0.1/mod.ts"; // Added for correct JWT

// --- Types (Consider sharing these via a common package) ---
type ZoomMeeting = {
  uuid?: string;
  id: string; // Numeric ID as string
  host_id?: string;
  topic: string;
  type?: number;
  status?: string;
  start_time: string; // ISO 8601 format
  duration: number; // In minutes
  timezone?: string;
  agenda?: string;
  created_at?: string; // ISO 8601 format
  join_url: string;
  password?: string; // Optional, depends on settings
  h323_password?: string;
  pstn_password?: string;
  encrypted_password?: string;
  settings?: {
    host_video?: boolean;
    participant_video?: boolean;
    cn_meeting?: boolean;
    in_meeting?: boolean;
    join_before_host?: boolean;
    jbh_time?: number;
    mute_upon_entry?: boolean;
    watermark?: boolean;
    use_pmi?: boolean;
    approval_type?: number;
    registration_type?: number;
    audio?: string; // 'both', 'telephony', 'voip'
    auto_recording?: string; // 'local', 'cloud', 'none'
    alternative_hosts?: string; // comma separated emails
    global_dial_in_countries?: string[];
    registrants_email_notification?: boolean;
    waiting_room?: boolean;
    // ... other settings
    breakout_room?: { enable: boolean }; // Example nested setting
    recording?: {
      // More detailed recording settings if needed
      cloud_recording: boolean;
      local_recording: boolean;
      record_speaker_view: boolean;
      // ... other recording settings
    };
  };
  pre_schedule?: boolean;
};

type ZoomParticipant = {
  id: string; // Participant UUID
  user_id?: string; // Zoom User ID (if logged in)
  name: string; // Display name
  user_email?: string; // Email (might be obfuscated)
  join_time: string; // ISO 8601 format
  leave_time: string; // ISO 8601 format
  duration: number; // In seconds
  attentiveness_score?: number; // Percentage as string or number? Check API docs
  failover?: boolean;
  customer_key?: string; // Custom identifier if set
  status?: string; // e.g., 'in_meeting', 'in_waiting_room'
};

type ZoomRecordingFile = {
  id: string;
  meeting_id?: string; // Sometimes included, matches meeting UUID
  recording_start: string; // ISO 8601 format
  recording_end: string; // ISO 8601 format
  file_type: string; // e.g., 'MP4', 'M4A', 'TRANSCRIPT', 'CHAT'
  file_extension?: string;
  file_size: number; // In bytes
  play_url?: string; // URL to play in browser (may require auth/token)
  download_url: string; // URL to download file (may require auth/token)
  status?: string; // e.g., 'completed'
  deleted_time?: string;
  recording_type?: string; // e.g., 'shared_screen_with_speaker_view'
};

type ZoomRecordingSettings = {
  share_recording?: string; // 'publicly', 'internally', 'none'
  recording_authentication?: boolean;
  authentication_option?: string;
  viewer_can_download?: boolean;
  password?: string; // Password to view/access recording
  approval_type?: string; // 'automatic', 'manual', 'no_registration'
  send_email_to_host?: boolean;
  show_social_share_buttons?: boolean;
};

type ZoomCompleteRecording = {
  uuid?: string; // Meeting UUID
  id: string | number; // Meeting ID
  account_id?: string;
  host_id?: string;
  topic?: string;
  start_time?: string;
  timezone?: string;
  duration?: number; // Meeting duration (minutes)
  total_size?: number; // Total size of all files (bytes)
  recording_count?: number; // Number of recording files
  share_url?: string; // Base share URL for the recording set
  password?: string; // Access password for the recording set
  recording_files?: ZoomRecordingFile[];
  recording_settings?: ZoomRecordingSettings;
  // Note: Some fields like password might be at the top level or in recording_settings
};

type ZoomRegistrant = {
  id: string; // Registrant ID
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
  state?: string;
  phone?: string;
  industry?: string;
  org?: string;
  job_title?: string;
  purchasing_time_frame?: string;
  role_in_purchase_process?: string;
  no_of_employees?: string;
  comments?: string;
  custom_questions?: Array<{ title: string; value: string }>;
  status: "approved" | "pending" | "denied";
  create_time: string; // ISO 8601 format
  join_url?: string; // Personalized join link
};

// --- API Configuration & Caching ---
const ZOOM_API_BASE_URL = "https://api.zoom.us/v2";
let zoomAccessToken: string | null = null;
let tokenExpiresAt: number = 0; // Store expiry time in milliseconds

// --- Supabase Client Initialization ---
// Ensure these are set in your Function's Environment Variables
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Supabase URL or Service Role Key environment variable is missing.",
  );
  // Optionally throw an error or handle gracefully
}

// Create a single Supabase client instance
const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

// --- Zoom Authentication ---
const getZoomToken = async (): Promise<string> => {
  // Check if the current token is valid (with a 5-minute buffer)
  if (zoomAccessToken && tokenExpiresAt > Date.now() + 5 * 60 * 1000) {
    return zoomAccessToken;
  }
  console.log("No valid token found or expired, fetching new one...");

  const ZOOM_CLIENT_ID = Deno.env.get("ZOOM_CLIENT_ID");
  const ZOOM_CLIENT_SECRET = Deno.env.get("ZOOM_CLIENT_SECRET");
  const ZOOM_ACCOUNT_ID = Deno.env.get("ZOOM_ACCOUNT_ID"); // Needed for Server-to-Server OAuth

  // --- Preferred Method: Server-to-Server OAuth ---
  if (ZOOM_CLIENT_ID && ZOOM_CLIENT_SECRET && ZOOM_ACCOUNT_ID) {
    try {
      console.log("Attempting Server-to-Server OAuth authentication...");
      const credentials = base64.encode(
        `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`,
      );
      const response = await fetch("https://zoom.us/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        // Note: Ensure your Zoom Server-to-Server OAuth app has the necessary scopes (e.g., meeting:read, meeting:write:admin, etc.)
        body: new URLSearchParams({
          grant_type: "account_credentials",
          account_id: ZOOM_ACCOUNT_ID,
          // Optionally add specific scopes if needed, otherwise uses app's configured scopes
          // scope: "meeting:write:admin meeting:read:admin user:read:admin recording:read:admin",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Zoom S2S OAuth Error ${response.status}: ${errorText}`,
        );
      }

      const data = await response.json();
      if (!data.access_token || !data.expires_in) {
        throw new Error(
          "Zoom S2S OAuth response missing access_token or expires_in",
        );
      }

      zoomAccessToken = data.access_token;
      // expires_in is in seconds, convert to milliseconds timestamp
      tokenExpiresAt = Date.now() + data.expires_in * 1000;
      console.log("Successfully obtained Server-to-Server OAuth token.");
      return zoomAccessToken;
    } catch (error) {
      console.error("Error getting Zoom Server-to-Server OAuth token:", error);
      // Don't throw yet, maybe fallback to JWT if configured
    }
  }

  // --- Fallback or Alternative: JWT (Deprecated for new apps) ---
  const ZOOM_API_KEY = Deno.env.get("ZOOM_API_KEY");
  const ZOOM_API_SECRET = Deno.env.get("ZOOM_API_SECRET");

  if (ZOOM_API_KEY && ZOOM_API_SECRET) {
    console.warn(
      "Using deprecated JWT authentication. Consider migrating to Server-to-Server OAuth.",
    );
    try {
      const now = Math.floor(Date.now() / 1000);
      const expiration = now + 60 * 55; // 55 minutes expiry
      const payload = { iss: ZOOM_API_KEY, exp: expiration };
      const header: djwt.Header = { alg: "HS256", typ: "JWT" };
      const key = new TextEncoder().encode(ZOOM_API_SECRET);

      // Correctly create and sign the JWT
      const signedToken = await djwt.create(header, payload, key);

      zoomAccessToken = signedToken;
      tokenExpiresAt = expiration * 1000;
      console.log("Successfully obtained JWT token.");
      return zoomAccessToken;
    } catch (error) {
      console.error("Error generating Zoom JWT:", error);
      // Continue to throw the final error if no method succeeds
    }
  }

  // --- If neither method worked ---
  console.error(
    "Zoom API credentials (Server-to-Server OAuth or JWT) are not configured correctly or failed.",
  );
  throw new Error(
    "Failed to authenticate with Zoom API: Credentials missing or invalid.",
  );
};

// --- Helper for Authenticated Zoom API Requests ---
const zoomApiRequest = async (
  method: string,
  endpoint: string,
  queryParams?: URLSearchParams,
  body?: any,
) => {
  try {
    const token = await getZoomToken();
    const ZOOM_API_BASE =
      Deno.env.get("ZOOM_API_BASE_URL") || ZOOM_API_BASE_URL;

    let url = `${ZOOM_API_BASE}${endpoint}`;
    if (queryParams) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle rate limiting specifically
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      console.warn(
        `Zoom API rate limit hit. Retry after: ${retryAfter || "N/A"} seconds.`,
      );
      // Implement retry logic here if needed, e.g., using exponential backoff
      throw new Error(
        `Zoom API rate limit exceeded. Status: 429. Retry after: ${retryAfter}`,
      );
    }

    if (!response.ok) {
      let errorData;
      try {
        // Check content type before parsing as JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData = await response.text(); // Read as text if not JSON
        }
      } catch (parseError) {
        console.error("Failed to parse Zoom error response body:", parseError);
        errorData = await response.text(); // Fallback to raw text
      }
      console.error(
        `Zoom API Error: ${response.status} ${response.statusText} on ${method} ${url}`,
        errorData,
      );
      throw new Error(
        `Zoom API Error ${response.status}: ${JSON.stringify(errorData)}`,
      );
    }

    // Handle responses with no content (e.g., 204 No Content for DELETE)
    if (response.status === 204) {
      return null; // Or return true/success indicator
    }

    // Only parse JSON if there's content
    if (response.headers.get("content-type")?.includes("application/json")) {
      return await response.json();
    } else {
      // Optionally return text or handle other content types
      return await response.text();
    }
  } catch (error) {
    // Log the originally thrown error
    console.error("Error during Zoom API request:", error.message);
    // Re-throw the original error to propagate it
    throw error;
  }
};

// --- Zoom API Action Functions ---

// Create a Zoom meeting (for a specific user if using S2S OAuth)
const createZoomMeeting = async (
  userId: string = "me", // Use 'me' for user-level context, or specific email/ID for S2S OAuth admin actions
  topic: string,
  startTime: string, // ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ or YYYY-MM-DDTHH:MM:SS)
  duration: number, // In minutes
  timezone?: string, // e.g., "America/Los_Angeles"
  agenda?: string,
  settings?: Partial<ZoomMeeting["settings"]>,
): Promise<ZoomMeeting> => {
  const requestBody = {
    topic,
    type: 2, // Scheduled meeting
    start_time: startTime,
    duration,
    timezone: timezone || "UTC", // Default to UTC if not provided
    agenda: agenda || "",
    settings: {
      // Sensible defaults, overridden by provided settings
      host_video: false,
      participant_video: false,
      join_before_host: false,
      mute_upon_entry: true,
      waiting_room: true,
      audio: "both",
      auto_recording: "none", // Default to no auto recording
      approval_type: 2, // 0 = auto, 1 = manual, 2 = no registration required (default)
      ...settings, // Merge provided settings
    },
  };
  // Use /users/{userId}/meetings endpoint
  return (await zoomApiRequest(
    "POST",
    `/users/${userId}/meetings`,
    undefined,
    requestBody,
  )) as ZoomMeeting;
};

// Get Zoom meeting details
const getZoomMeeting = async (
  meetingId: string,
): Promise<ZoomMeeting | null> => {
  try {
    // Numeric meeting IDs usually need double encoding for UUID lookup
    const encodedMeetingId = encodeURIComponent(encodeURIComponent(meetingId));
    // The API endpoint might differ based on whether it's a live or past meeting,
    // or if you have the UUID vs the numeric ID. `/meetings/{meetingId}` is common.
    // Use occurrences=true to get all instances of a recurring meeting if needed.
    const response = await zoomApiRequest("GET", `/meetings/${meetingId}`);
    return response as ZoomMeeting;
  } catch (error) {
    if (
      error.message &&
      (error.message.includes("404") ||
        error.message.includes("Meeting does not exist"))
    ) {
      console.log(`Meeting ${meetingId} not found.`);
      return null;
    }
    console.error(`Error getting Zoom meeting ${meetingId}:`, error);
    throw new Error(
      `Failed to get Zoom meeting details for ${meetingId}: ${error.message}`,
    );
  }
};

// Delete a Zoom meeting
const deleteZoomMeeting = async (
  meetingId: string,
  occurrenceId?: string,
): Promise<boolean> => {
  try {
    const params = new URLSearchParams();
    if (occurrenceId) {
      params.append("occurrence_id", occurrenceId);
    }
    // params.append('schedule_for_reminder', 'true'); // Optional: notify host/participants
    await zoomApiRequest("DELETE", `/meetings/${meetingId}`, params);
    return true; // 204 No Content on success
  } catch (error) {
    console.error(`Error deleting Zoom meeting ${meetingId}:`, error);
    // Don't throw, return false for failure indication
    return false;
  }
};

// Update a Zoom meeting
const updateZoomMeeting = async (
  meetingId: string,
  updateData: Partial<
    Pick<
      ZoomMeeting,
      "topic" | "agenda" | "start_time" | "duration" | "timezone" | "settings"
    >
  >,
  occurrenceId?: string,
): Promise<boolean> => {
  try {
    const params = new URLSearchParams();
    if (occurrenceId) {
      params.append("occurrence_id", occurrenceId);
    }
    // Use PATCH for partial updates
    await zoomApiRequest("PATCH", `/meetings/${meetingId}`, params, updateData);
    return true; // 204 No Content on success
  } catch (error) {
    console.error(`Error updating Zoom meeting ${meetingId}:`, error);
    return false;
  }
};

// Helper function to handle pagination for Zoom list endpoints
const fetchAllPages = async (
  endpoint: string,
  initialParams?: URLSearchParams,
): Promise<any[]> => {
  let results: any[] = [];
  let params = initialParams
    ? new URLSearchParams(initialParams)
    : new URLSearchParams();
  params.set("page_size", "300"); // Max page size
  let nextPageToken: string | null = null;

  do {
    if (nextPageToken) {
      params.set("next_page_token", nextPageToken);
    }

    const response = await zoomApiRequest("GET", endpoint, params);

    // Find the array key (e.g., 'participants', 'meetings', 'registrants', 'recording_files')
    const dataKey = Object.keys(response).find((key) =>
      Array.isArray(response[key]),
    );

    if (dataKey && response[dataKey]) {
      results = results.concat(response[dataKey]);
    } else if (Array.isArray(response)) {
      // Sometimes the response root is the array
      results = results.concat(response);
    }
    // else {
    //     console.warn(`No array found in response for ${endpoint} with params ${params.toString()}`);
    // }

    nextPageToken = response.next_page_token || null;
  } while (nextPageToken);

  return results;
};

// Get meeting participants (uses reports endpoint, requires Pro+ plan, available after meeting ends)
const getZoomParticipants = async (
  meetingId: string, // Can be meeting ID or UUID (UUID often needs double encoding)
): Promise<ZoomParticipant[]> => {
  try {
    // Double encode UUIDs if necessary: encodeURIComponent(encodeURIComponent(meetingUUID))
    // Reports endpoint often works best with the *numeric* meeting ID.
    // Try fetching the meeting first if you only have UUID, to get the numeric ID.
    const encodedMeetingId = encodeURIComponent(meetingId); // Try single encoding first
    const participants = await fetchAllPages(
      `/report/meetings/${encodedMeetingId}/participants`,
    );
    return participants.map(
      (p: any): ZoomParticipant => ({
        // Map to our defined type
        id: p.id, // Participant UUID
        user_id: p.user_id,
        name: p.name,
        user_email: p.user_email,
        join_time: p.join_time,
        leave_time: p.leave_time,
        duration: p.duration,
        attentiveness_score: p.attentiveness_score, // May not always be present
        failover: p.failover,
        customer_key: p.customer_key,
        status: p.status,
      }),
    );
  } catch (error) {
    // Report API often returns 400 or 404 if report not ready/found
    if (
      error.message &&
      (error.message.includes("404") ||
        error.message.includes("400") ||
        error.message.includes("No report"))
    ) {
      console.log(
        `Participant report for meeting ${meetingId} not found or not available yet.`,
      );
      return []; // Return empty array if report not found
    }
    console.error(`Error getting Zoom participants for ${meetingId}:`, error);
    throw new Error(
      `Failed to get meeting participants for ${meetingId}: ${error.message}`,
    );
  }
};

// Get meeting recordings
const getZoomRecordings = async (
  meetingId: string,
): Promise<ZoomCompleteRecording | null> => {
  try {
    // Use the /meetings/{meetingId}/recordings endpoint
    // This might require the meeting UUID, potentially double-encoded
    const encodedMeetingId = encodeURIComponent(encodeURIComponent(meetingId)); // Double encode UUID likely needed
    const response = await zoomApiRequest(
      "GET",
      `/meetings/${encodedMeetingId}/recordings`,
    );

    // The response structure can vary, map it carefully
    return response as ZoomCompleteRecording; // Cast and return the whole object
  } catch (error) {
    if (
      error.message &&
      (error.message.includes("404") || error.message.includes("No recording"))
    ) {
      console.log(`Recordings for meeting ${meetingId} not found.`);
      return null;
    }
    console.error(`Error getting Zoom recordings for ${meetingId}:`, error);
    throw new Error(
      `Failed to get meeting recordings for ${meetingId}: ${error.message}`,
    );
  }
};

// Get meeting registrants
const getZoomRegistrants = async (
  meetingId: string,
  status: "pending" | "approved" | "denied" = "approved",
): Promise<ZoomRegistrant[]> => {
  try {
    const params = new URLSearchParams();
    params.set("status", status);
    const registrants = await fetchAllPages(
      `/meetings/${meetingId}/registrants`,
      params,
    );
    return registrants.map(
      (r: any): ZoomRegistrant => ({
        // Map to our type
        id: r.id,
        email: r.email,
        first_name: r.first_name,
        last_name: r.last_name,
        status: r.status,
        create_time: r.create_time,
        join_url: r.join_url,
        // Map other fields if needed
        address: r.address,
        city: r.city,
        country: r.country,
        zip: r.zip,
        state: r.state,
        phone: r.phone,
        industry: r.industry,
        org: r.org,
        job_title: r.job_title,
        purchasing_time_frame: r.purchasing_time_frame,
        role_in_purchase_process: r.role_in_purchase_process,
        no_of_employees: r.no_of_employees,
        comments: r.comments,
        custom_questions: r.custom_questions,
      }),
    );
  } catch (error) {
    if (
      error.message &&
      (error.message.includes("404") || error.message.includes("300"))
    ) {
      // 300 might mean registration not enabled
      console.log(
        `Registrants for meeting ${meetingId} not found or registration not enabled.`,
      );
      return [];
    }
    console.error(`Error getting Zoom registrants for ${meetingId}:`, error);
    throw new Error(
      `Failed to get meeting registrants for ${meetingId}: ${error.message}`,
    );
  }
};

// Add a registrant to a meeting (requires registration to be enabled)
const addZoomRegistrant = async (
  meetingId: string,
  registrantData: Pick<ZoomRegistrant, "email" | "first_name" | "last_name"> &
    Partial<Omit<ZoomRegistrant, "id" | "status" | "create_time" | "join_url">>, // Required fields + optional ones
): Promise<{
  id: string;
  join_url: string;
  registrant_id: string;
  topic: string;
}> => {
  // Returns more info
  try {
    const response = await zoomApiRequest(
      "POST",
      `/meetings/${meetingId}/registrants`,
      undefined,
      registrantData, // Pass the whole object
    );
    // Response includes id (registrant id), join_url, etc.
    return response as {
      id: string;
      join_url: string;
      registrant_id: string;
      topic: string;
    };
  } catch (error) {
    console.error(`Error adding Zoom registrant to ${meetingId}:`, error);
    throw new Error(
      `Failed to add registrant to meeting ${meetingId}: ${error.message}`,
    );
  }
};

// Update meeting status (End or Cancel)
const updateZoomMeetingStatus = async (
  meetingId: string,
  status: "finished" | "cancelled", // Only support ending or cancelling via API like this
): Promise<boolean> => {
  try {
    if (status === "finished") {
      // Use PUT /meetings/{meetingId}/status with action: "end"
      await zoomApiRequest("PUT", `/meetings/${meetingId}/status`, undefined, {
        action: "end",
      });
      console.log(`Successfully ended meeting ${meetingId}`);
      return true;
    } else if (status === "cancelled") {
      // Cancelling is done via DELETE
      const success = await deleteZoomMeeting(meetingId);
      if (success) {
        console.log(`Successfully cancelled (deleted) meeting ${meetingId}`);
      } else {
        console.warn(`Failed to cancel (delete) meeting ${meetingId}`);
      }
      return success;
    } else {
      console.warn(
        `Unsupported status update: ${status}. Only 'finished' or 'cancelled' supported.`,
      );
      return false;
    }
  } catch (error) {
    console.error(
      `Error updating Zoom meeting ${meetingId} status to ${status}:`,
      error,
    );
    // Re-throw error for the main handler to catch
    throw error;
  }
};

// End an active meeting (same as updateZoomMeetingStatus('finished'))
const endZoomMeeting = async (meetingId: string): Promise<boolean> => {
  try {
    await zoomApiRequest("PUT", `/meetings/${meetingId}/status`, undefined, {
      action: "end",
    });
    console.log(`Successfully ended meeting ${meetingId}`);
    return true;
  } catch (error) {
    console.error(`Error ending meeting ${meetingId}:`, error);
    // Check if error indicates meeting already ended or not running
    if (
      error.message &&
      (error.message.includes("already ended") ||
        error.message.includes("not started") ||
        error.message.includes("not currently in progress"))
    ) {
      console.log(`Meeting ${meetingId} was not running or already ended.`);
      return true; // Consider this a success in the context of ensuring it's ended
    }
    return false;
  }
};

// List meetings (upcoming, past, etc.) for a user
const listZoomMeetings = async (
  userId: string = "me",
  type: "live" | "scheduled" | "upcoming" | "past" | "pastOne" = "upcoming",
  pageSize: number = 30, // Max 300
  nextPageToken?: string,
  from?: string, // YYYY-MM-DD
  to?: string, // YYYY-MM-DD
): Promise<{ meetings: ZoomMeeting[]; next_page_token?: string }> => {
  try {
    const params = new URLSearchParams();
    params.set("type", type);
    params.set("page_size", String(Math.min(pageSize, 300))); // Respect max page size
    if (nextPageToken) {
      params.set("next_page_token", nextPageToken);
    }
    if (type === "past" || type === "pastOne") {
      // 'from' and 'to' are typically used for past meetings (range max 1 month for basic, 6 months for Pro+)
      if (from) params.set("from", from);
      if (to) params.set("to", to);
    }

    const response = await zoomApiRequest(
      "GET",
      `/users/${userId}/meetings`,
      params,
    );
    return response as { meetings: ZoomMeeting[]; next_page_token?: string };
  } catch (error) {
    console.error(
      `Error listing Zoom ${type} meetings for user ${userId}:`,
      error,
    );
    throw new Error(`Failed to list ${type} meetings: ${error.message}`);
  }
};

// Get upcoming meetings (uses listZoomMeetings)
const getUpcomingZoomMeetings = async (
  userId: string = "me",
): Promise<ZoomMeeting[]> => {
  // Fetch all pages for upcoming meetings
  let allMeetings: ZoomMeeting[] = [];
  let nextPageToken: string | undefined = undefined;
  do {
    const result = await listZoomMeetings(
      userId,
      "upcoming",
      300,
      nextPageToken,
    );
    allMeetings = allMeetings.concat(result.meetings);
    nextPageToken = result.next_page_token;
  } while (nextPageToken);
  return allMeetings;
};

// Get past meetings (uses listZoomMeetings)
const getPastZoomMeetings = async (
  userId: string = "me",
  from?: string,
  to?: string,
): Promise<ZoomMeeting[]> => {
  // Fetch all pages for past meetings within the date range
  let allMeetings: ZoomMeeting[] = [];
  let nextPageToken: string | undefined = undefined;
  do {
    const result = await listZoomMeetings(
      userId,
      "past",
      300,
      nextPageToken,
      from,
      to,
    );
    allMeetings = allMeetings.concat(result.meetings);
    nextPageToken = result.next_page_token;
  } while (nextPageToken);
  return allMeetings;
};

// --- Database Interaction Functions (Example Placeholders - Adapt to your schema) ---

// This function seems redundant if syncSessionParticipants is used.
// Keep if you specifically need to track data ONLY from the extension.
const trackZoomAttendance = async (
  supabaseClient: SupabaseClient,
  meetingId: string, // Zoom Meeting ID
  sessionId: string, // Your application's Session ID
  participantData: {
    name: string;
    email?: string; // Email might not always be available/reliable from extension
    join_time: string; // ISO Format
    leave_time?: string; // ISO Format
    user_id?: string; // Zoom User ID if available
    attentiveness_score?: number;
  },
): Promise<string | null> => {
  console.log(
    `Tracking attendance for ${participantData.name} in meeting ${meetingId} / session ${sessionId}`,
  );
  // Example: Upsert into a 'zoom_attendance' table or similar
  // Adapt table/column names to your actual schema
  try {
    const { data, error } = await supabaseClient
      .from("session_participants") // Assuming upserting into the main participants table
      .upsert(
        {
          session_id: sessionId,
          zoom_meeting_id: meetingId, // Link to zoom meeting
          name: participantData.name, // Name from extension
          email: participantData.email, // Email from extension (use cautiously)
          join_time: participantData.join_time,
          leave_time: participantData.leave_time,
          // How to handle conflict? Maybe on email+session_id if email is reliable?
          // Or maybe this should only INSERT if not found, letting sync handle updates?
          // For now, assume conflict on a unique key like zoom_participant_id if available,
          // or handle potential duplicates. Let's assume simple insert for now.
          // If upserting, define onConflict:
        },
        // { onConflict: 'session_id, email' } // Example: Requires unique constraint
      )
      .select("id")
      .maybeSingle(); // Use maybeSingle to handle potential null return

    if (error) throw error;
    console.log(
      `Attendance tracked for ${participantData.name}. DB ID: ${data?.id}`,
    );
    return data?.id ?? null;
  } catch (error) {
    console.error("Error tracking attendance in DB:", error);
    // Don't throw here to allow processing other participants
    return null;
  }
};

// Sync session participants using Zoom Report API as the source of truth
const syncSessionParticipants = async (
  supabaseClient: SupabaseClient,
  sessionId: string, // Your application's Session ID
  zoomMeetingId: string, // Zoom Meeting ID (numeric pref, or UUID)
): Promise<{ synced: number; skipped: number; errors: number }> => {
  console.log(
    `Syncing participants for session ${sessionId} from Zoom meeting ${zoomMeetingId}`,
  );
  let counts = { synced: 0, skipped: 0, errors: 0 };
  try {
    const zoomParticipants = await getZoomParticipants(zoomMeetingId);
    if (!zoomParticipants || zoomParticipants.length === 0) {
      console.log(
        "No participants found in Zoom report for meeting",
        zoomMeetingId,
      );
      return counts;
    }
    console.log(
      `Found ${zoomParticipants.length} participants in Zoom report.`,
    );

    // Prepare data for upsert
    const participantsToUpsert = zoomParticipants.map((participant) => ({
      session_id: sessionId,
      zoom_meeting_id: zoomMeetingId, // Store the source zoom meeting ID
      zoom_participant_uuid: participant.id, // Participant's Zoom UUID
      zoom_user_id: participant.user_id, // Zoom User ID (if available)
      email: participant.user_email, // Use email from Zoom report (often more reliable)
      name: participant.name,
      join_time: participant.join_time,
      leave_time: participant.leave_time,
      duration_seconds: participant.duration, // Store duration from report
      attentiveness_score: participant.attentiveness_score,
      // Add other relevant fields from your 'session_participants' table
      // e.g., status might be derived from duration or fetched separately
      // status: 'present', // Example: Set status based on presence
    }));

    // Upsert into Supabase 'session_participants' table
    // Assumes 'zoom_participant_uuid' is a unique identifier for a participant within a session/meeting context.
    // Adjust 'onConflict' to your schema's unique constraint for participants.
    // If a participant can join/leave multiple times, this simple upsert might overwrite details.
    // You might need a more complex table structure to store multiple join/leave events per participant.
    const { error, count } = await supabaseClient
      .from("session_participants")
      .upsert(participantsToUpsert, {
        onConflict: "session_id, zoom_participant_uuid", // IMPORTANT: Define this constraint in your DB
        ignoreDuplicates: false, // Ensure updates happen
      })
      .select({ count: "exact" }); // Get the count of affected rows

    if (error) {
      console.error("Error upserting participants to DB:", error);
      counts.errors = participantsToUpsert.length; // Assume all failed on batch error
      throw error; // Propagate the error
    }

    counts.synced = count ?? 0; // Number of inserted/updated rows
    counts.skipped = participantsToUpsert.length - counts.synced; // If any weren't upserted (unlikely with ignoreDuplicates=false)

    console.log(
      `Sync completed: ${counts.synced} participants upserted, ${counts.skipped} skipped, ${counts.errors} errors.`,
    );
    return counts;
  } catch (error) {
    console.error("Failed during participant sync:", error);
    // counts.errors might already be set if the upsert failed
    if (counts.errors === 0) counts.errors = 1; // Indicate at least one error occurred
    // Do not re-throw here, return the counts object
    return counts;
  }
};

// Process recording data received from an external source (e.g., Chrome Extension)
const processExtensionRecording = async (
  supabaseClient: SupabaseClient,
  sessionId: string,
  zoomMeetingId: string, // Zoom Meeting ID associated
  recordingData: {
    start_time: string; // ISO Format
    end_time: string; // ISO Format
    title?: string;
    recording_type?: string; // e.g., "screen_share", "video"
    file_size?: number; // Bytes
    file_path?: string; // e.g., Storage path or URL
    download_url?: string; // URL if directly available
    thumbnail_url?: string;
    password?: string;
    share_url?: string;
    participants?: Array<{
      // Optional participants captured by extension
      name: string;
      email?: string;
      join_time: string;
      leave_time?: string;
      attentiveness_score?: number;
    }>;
  },
): Promise<{
  recordingId: string | null;
  participantsProcessed: number;
  participantsSynced?: number;
}> => {
  console.log(
    `Processing extension recording for session ${sessionId}, meeting ${zoomMeetingId}`,
  );
  let recordingId: string | null = null;
  let participantsProcessed = 0;
  let syncResult:
    | { synced: number; skipped: number; errors: number }
    | undefined = undefined;

  try {
    // 1. Store the recording metadata in Supabase
    const { data: recordingInsertData, error: recordingError } =
      await supabaseClient
        .from("session_recordings") // Adapt table name
        .insert({
          session_id: sessionId,
          zoom_meeting_id: zoomMeetingId, // Link to zoom meeting
          title: recordingData.title || `Session Recording ${sessionId}`,
          start_time: recordingData.start_time,
          end_time: recordingData.end_time,
          recording_type: recordingData.recording_type || "extension_capture",
          file_size_bytes: recordingData.file_size || 0,
          storage_path: recordingData.file_path || null, // Store path if applicable
          download_url: recordingData.download_url || null,
          thumbnail_url: recordingData.thumbnail_url || null,
          password: recordingData.password || null, // Handle sensitive data appropriately
          share_url: recordingData.share_url || null,
          // date: recordingData.start_time.split('T')[0], // Extract date if needed
          // duration: Calculate duration if needed
        })
        .select("id")
        .single();

    if (recordingError) {
      console.error("Error inserting recording metadata:", recordingError);
      throw recordingError; // Stop processing if recording can't be saved
    }
    recordingId = recordingInsertData.id;
    console.log(`Recording metadata saved with ID: ${recordingId}`);

    // 2. Process participants data *from the extension* (if provided)
    // This might be less reliable than the Zoom report sync. Use with caution.
    if (recordingData.participants && recordingData.participants.length > 0) {
      console.log(
        `Processing ${recordingData.participants.length} participants from extension data...`,
      );
      for (const participant of recordingData.participants) {
        try {
          // Use trackZoomAttendance or directly upsert into session_participants
          // Be mindful of potential data conflicts with the sync function
          await trackZoomAttendance(
            supabaseClient,
            zoomMeetingId,
            sessionId,
            participant,
          );
          participantsProcessed++;
        } catch (participantError) {
          console.error(
            `Error processing participant ${participant.name || participant.email} from extension:`,
            participantError,
          );
          // Continue with next participant
        }
      }
      console.log(
        `Finished processing ${participantsProcessed} participants from extension.`,
      );
    }

    // 3. Optionally, trigger a sync with Zoom Reports API for accuracy
    // It might be better to run sync separately or based on meeting status changes.
    // Running it here ensures data is updated shortly after recording processing.
    console.log("Triggering participant sync with Zoom Reports API...");
    syncResult = await syncSessionParticipants(
      supabaseClient,
      sessionId,
      zoomMeetingId,
    );

    return {
      recordingId,
      participantsProcessed, // Number processed from extension data
      participantsSynced: syncResult?.synced, // Number synced/updated from Zoom API
    };
  } catch (error) {
    console.error("Error processing extension recording:", error);
    // Return partial success if recording ID was generated
    return {
      recordingId,
      participantsProcessed,
      participantsSynced: syncResult?.synced,
    };
  }
};

// Register Chrome extension info (Example)
const registerChromeExtension = async (
  supabaseClient: SupabaseClient,
  userId: string, // The user who installed/registered the extension
  extensionId: string,
  version: string,
  settings?: Record<string, any>,
): Promise<boolean> => {
  console.log(
    `Registering extension ${extensionId} v${version} for user ${userId}`,
  );
  try {
    // Upsert into a 'user_extensions' table (adapt schema)
    const { error } = await supabaseClient.from("user_extensions").upsert(
      {
        user_id: userId,
        extension_id: extensionId, // The Chrome Extension ID
        version: version,
        settings: settings || {},
        last_registered_at: new Date().toISOString(),
      },
      { onConflict: "user_id, extension_id" }, // Assumes unique constraint
    );

    if (error) throw error;
    console.log("Extension registration successful.");
    return true;
  } catch (error) {
    console.error("Error registering Chrome extension in DB:", error);
    return false;
  }
};

// --- Main Request Handler ---
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*", // Be more specific in production
        "Access-Control-Allow-Methods":
          "POST, GET, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  // Standard headers for actual requests
  const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Be more specific in production
  };

  try {
    // Ensure Supabase client is available
    if (!supabase) {
      throw new Error("Supabase client not initialized.");
    }

    // Parse the request body
    let action: string;
    let params: any;
    try {
      const body = await req.json();
      action = body.action;
      params = body.params;
      if (!action || typeof action !== "string") {
        throw new Error(
          "Invalid request format: 'action' field is missing or not a string.",
        );
      }
      if (params === undefined) {
        // Allow null or empty object for params
        params = {};
      }
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({
          error:
            "Invalid request body. Ensure it's valid JSON with 'action' and 'params'.",
        }),
        {
          status: 400,
          headers: responseHeaders,
        },
      );
    }

    console.log(`Received action: ${action} with params:`, params); // Log received action/params

    let result: any;

    // Route the request based on the action
    switch (action) {
      // Meeting Actions
      case "createMeeting":
        // Expects: topic, startTime, duration, userId?, timezone?, agenda?, settings?
        result = await createZoomMeeting(
          params.userId || "me", // Default to 'me' if userId not provided
          params.topic,
          params.startTime,
          params.duration,
          params.timezone,
          params.agenda,
          params.settings,
        );
        break;
      case "getMeeting":
        // Expects: meetingId
        result = await getZoomMeeting(params.meetingId);
        break;
      case "updateMeeting":
        // Expects: meetingId, updateData, occurrenceId?
        result = await updateZoomMeeting(
          params.meetingId,
          params.updateData,
          params.occurrenceId,
        );
        break;
      case "deleteMeeting":
        // Expects: meetingId, occurrenceId?
        result = await deleteZoomMeeting(params.meetingId, params.occurrenceId);
        break;
      case "updateMeetingStatus": // Handles ending/cancelling
        // Expects: meetingId, status ('finished' or 'cancelled')
        result = await updateZoomMeetingStatus(params.meetingId, params.status);
        break;
      case "endMeeting": // Specific action for ending
        // Expects: meetingId
        result = await endZoomMeeting(params.meetingId);
        break;
      case "listMeetings": // Generic list action
        // Expects: userId?, type?, pageSize?, nextPageToken?, from?, to?
        result = await listZoomMeetings(
          params.userId || "me",
          params.type || "upcoming",
          params.pageSize,
          params.nextPageToken,
          params.from,
          params.to,
        );
        break;
      case "getUpcomingMeetings":
        // Expects: userId?
        result = await getUpcomingZoomMeetings(params.userId || "me");
        break;
      case "getPastMeetings":
        // Expects: userId?, from?, to?
        result = await getPastZoomMeetings(
          params.userId || "me",
          params.from,
          params.to,
        );
        break;

      // Participant/Registrant Actions
      case "getParticipants":
        // Expects: meetingId
        result = await getZoomParticipants(params.meetingId);
        break;
      case "getRegistrants":
        // Expects: meetingId, status?
        result = await getZoomRegistrants(params.meetingId, params.status);
        break;
      case "addRegistrant":
        // Expects: meetingId, registrantData
        result = await addZoomRegistrant(
          params.meetingId,
          params.registrantData,
        );
        break;

      // Recording Actions
      case "getRecordings": // Gets all recording files/metadata for a meeting
        // Expects: meetingId
        result = await getZoomRecordings(params.meetingId);
        break;

      // Application Specific / DB Actions
      case "trackAttendance": // Less used if syncParticipants is primary
        // Expects: meetingId, sessionId, participantData
        result = await trackZoomAttendance(
          supabase,
          params.meetingId,
          params.sessionId,
          params.participantData,
        );
        break;
      case "syncParticipants": // Primary method for participant data
        // Expects: sessionId, zoomMeetingId
        result = await syncSessionParticipants(
          supabase,
          params.sessionId,
          params.zoomMeetingId,
        );
        break;
      case "processExtensionRecording": // Handles data from external sources
        // Expects: sessionId, zoomMeetingId, recordingData
        result = await processExtensionRecording(
          supabase,
          params.sessionId,
          params.zoomMeetingId,
          params.recordingData,
        );
        break;
      case "registerExtension":
        // Expects: userId, extensionId, version, settings?
        result = await registerChromeExtension(
          supabase,
          params.userId,
          params.extensionId,
          params.version,
          params.settings,
        );
        break;

      default:
        console.warn(`Invalid action received: ${action}`);
        return new Response(
          JSON.stringify({ error: `Invalid action: ${action}` }),
          {
            status: 400,
            headers: responseHeaders,
          },
        );
    }

    // Return successful result
    return new Response(JSON.stringify(result), {
      // Return result directly, client adds { data: result }
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    // Log the detailed error on the server
    console.error(`Error processing action: ${error.message}`, error.stack);

    // Return a generic error message to the client
    return new Response(
      JSON.stringify({
        error: error.message || "An internal server error occurred.",
      }),
      {
        status:
          error.message && error.message.startsWith("Zoom API Error 4")
            ? 400
            : 500, // Rough mapping: 4xx client, 5xx server
        headers: responseHeaders,
      },
    );
  }
});
