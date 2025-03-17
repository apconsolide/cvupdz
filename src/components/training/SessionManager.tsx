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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useTraining } from "@/hooks/useTraining";
import { useAuth } from "@/context/AuthContext";
import { TrainingSession, SessionParticipant } from "@/lib/api/training";

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
  }, [loadSessionsByStatus, toast]);

  // Load session details for each session
  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!trainingSessions.length) return;

      setLoadingDetails(true);
      try {
        const sessionsData = await Promise.all(
          trainingSessions.map(async (session) => {
            const details = await loadSessionDetails(session.id);
            return {
              id: session.id,
              title: session.title,
              date: session.date,
              startTime: session.startTime,
              endTime: session.endTime,
              meetLink: session.meetLink,
              participants: details.participants || [],
            };
          }),
        );

        setSessionsWithParticipants(sessionsData);
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
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add meet link",
        variant: "destructive",
      });
    }
  };

  const handleSendNotifications = async (sessionId: string) => {
    setLoading(true);
    try {
      // Get the session participants
      const sessionDetails = await loadSessionDetails(sessionId);
      const participantEmails = sessionDetails.participants
        .map((p) => p.userEmail)
        .join(",");

      // In a real implementation, this would call an API to send emails
      // For demonstration, we'll log the emails and show a toast
      console.log(`Sending notifications to: ${participantEmails}`);

      toast({
        title: "Notifications sent",
        description:
          "All participants have been notified with the Google Meet link.",
      });

      // In a production app, we would update the participant notification status in the database
    } catch (err) {
      console.error("Error sending notifications:", err);
      toast({
        title: "Error",
        description: "Failed to send notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  return (
    <Card
      className={`w-full bg-[#1A1F2C] text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Video className="h-5 w-5 text-[#ffbd59]" />
          Session Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
            <Button className="bg-[#ffbd59] hover:bg-[#ffbd59]/90 text-[#1A1F2C] font-medium">
              <LinkIcon className="mr-2 h-4 w-4" />
              Create New Session
            </Button>
          </div>

          {loading || loadingDetails ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-[#ffbd59] animate-spin" />
              <span className="ml-2 text-gray-300">Loading sessions...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-center">
              <p className="text-white">
                Error loading sessions. Please try again later.
              </p>
            </div>
          ) : sessionsWithParticipants.length === 0 ? (
            <div className="p-6 bg-[#242938] rounded-lg text-center">
              <Calendar className="h-12 w-12 mx-auto text-[#ffbd59] mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Upcoming Sessions
              </h3>
              <p className="text-gray-400 mb-4">
                There are no scheduled training sessions at the moment.
              </p>
            </div>
          ) : (
            sessionsWithParticipants.map((session) => (
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
                  {session.meetLink ? (
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
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Notifications
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <p className="text-sm text-gray-400">
                        No Google Meet link added yet
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
                        onClick={() => register(session.id)}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionManager;
