import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { useTraining } from "@/hooks/useTraining";

interface UpcomingTraining {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  capacity: number;
  enrolled: number;
  type: string;
  description: string;
}

interface UpcomingTrainingsProps {
  trainings?: UpcomingTraining[];
  onViewAll?: () => void;
  onEnroll?: (trainingId: string) => void;
  className?: string;
}

const UpcomingTrainings = ({
  trainings = [],

  onViewAll,
  onEnroll,
  className,
}: UpcomingTrainingsProps) => {
  const getSessionBadge = (type: string) => {
    switch (type) {
      case "excel":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Skill it Up - Excel
          </Badge>
        );
      case "soft-skills":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Skills Up
          </Badge>
        );
      case "french":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Skill it Up - French
          </Badge>
        );
      case "english":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Skill it Up - English
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Training
          </Badge>
        );
    }
  };

  const { sessions, loading: sessionsLoading } = useTraining();
  const [formattedSessions, setFormattedSessions] = useState<
    UpcomingTraining[]
  >([]);

  useEffect(() => {
    if (sessionsLoading) return;

    // Format sessions into the expected structure
    const formatted = sessions
      .filter((session) => {
        // Only show future sessions
        const sessionDate = new Date(`${session.date}T${session.startTime}`);
        return sessionDate > new Date();
      })
      .map((session) => ({
        id: session.id,
        title: session.title,
        date: new Date(session.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        time: `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`,
        location: session.location || "Online (Zoom)",
        instructor: session.instructorName || "CV UP Instructor",
        capacity: session.maxParticipants || 20,
        enrolled: session.enrolled || 0,
        type: determineSessionType(session.title),
        description:
          session.description ||
          "Join this training session to enhance your professional skills.",
      }));

    setFormattedSessions(formatted);
  }, [sessions, sessionsLoading]);

  // Helper function to determine session type based on title
  const determineSessionType = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("excel")) return "excel";
    if (lowerTitle.includes("communication") || lowerTitle.includes("soft"))
      return "soft-skills";
    if (lowerTitle.includes("french")) return "french";
    if (lowerTitle.includes("english")) return "english";
    return "training";
  };

  // Helper function to format time
  const formatTime = (timeStr: string): string => {
    try {
      const date = new Date(`2000-01-01T${timeStr}`);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return timeStr;
    }
  };

  const displayTrainings =
    formattedSessions.length > 0 ? formattedSessions : trainings;

  return (
    <Card
      className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-cvup-gold" />
          Upcoming Live Sessions
        </CardTitle>
        {onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            className="text-cvup-gold hover:text-cvup-gold/80 hover:bg-cvup-lightblue"
            onClick={onViewAll}
          >
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {trainings.length === 0 ? (
          <div className="p-6 bg-cvup-lightblue rounded-lg text-center">
            <Calendar className="h-12 w-12 mx-auto text-cvup-gold mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Sessions</h3>
            <p className="text-gray-400 mb-4">
              There are no upcoming live training sessions scheduled at the
              moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTrainings.map((training) => (
              <div
                key={training.id}
                className="p-4 rounded-lg bg-cvup-lightblue hover:bg-[#2A3042] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {training.title}
                  </h3>
                  {getSessionBadge(training.type)}
                </div>

                <p className="text-sm text-gray-300 mb-3">
                  {training.description}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cvup-gold" />
                    <span className="text-sm text-gray-300">
                      {training.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cvup-gold" />
                    <span className="text-sm text-gray-300">
                      {training.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cvup-gold" />
                    <span className="text-sm text-gray-300">
                      {training.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cvup-gold" />
                    <span className="text-sm text-gray-300">
                      {training.enrolled}/{training.capacity} Participants
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Instructor: {training.instructor}
                  </span>
                  <Button
                    className="bg-cvup-gold hover:bg-cvup-gold/90 text-black font-medium"
                    size="sm"
                    onClick={() => onEnroll && onEnroll(training.id)}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingTrainings;
