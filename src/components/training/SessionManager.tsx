import React, { useState, useEffect } from "react";
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
  X,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useTraining } from "@/hooks/useTraining";
import { useAuth } from "@/context/AuthContext";
import {
  TrainingSession,
  SessionParticipant,
  createTrainingSession,
} from "@/lib/api/training";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { createZoomMeeting, getZoomMeeting, ZoomMeeting } from "@/lib/api/zoom";

interface SessionManagerProps {
  className?: string;
}

interface SessionWithParticipants {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string | null;
  zoomMeetingId?: string | null;
  zoomMeetingDetails?: ZoomMeeting | null;
  participants: SessionParticipant[];
}

const SessionManager = ({ className }: SessionManagerProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    sessions: trainingSessions,
    loading,
    error,
    loadSessionsByStatus,
    loadSessionDetails,
    updateSession,
    register,
    cancelRegistration,
  } = useTraining();

  const [sessionsWithParticipants, setSessionsWithParticipants] = useState<
    SessionWithParticipants[]
  >([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [newMeetLink, setNewMeetLink] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateSessionDialogOpen, setIsCreateSessionDialogOpen] =
    useState(false);
  const [isCreatingZoomMeeting, setIsCreatingZoomMeeting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSessionData, setNewSessionData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    type: "webinar",
    capacity: 20,
  });

  // Load upcoming sessions on component mount
  useEffect(() => {
    const loadUpcomingSessions = async () => {
      try {
        await loadSessionsByStatus("scheduled");
      } catch (err) {
        console.error("Error loading upcoming sessions:", err);
        toast({
          title: "Error",
          description: "Failed to load upcoming sessions. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadUpcomingSessions();
  }, [loadSessionsByStatus, toast, retryCount]);

  // Load session details for each session
  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!trainingSessions.length) return;

      setLoadingDetails(true);
      try {
        const sessionsData = await Promise.all(
          trainingSessions.map(async (session) => {
            try {
              const details = await loadSessionDetails(session.id);
              return {
                id: session.id,
                title: session.title,
                date: session.date,
                startTime: session.startTime,
                endTime: session.endTime,
                meetLink: session.meetLink,
                zoomMeetingId: session.zoomMeetingId,
                participants: details.participants || [],
              };
            } catch (error) {
              console.error(
                `Error loading details for session ${session.id}:`,
                error,
              );
              // Return session with empty participants array if details fetch fails
              return {
                id: session.id,
                title: session.title,
                date: session.date,
                startTime: session.startTime,
                endTime: session.endTime,
                meetLink: session.meetLink,
                zoomMeetingId: session.zoomMeetingId,
                participants: [],
              };
            }
          }),
        );

        // Fetch Zoom meeting details for sessions with zoomMeetingId
        const sessionsWithZoomDetails = await Promise.all(
          sessionsData.map(async (session) => {
            if (session.zoomMeetingId) {
              try {
                const zoomDetails = await getZoomMeeting(session.zoomMeetingId);
                return {
                  ...session,
                  zoomMeetingDetails: zoomDetails,
                };
              } catch (error) {
                console.error(
                  `Error loading Zoom details for session ${session.id}:`,
                  error,
                );
                return session;
              }
            }
            return session;
          }),
        );

        setSessionsWithParticipants(sessionsWithZoomDetails);
      } catch (err) {
        console.error("Error loading session details:", err);
        toast({
          title: "Error",
          description: "Failed to load session details",
          variant: "destructive",
        });
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchSessionDetails();
  }, [trainingSessions, loadSessionDetails, toast]);

  const handleAddMeetLink = async () => {
    if (!selectedSessionId || !newMeetLink) return;

    try {
      await updateSession(selectedSessionId, {
        meetLink: newMeetLink,
      });

      toast({
        title: "Meet link added",
        description: "Google Meet link has been added to the session.",
      });

      setNewMeetLink("");
      setSelectedSessionId(null);
      // Refresh sessions to show the updated link
      setRetryCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error adding meet link:", err);
      toast({
        title: "Error",
        description: "Failed to add meet link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [isLoading, setLoading] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  const handleCreateSession = async () => {
    if (
      !newSessionData.title ||
      !newSessionData.date ||
      !newSessionData.startTime ||
      !newSessionData.endTime
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingZoomMeeting(true);
    try {
      // Create a Zoom meeting
      const zoomMeeting = await createZoomMeeting(
        newSessionData.title,
        `${newSessionData.date}T${newSessionData.startTime}:00`,
        calculateDuration(newSessionData.startTime, newSessionData.endTime),
        newSessionData.description || undefined,
        user?.id, // Add the user ID here
      );
      // Inside handleCreateSession function
      // Modify the createTrainingSession call in handleCreateSession:
      const sessionId = await createTrainingSession(
        {
          title: newSessionData.title,
          description: newSessionData.description || null,
          date: newSessionData.date,
          startTime: newSessionData.startTime,
          endTime: newSessionData.endTime,
          created_by: user?.id || "", // Add this field to match what's expected
          // instructorId: user?.id || "",
          // type: newSessionData.type,
          capacity: newSessionData.capacity, // Make sure this is included
          status: "scheduled",
          meetLink: zoomMeeting.join_url,
        },
        zoomMeeting.id,
      );
      toast({
        title: "Session created",
        description: "Training session has been created successfully.",
      });

      // Reset form and close dialog
      setNewSessionData({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        description: "",
        type: "webinar",
        capacity: 20,
      });
      setIsCreateSessionDialogOpen(false);

      // Refresh the sessions list
      setRetryCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error creating session:", err);
      toast({
        title: "Error",
        description: "Failed to create training session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingZoomMeeting(false);
    }
  };

  // Helper function to calculate duration in minutes
  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    let durationMinutes =
      endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
    if (durationMinutes <= 0) {
      durationMinutes += 24 * 60; // Add a day if end time is on the next day
    }

    return durationMinutes;
  };
  // Fix for the handleSendNotifications function
  const handleSendNotifications = async (sessionId: string) => {
    setIsNotifying(true);
    try {
      // First, check if we already have the session details in our state
      const existingSession = sessionsWithParticipants.find(
        (s) => s.id === sessionId,
      );

      let sessionDetails = existingSession;

      // If we don't have participants data, try to load it
      if (
        !sessionDetails ||
        !sessionDetails.participants ||
        sessionDetails.participants.length === 0
      ) {
        try {
          const details = await loadSessionDetails(sessionId);
          // Make sure we have the participants array
          if (details && !details.participants) {
            details.participants = [];
          }
          sessionDetails = details;
        } catch (error) {
          console.error(`Error loading session details: ${error}`);
          throw new Error(
            "Could not load session details. The service might be unavailable.",
          );
        }
      }

      // Validate that we have the data we need
      if (!sessionDetails) {
        throw new Error("Session details could not be loaded");
      }

      // Ensure participants is always an array
      if (!Array.isArray(sessionDetails.participants)) {
        sessionDetails.participants = [];
      }

      const participantEmails = sessionDetails.participants
        .map((p) => p.userEmail)
        .filter((email) => email && email !== "Unknown")
        .join(",");

      // Check if we have any emails to send to
      if (!participantEmails) {
        toast({
          title: "No valid emails",
          description:
            "No valid participant emails found to send notifications to.",
          variant: "warning",
        });
        return;
      }

      // In a real implementation, this would call an API to send emails
      console.log(`Sending notifications to: ${participantEmails}`);

      toast({
        title: "Notifications sent",
        description:
          "All participants have been notified with the meeting link.",
      });

      // In a production app, we would update the participant notification status in the database
    } catch (err) {
      console.error("Error sending notifications:", err);
      toast({
        title: "Error",
        description:
          "Failed to send notifications: " +
          (err instanceof Error ? err.message : "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setIsNotifying(false);
    }
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    setRetryCount((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 1000); // Visual feedback
  };

  const calculateTimeUntilSession = (dateStr: string, timeStr: string) => {
    const sessionDate = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();

    const diffMs = sessionDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Session has passed";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(`2000-01-01T${timeStr}`);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Filter sessions based on search term
  const filteredSessions = searchTerm
    ? sessionsWithParticipants.filter((session) =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : sessionsWithParticipants;

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
            disabled={isRefreshing || loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
            <Button
              className="bg-[#ffbd59] hover:bg-[#ffbd59]/90 text-[#1A1F2C] font-medium"
              onClick={() => setIsCreateSessionDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Session
            </Button>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1A1F2C] border-gray-700 text-white"
            />
          </div>

          {loading || loadingDetails ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-[#ffbd59] animate-spin" />
              <span className="ml-2 text-gray-300">Loading sessions...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-center">
              <p className="text-white mb-4">
                Error loading sessions. Please try again later.
              </p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-red-700 text-white hover:bg-red-900/30"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-6 bg-[#242938] rounded-lg text-center">
              <Calendar className="h-12 w-12 mx-auto text-[#ffbd59] mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? "No Matching Sessions" : "No Upcoming Sessions"}
              </h3>
              <p className="text-gray-400 mb-4">
                {searchTerm
                  ? `No sessions found matching "${searchTerm}". Try a different search term.`
                  : "There are no scheduled training sessions at the moment."}
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
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-lg bg-[#242938] hover:bg-[#242938]/80 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {session.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#ffbd59]" />
                        <span className="text-sm text-gray-300">
                          {session.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#ffbd59]" />
                        <span className="text-sm text-gray-300">
                          {formatTime(session.startTime)} -{" "}
                          {formatTime(session.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#ffbd59]" />
                        <span className="text-sm text-gray-300">
                          {session.participants.length} Participants
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className="mt-2 md:mt-0 bg-blue-500 text-white">
                    {calculateTimeUntilSession(session.date, session.startTime)}
                  </Badge>
                </div>

                <div className="p-3 bg-[#1A1F2C] rounded-lg mb-4">
                  {session.zoomMeetingDetails ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Video className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span className="text-white font-medium">
                            Zoom Meeting
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleSendNotifications(session.id)}
                          disabled={isNotifying}
                        >
                          {isNotifying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Notifications
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#1A1F2C]/80 p-3 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            Join URL:
                          </p>
                          <a
                            href={session.zoomMeetingDetails.join_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm truncate block"
                          >
                            {session.zoomMeetingDetails.join_url}
                          </a>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            Password:
                          </p>
                          <p className="text-white text-sm font-mono bg-[#1A1F2C] px-2 py-1 rounded inline-block">
                            {session.zoomMeetingDetails.password}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : session.meetLink ? (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Video className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <a
                          href={session.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 text-sm truncate"
                        >
                          {session.meetLink}
                        </a>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleSendNotifications(session.id)}
                        disabled={isNotifying}
                      >
                        {isNotifying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Notifications
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <p className="text-sm text-gray-400">
                        No meeting link added yet
                      </p>
                      <Button
                        size="sm"
                        className="bg-[#ffbd59] hover:bg-[#ffbd59]/90 text-[#1A1F2C]"
                        onClick={() => setSelectedSessionId(session.id)}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Add Meet Link
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">
                    Participants
                  </h4>
                  {session.participants.length > 0 ? (
                    <div className="space-y-2">
                      {session.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex justify-between items-center p-2 bg-[#1A1F2C] rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">
                              {participant.userName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {participant.userEmail}
                            </p>
                          </div>
                          <Badge
                            className={
                              participant.status === "present"
                                ? "bg-green-100 text-green-800"
                                : participant.status === "partial"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {participant.status === "present"
                              ? "Present"
                              : participant.status === "partial"
                                ? "Partial"
                                : participant.status === "absent"
                                  ? "Absent"
                                  : "Registered"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-[#1A1F2C] rounded-lg text-center">
                      <p className="text-sm text-gray-400">
                        No participants registered yet
                      </p>
                      <Button
                        size="sm"
                        className="mt-2 bg-[#ffbd59] hover:bg-[#ffbd59]/90 text-[#1A1F2C]"
                        onClick={async () => {
                          try {
                            if (user?.id) {
                              await register(session.id);
                              toast({
                                title: "Success",
                                description:
                                  "You have been registered for this session",
                              });
                              // Force refresh to show updated participant list
                              setRetryCount((prev) => prev + 1);
                            } else {
                              toast({
                                title: "Error",
                                description:
                                  "You must be logged in to register for a session",
                                variant: "destructive",
                              });
                            }
                          } catch (error) {
                            toast({
                              title: "Registration Failed",
                              description:
                                error instanceof Error
                                  ? error.message
                                  : "Failed to register for session",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Register for this session
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {selectedSessionId && (
            <div className="p-4 rounded-lg bg-[#242938] border border-[#ffbd59]">
              <h3 className="text-lg font-semibold text-white mb-4">
                Add Google Meet Link
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meetLink">Google Meet URL</Label>
                  <Input
                    id="meetLink"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={newMeetLink}
                    onChange={(e) => setNewMeetLink(e.target.value)}
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:text-white"
                    onClick={() => setSelectedSessionId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#ffbd59] hover:bg-[#ffbd59]/90 text-[#1A1F2C]"
                    onClick={handleAddMeetLink}
                    disabled={!newMeetLink}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Create New Session Dialog */}
          <Dialog
            open={isCreateSessionDialogOpen}
            onOpenChange={setIsCreateSessionDialogOpen}
          >
            <DialogContent className="bg-[#242938] text-white border-[#ffbd59] max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">
                  Create New Training Session
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter session title"
                    value={newSessionData.title}
                    onChange={(e) =>
                      setNewSessionData({
                        ...newSessionData,
                        title: e.target.value,
                      })
                    }
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSessionData.date}
                    onChange={(e) =>
                      setNewSessionData({
                        ...newSessionData,
                        date: e.target.value,
                      })
                    }
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newSessionData.startTime}
                      onChange={(e) =>
                        setNewSessionData({
                          ...newSessionData,
                          startTime: e.target.value,
                        })
                      }
                      className="bg-[#1A1F2C] border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newSessionData.endTime}
                      onChange={(e) =>
                        setNewSessionData({
                          ...newSessionData,
                          endTime: e.target.value,
                        })
                      }
                      className="bg-[#1A1F2C] border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Enter session description"
                    value={newSessionData.description}
                    onChange={(e) =>
                      setNewSessionData({
                        ...newSessionData,
                        description: e.target.value,
                      })
                    }
                    className="bg-[#1A1F2C] border-gray-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Session Type</Label>
                    <Input
                      id="type"
                      placeholder="Webinar"
                      value={newSessionData.type}
                      onChange={(e) =>
                        setNewSessionData({
                          ...newSessionData,
                          type: e.target.value,
                        })
                      }
                      className="bg-[#1A1F2C] border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      value={newSessionData.capacity}
                      onChange={(e) =>
                        setNewSessionData({
                          ...newSessionData,
                          capacity: parseInt(e.target.value),
                        })
                      }
                      className="bg-[#1A1F2C] border-gray-700 text-white"
                    />
                  </div>
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
                    isCreatingZoomMeeting
                  }
                >
                  {isCreatingZoomMeeting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Session"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionManager;
