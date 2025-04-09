import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  Users,
  Video,
  Link as LinkIcon,
  Mail,
  Loader2,
  RefreshCw,
  Plus,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useTraining } from "@/hooks/useTraining"; // Adjust path if needed
import { useAuth } from "@/context/AuthContext"; // Adjust path if needed
import {
  TrainingSession,
  SessionParticipant,
  // Assuming createTrainingSession takes a payload object
  createTrainingSession, // Import your DB creation function
  // updateSession is likely provided by useTraining or needs importing
  // updateSession,
} from "@/lib/api/training"; // Adjust path as needed
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  // DialogClose, // Import if manual close needed
} from "@/components/ui/dialog";
// Correctly import Zoom functions and types from your frontend API layer
// These functions should call your Supabase Edge Function
import { createZoomMeeting, getZoomMeeting } from "@/lib/api/zoom"; // Adjust path as needed

// --- Define Types ---

// Type matching the backend ZoomMeeting structure
type ZoomMeeting = {
  uuid?: string;
  id: string; // Note: Zoom API might return number, backend returns string? Ensure consistency. Let's assume string based on backend code.
  topic: string;
  type?: number;
  start_time: string;
  duration: number;
  timezone?: string;
  agenda?: string;
  created_at?: string;
  join_url: string;
  password?: string; // Optional password
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

// Combined interface for state management
interface SessionWithDetails extends TrainingSession {
  zoomMeetingDetails?: ZoomMeeting | null;
  participants: SessionParticipant[]; // Ensure participants is part of the session details
  // Add other fields from loadSessionDetails if needed
  zoomMeetingId?: string | null; // Ensure this is loaded by loadSessionDetails
  meetLink?: string | null; // General meeting link field
}

// Define the expected payload for creating a training session in DB
// Adjust this based on your actual createTrainingSession function signature
type TrainingSessionPayload = Omit<
  TrainingSession,
  "id" | "createdAt" | "updatedAt"
> & {
  created_by: string;
  zoomMeetingId?: string | null;
  zoomMeetingPassword?: string | null;
  meetLink?: string | null; // Ensure meetLink is part of your TrainingSession type/payload
};

interface SessionManagerProps {
  className?: string;
}

// --- Component ---

const SessionManager = ({ className }: SessionManagerProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    sessions: trainingSessions, // Raw sessions from the hook
    loading: loadingList, // Rename to avoid conflict
    error: listError, // Rename to avoid conflict
    loadSessionsByStatus,
    loadSessionDetails,
    updateSession, // Get updateSession from the hook
    // register, // Assuming this registers the current user for a session
  } = useTraining();

  const [sessionsWithDetails, setSessionsWithDetails] = useState<
    SessionWithDetails[]
  >([]);
  const [loadingDetailsMap, setLoadingDetailsMap] = useState<
    Record<string, boolean>
  >({});
  const [newMeetLink, setNewMeetLink] = useState("");
  const [selectedSessionIdForLink, setSelectedSessionIdForLink] = useState<
    string | null
  >(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateSessionDialogOpen, setIsCreateSessionDialogOpen] =
    useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSessionData, setNewSessionData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    capacity: 20,
  });

  // --- Effects ---

  // Load upcoming sessions
  useEffect(() => {
    const loadUpcoming = async () => {
      if (isRefreshing) return; // Prevent multiple calls during refresh
      setIsRefreshing(true);
      try {
        await loadSessionsByStatus("scheduled"); // Assuming 'scheduled' fetches upcoming
      } catch (err: any) {
        console.error("Error loading upcoming sessions:", err);
        toast({
          title: "Error Loading Sessions",
          description: err.message || "Could not fetch upcoming sessions.",
          variant: "destructive",
        });
      } finally {
        setIsRefreshing(false);
      }
    };
    loadUpcoming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSessionsByStatus, toast, retryCount]); // Trigger on mount and retryCount change

  // Load details (participants and Zoom info) for each session
  useEffect(() => {
    const fetchAllDetails = async () => {
      if (!trainingSessions.length) {
        setSessionsWithDetails([]);
        return;
      }

      const initialLoadingMap: Record<string, boolean> = {};
      trainingSessions.forEach((session) => {
        initialLoadingMap[session.id] = true; // Set loading true initially
      });
      setLoadingDetailsMap(initialLoadingMap);

      const detailedSessionsPromises = trainingSessions.map(
        async (session): Promise<SessionWithDetails> => {
          let details: Partial<TrainingSession> & {
            participants?: SessionParticipant[];
            zoomMeetingId?: string | null;
            meetLink?: string | null;
          } = {};
          let zoomMeetingDetails: ZoomMeeting | null = null;

          try {
            // Fetch training session details (participants, zoomMeetingId, meetLink)
            details = await loadSessionDetails(session.id);

            // If session has a Zoom ID, fetch Zoom details via backend
            if (details.zoomMeetingId) {
              try {
                zoomMeetingDetails = await getZoomMeeting(
                  details.zoomMeetingId,
                );
              } catch (zoomError: any) {
                console.error(
                  `Error fetching Zoom details for meeting ${details.zoomMeetingId}:`,
                  zoomError,
                );
                toast({
                  title: "Zoom Fetch Warning",
                  description: `Could not fetch details for Zoom meeting associated with "${session.title}". Link might be stale. Error: ${zoomError.message}`,
                  variant: "destructive", // Or 'warning'
                });
                // Keep session data, but Zoom details will be null
              }
            }

            // Combine base session info with fetched details
            return {
              ...session, // Base info from trainingSessions list
              ...details, // Details like participants, zoomMeetingId from loadSessionDetails
              zoomMeetingDetails, // Add fetched Zoom details (null if failed or no ID)
              participants: details.participants || [], // Ensure participants is always an array
            };
          } catch (sessionError: any) {
            console.error(
              `Error loading details for session ${session.id}:`,
              sessionError,
            );
            toast({
              title: "Session Detail Error",
              description: `Could not load details for "${session.title}". Error: ${sessionError.message}`,
              variant: "destructive",
            });
            // Return base session info with empty participants if details fetch fails
            return {
              ...session,
              participants: [],
              zoomMeetingDetails: null,
            };
          } finally {
            // Update loading state for this specific session *after* processing
            setLoadingDetailsMap((prev) => ({ ...prev, [session.id]: false }));
          }
        },
      );

      // Wait for all detail fetches to complete
      const results = await Promise.all(detailedSessionsPromises);
      setSessionsWithDetails(results);
    };

    // Only run if trainingSessions has data
    if (trainingSessions.length > 0) {
      fetchAllDetails();
    } else {
      setSessionsWithDetails([]); // Clear details if no sessions
      setLoadingDetailsMap({}); // Clear loading map
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingSessions, loadSessionDetails, toast]); // Rerun when raw sessions change

  // --- Handlers ---

  // Helper to calculate duration in minutes
  const calculateDuration = useCallback(
    (startTime: string, endTime: string): number => {
      if (!startTime || !endTime) return 0;
      try {
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endHours, endMinutes] = endTime.split(":").map(Number);
        if (
          isNaN(startHours) ||
          isNaN(startMinutes) ||
          isNaN(endHours) ||
          isNaN(endMinutes)
        )
          return 0;

        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        return endTotalMinutes - startTotalMinutes; // Can be negative if end time is earlier
      } catch {
        return 0; // Handle potential split errors
      }
    },
    [],
  );

  // Corrected Function to handle creating a new session (including Zoom)
  const handleCreateSession = async () => {
    // --- Input Validation ---
    if (
      !newSessionData.title ||
      !newSessionData.date ||
      !newSessionData.startTime ||
      !newSessionData.endTime
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in Title, Date, Start Time, and End Time.",
        variant: "destructive",
      });
      return;
    }
    if (!user || !user.id) {
      toast({
        title: "Authentication Error",
        description: "User not found. Cannot create session.",
        variant: "destructive",
      });
      return;
    }

    // --- Calculate Duration and Validate ---
    const durationMinutes = calculateDuration(
      newSessionData.startTime,
      newSessionData.endTime,
    );
    if (durationMinutes <= 0) {
      toast({
        title: "Invalid Time",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    // --- Prepare Data ---
    const formattedStartTime = `${newSessionData.date}T${newSessionData.startTime}:00Z`; // ISO 8601 UTC

    // Payload for the backend 'createMeeting' action
    const zoomMeetingParams = {
      topic: newSessionData.title,
      start_time: formattedStartTime,
      duration: durationMinutes,
      agenda: newSessionData.description || undefined,
      // Optional: Add default settings if desired
      // settings: { waiting_room: true, mute_upon_entry: true }
    };

    setIsCreatingSession(true);

    try {
      // --- Step 1: Call Backend to Create Zoom Meeting ---
      console.log(
        "Calling backend createZoomMeeting with params:",
        zoomMeetingParams,
      );
      // Assumes `createZoomMeeting` in '@/lib/api/zoom' calls Supabase function
      const zoomMeeting: ZoomMeeting =
        await createZoomMeeting(zoomMeetingParams);
      console.log("Zoom meeting created:", zoomMeeting);

      if (!zoomMeeting || !zoomMeeting.id || !zoomMeeting.join_url) {
        throw new Error(
          "Failed to retrieve necessary details from Zoom meeting creation.",
        );
      }

      // --- Step 2: Create Training Session in Database ---
      // Adjust keys based on your actual database schema and function signature
      const trainingSessionPayload: TrainingSessionPayload = {
        // Base fields matching TrainingSession type (excluding DB generated ones)
        title: newSessionData.title,
        description: newSessionData.description || null,
        date: newSessionData.date,
        startTime: newSessionData.startTime,
        endTime: newSessionData.endTime,
        capacity: newSessionData.capacity,
        status: "scheduled",
        // Link fields
        created_by: user.id,
        meetLink: zoomMeeting.join_url, // Use Zoom link as the primary meetLink
        zoomMeetingId: zoomMeeting.id.toString(), // Store Zoom ID (ensure string)
        zoomMeetingPassword: zoomMeeting.password || null, // Store password if exists
        // type: 'webinar', // Include if needed by your DB schema
      };

      console.log(
        "Calling createTrainingSession with payload:",
        trainingSessionPayload,
      );
      // Assumes `createTrainingSession` in '@/lib/api/training' handles DB insertion
      await createTrainingSession(trainingSessionPayload);

      // --- Success ---
      toast({
        title: "Session Created",
        description: `"${newSessionData.title}" created successfully with a Zoom meeting.`,
      });
      setNewSessionData({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        description: "",
        capacity: 20,
      });
      setIsCreateSessionDialogOpen(false);
      setRetryCount((prev) => prev + 1); // Refresh list
    } catch (err: any) {
      // --- Error Handling ---
      console.error("Error creating session:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";
      toast({
        title: "Error Creating Session",
        description: `Failed: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsCreatingSession(false); // Stop loading indicator
    }
  };

  // Function to handle adding a non-Zoom meeting link
  const handleAddMeetLink = async () => {
    if (!selectedSessionIdForLink || !newMeetLink) return;
    setIsRefreshing(true); // Reuse refreshing state for general loading indication
    try {
      // Use the updateSession function (assuming it's from useTraining or imported)
      await updateSession(selectedSessionIdForLink, { meetLink: newMeetLink });
      toast({
        title: "Meet Link Added",
        description: "The meeting link has been updated.",
      });
      setNewMeetLink("");
      setSelectedSessionIdForLink(null);
      setRetryCount((prev) => prev + 1); // Refresh list
    } catch (err: any) {
      console.error("Error adding meet link:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to add meet link.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Placeholder for sending notifications
  const handleSendNotifications = async (sessionId: string) => {
    const session = sessionsWithDetails.find((s) => s.id === sessionId);
    if (!session) {
      toast({
        title: "Error",
        description: "Session not found.",
        variant: "destructive",
      });
      return;
    }
    // Prefer Zoom link if available, otherwise fallback to general meetLink
    const meetLink = session.zoomMeetingDetails?.join_url || session.meetLink;
    if (!meetLink) {
      toast({
        title: "Missing Link",
        description: "No meeting link available for this session.",
        variant: "warning",
      });
      return;
    }
    // Ensure participant structure has email
    const participantEmails = session.participants
      .map((p: any) => p.userEmail || p.email) // Adapt based on your SessionParticipant type
      .filter((email): email is string => !!email && email.includes("@")); // Basic validation

    if (participantEmails.length === 0) {
      toast({
        title: "No Participants",
        description: "No registered participants with valid emails found.",
        variant: "warning",
      });
      return;
    }
    console.log(
      `[Simulate Send Notification] Session: ${session.title}, Link: ${meetLink}, Emails: ${participantEmails.join(", ")}`,
    );
    // --- TODO: Replace console.log with actual API call to your backend notification endpoint ---
    toast({
      title: "Notifications Simulated",
      description: `Would send link to ${participantEmails.length} participants. Check console.`,
    });
  };

  // Refresh function
  const handleRefresh = () => {
    if (!isRefreshing && !loadingList) {
      // Prevent multiple refreshes
      setRetryCount((prev) => prev + 1);
    }
  };

  // Helper to display time until session starts
  const calculateTimeUntilSession = useCallback(
    (dateStr: string, timeStr: string): string => {
      if (!dateStr || !timeStr) return "Invalid date/time";
      try {
        // Combine date and time, assume local timezone if Z/offset not present
        // For accuracy with user input, explicitly parsing might be better than direct construction
        const sessionDateTime = new Date(`${dateStr}T${timeStr}`);
        if (isNaN(sessionDateTime.getTime())) return "Invalid date/time";

        const now = new Date();
        const diffMs = sessionDateTime.getTime() - now.getTime();

        if (diffMs <= 0) return "Session has passed";

        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 1) return `In ${diffDays} days`;
        if (diffDays === 1) return "Tomorrow";
        if (diffHours > 0)
          return `In ${diffHours} hr${diffHours > 1 ? "s" : ""}`;
        if (diffMins > 0) return `In ${diffMins} min${diffMins > 1 ? "s" : ""}`;
        return "Starting soon";
      } catch {
        return "Error calculating time";
      }
    },
    [],
  );

  // Format HH:MM time for display
  const formatDisplayTime = useCallback((timeStr: string): string => {
    if (!timeStr || !timeStr.includes(":")) return timeStr; // Basic validation
    try {
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeStr; // Fallback
    }
  }, []);

  // --- Derived State ---
  const filteredSessions = searchTerm
    ? sessionsWithDetails.filter((session) =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : sessionsWithDetails;

  const overallLoading =
    loadingList ||
    Object.values(loadingDetailsMap).some((isLoading) => isLoading);

  // --- Render ---
  return (
    <Card
      className={`w-full bg-[#1A1F2C] text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Video className="h-5 w-5 text-[#ffbd59]" />
            Session Manager
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white"
            onClick={handleRefresh}
            disabled={isRefreshing || loadingList} // Disable during list load or refresh
            aria-label="Refresh sessions"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Header & Create Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
            <Button
              className="bg-[#ffbd59] hover:bg-[#ffbd59]/90 text-[#1A1F2C] font-medium"
              onClick={() => setIsCreateSessionDialogOpen(true)}
              disabled={overallLoading || isRefreshing} // Disable if anything is loading
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Session
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search sessions by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#242938] border-gray-700 text-white focus:border-[#ffbd59] focus:ring-[#ffbd59]"
              aria-label="Search sessions"
            />
          </div>

          {/* Loading State */}
          {loadingList &&
            !isRefreshing && ( // Show list loading only if not explicitly refreshing
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-[#ffbd59] animate-spin" />
                <span className="ml-2 text-gray-300">Loading sessions...</span>
              </div>
            )}

          {/* Error State */}
          {listError && !loadingList && (
            <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-center">
              <p className="text-white mb-4">
                Error loading sessions:{" "}
                {typeof listError === "string"
                  ? listError
                  : "Please try again later."}
              </p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-red-700 text-white hover:bg-red-900/30"
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />{" "}
                Retry
              </Button>
            </div>
          )}

          {/* Content Area: No Sessions or Filtered List */}
          {!loadingList &&
            !listError &&
            (filteredSessions.length === 0 ? (
              // No Sessions View
              <div className="p-6 bg-[#242938] rounded-lg text-center">
                <Calendar className="h-12 w-12 mx-auto text-[#ffbd59] mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? "No Matching Sessions" : "No Upcoming Sessions"}
                </h3>
                <p className="text-gray-400 mb-4 max-w-md mx-auto">
                  {searchTerm
                    ? `No sessions found matching "${searchTerm}". Try clearing the search.`
                    : "Create a new session to get started!"}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:text-white"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              // Display Filtered Sessions
              <div className="space-y-4">
                {" "}
                {/* Add spacing between session cards */}
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-lg bg-[#242938] hover:bg-[#2a3040] transition-colors shadow-md"
                  >
                    {/* Session Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {session.title}
                        </h3>
                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-[#ffbd59]" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-[#ffbd59]" />
                            <span>
                              {formatDisplayTime(session.startTime)} -{" "}
                              {formatDisplayTime(session.endTime)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-[#ffbd59]" />
                            <span>
                              {session.participants.length} Participant
                              {session.participants.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="mt-2 md:mt-0 bg-blue-500/10 text-blue-300 border-blue-500/30 whitespace-nowrap"
                      >
                        {calculateTimeUntilSession(
                          session.date,
                          session.startTime,
                        )}
                      </Badge>
                    </div>

                    {/* Meeting Link Section */}
                    <div className="p-3 bg-[#1A1F2C] rounded-lg mb-4">
                      {loadingDetailsMap[session.id] ? (
                        <div className="flex items-center justify-center text-sm text-gray-400">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                          Loading link & participants...
                        </div>
                      ) : session.zoomMeetingDetails ? (
                        // Zoom Link Display
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Video className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <span className="text-white font-medium">
                                Zoom Meeting
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-800 text-blue-300 hover:bg-blue-900/30 hover:text-blue-200"
                              onClick={() =>
                                handleSendNotifications(session.id)
                              }
                            >
                              <Mail className="mr-2 h-4 w-4" /> Send
                              Notifications
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#242938]/50 p-3 rounded">
                            <div>
                              <p className="text-xs text-gray-400 mb-1">
                                Join URL:
                              </p>
                              <a
                                href={session.zoomMeetingDetails.join_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm truncate block break-all"
                                title={session.zoomMeetingDetails.join_url}
                              >
                                {session.zoomMeetingDetails.join_url}
                              </a>
                            </div>
                            {session.zoomMeetingDetails.password && (
                              <div>
                                <p className="text-xs text-gray-400 mb-1">
                                  Password:
                                </p>
                                <p className="text-white text-sm font-mono bg-[#1A1F2C] px-2 py-1 rounded inline-block">
                                  {session.zoomMeetingDetails.password}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : session.meetLink ? (
                        // Other Meet Link Display
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Video className="h-4 w-4 text-green-500 flex-shrink-0" />{" "}
                            {/* Use different color? */}
                            <a
                              href={session.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-400 hover:text-green-300 text-sm truncate break-all"
                              title={session.meetLink}
                            >
                              {session.meetLink}
                            </a>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-800 text-green-300 hover:bg-green-900/30 hover:text-green-200"
                            onClick={() => handleSendNotifications(session.id)}
                          >
                            <Mail className="mr-2 h-4 w-4" /> Send Notifications
                          </Button>
                        </div>
                      ) : (
                        // Add Link Button
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                          <p className="text-sm text-gray-400">
                            No meeting link associated.
                          </p>
                          <Button
                            size="sm"
                            className="bg-[#ffbd59] hover:bg-[#ffbd59]/90 text-[#1A1F2C]"
                            onClick={() =>
                              setSelectedSessionIdForLink(session.id)
                            }
                          >
                            <LinkIcon className="mr-2 h-4 w-4" /> Add Custom
                            Link
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Participants Section */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">
                        Participants ({session.participants.length})
                      </h4>
                      {loadingDetailsMap[session.id] ? (
                        // Loading state shown above covers this
                        <div className="p-3 bg-[#1A1F2C] rounded-lg text-center text-sm text-gray-400">
                          Loading...
                        </div>
                      ) : session.participants.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {session.participants.map(
                            (
                              participant: any, // Use specific type if available
                            ) => (
                              <div
                                key={
                                  participant.id ||
                                  participant.userId ||
                                  participant.email
                                }
                                className="flex justify-between items-center p-2 bg-[#1A1F2C] rounded-md"
                              >
                                <div>
                                  {/* Adapt based on your SessionParticipant structure */}
                                  <p className="text-sm font-medium text-white">
                                    {participant.name ||
                                      participant.userName ||
                                      "Unknown User"}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {participant.email ||
                                      participant.userEmail ||
                                      "No email"}
                                  </p>
                                </div>
                                {/* Optional: Add status badge if participant object has status */}
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-[#1A1F2C] rounded-lg text-center">
                          <p className="text-sm text-gray-400">
                            No participants registered yet.
                          </p>
                          {/* Optional: Add register button if applicable */}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {/* Add Meet Link Input Area (Conditional) */}
          {selectedSessionIdForLink && (
            <div className="p-4 rounded-lg bg-[#2a3040] border border-[#ffbd59] mt-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Add Custom Meeting Link
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meetLinkInput" className="text-gray-300">
                    Meeting URL
                  </Label>
                  <Input
                    id="meetLinkInput"
                    placeholder="https://meet.google.com/..."
                    value={newMeetLink}
                    onChange={(e) => setNewMeetLink(e.target.value)}
                    className="bg-[#1A1F2C] border-gray-700 text-white focus:border-[#ffbd59] focus:ring-[#ffbd59]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:text-white"
                    onClick={() => setSelectedSessionIdForLink(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#ffbd59] hover:bg-[#ffbd59]/90 text-[#1A1F2C]"
                    onClick={handleAddMeetLink}
                    disabled={!newMeetLink || isRefreshing}
                  >
                    {isRefreshing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save Link"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create New Session Dialog */}
        <Dialog
          open={isCreateSessionDialogOpen}
          onOpenChange={setIsCreateSessionDialogOpen}
        >
          <DialogContent className="bg-[#242938] text-white border-[#ffbd59] max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Create New Training Session
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Form Fields */}
              <div className="space-y-1.5">
                <Label htmlFor="newTitle">Session Title *</Label>
                <Input
                  id="newTitle"
                  placeholder="e.g., Advanced React Hooks"
                  value={newSessionData.title}
                  onChange={(e) =>
                    setNewSessionData({
                      ...newSessionData,
                      title: e.target.value,
                    })
                  }
                  required
                  className="bg-[#1A1F2C] border-gray-700"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newDate">Date *</Label>
                <Input
                  id="newDate"
                  type="date"
                  value={newSessionData.date}
                  onChange={(e) =>
                    setNewSessionData({
                      ...newSessionData,
                      date: e.target.value,
                    })
                  }
                  required
                  className="bg-[#1A1F2C] border-gray-700"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="newStartTime">Start Time *</Label>
                  <Input
                    id="newStartTime"
                    type="time"
                    value={newSessionData.startTime}
                    onChange={(e) =>
                      setNewSessionData({
                        ...newSessionData,
                        startTime: e.target.value,
                      })
                    }
                    required
                    className="bg-[#1A1F2C] border-gray-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="newEndTime">End Time *</Label>
                  <Input
                    id="newEndTime"
                    type="time"
                    value={newSessionData.endTime}
                    onChange={(e) =>
                      setNewSessionData({
                        ...newSessionData,
                        endTime: e.target.value,
                      })
                    }
                    required
                    className="bg-[#1A1F2C] border-gray-700"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newDescription">Description (Optional)</Label>
                <Input
                  id="newDescription"
                  placeholder="Briefly describe the session content"
                  value={newSessionData.description}
                  onChange={(e) =>
                    setNewSessionData({
                      ...newSessionData,
                      description: e.target.value,
                    })
                  }
                  className="bg-[#1A1F2C] border-gray-700"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newCapacity">Capacity</Label>
                <Input
                  id="newCapacity"
                  type="number"
                  min="1"
                  max="1000"
                  value={newSessionData.capacity}
                  onChange={(e) =>
                    setNewSessionData({
                      ...newSessionData,
                      capacity: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  required
                  className="bg-[#1A1F2C] border-gray-700"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateSessionDialogOpen(false)}
                className="border-gray-700 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#ffbd59] hover:bg-[#ffbd59]/90 text-[#1A1F2C]"
                onClick={handleCreateSession}
                disabled={
                  !newSessionData.title ||
                  !newSessionData.date ||
                  !newSessionData.startTime ||
                  !newSessionData.endTime ||
                  calculateDuration(
                    newSessionData.startTime,
                    newSessionData.endTime,
                  ) <= 0 ||
                  isCreatingSession
                }
              >
                {isCreatingSession ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Creating...
                  </>
                ) : (
                  "Create Session & Zoom Meeting"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SessionManager;
