import React from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TrainingSession {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  capacity: number;
  enrolled: number;
  type: "excel" | "soft-skills" | "french" | "english";
  description: string;
}

interface TrainingScheduleProps {
  sessions?: TrainingSession[];
  className?: string;
}

const getSessionBadge = (type: TrainingSession["type"]) => {
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

const TrainingSchedule = ({
  sessions = defaultSessions,
  className,
}: TrainingScheduleProps) => {
  return (
    <Card
      className={`w-full bg-[#1A1F2C] text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#ffbd59]" />
          Upcoming Training Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-lg bg-[#242938] hover:bg-[#2A3042] transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {session.title}
                </h3>
                {getSessionBadge(session.type)}
              </div>

              <p className="text-sm text-gray-300 mb-3">
                {session.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#ffbd59]" />
                  <span className="text-sm text-gray-300">{session.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#ffbd59]" />
                  <span className="text-sm text-gray-300">{session.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#ffbd59]" />
                  <span className="text-sm text-gray-300">
                    {session.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#ffbd59]" />
                  <span className="text-sm text-gray-300">
                    {session.enrolled}/{session.capacity} Participants
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  Instructor: {session.instructor}
                </span>
                <Button
                  className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium"
                  size="sm"
                >
                  Enroll Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const defaultSessions: TrainingSession[] = [
  {
    id: "1",
    title: "Advanced Excel for Professionals",
    date: "June 15, 2023",
    time: "10:00 AM - 2:00 PM",
    location: "Online (Zoom)",
    instructor: "Ahmed Kaddour",
    capacity: 25,
    enrolled: 18,
    type: "excel",
    description:
      "Master advanced Excel functions, pivot tables, and data analysis techniques for professional use.",
  },
  {
    id: "2",
    title: "Communication Skills Workshop",
    date: "June 18, 2023",
    time: "1:00 PM - 4:00 PM",
    location: "CV UP Training Center, Algiers",
    instructor: "Leila Benali",
    capacity: 20,
    enrolled: 15,
    type: "soft-skills",
    description:
      "Develop effective communication skills for professional environments and team collaboration.",
  },
  {
    id: "3",
    title: "Business French for Beginners",
    date: "June 20, 2023",
    time: "9:00 AM - 12:00 PM",
    location: "Online (Zoom)",
    instructor: "Marie Dubois",
    capacity: 15,
    enrolled: 10,
    type: "french",
    description:
      "Learn essential French vocabulary and phrases for business communication and professional settings.",
  },
  {
    id: "4",
    title: "English for Job Interviews",
    date: "June 22, 2023",
    time: "2:00 PM - 5:00 PM",
    location: "CV UP Training Center, Oran",
    instructor: "John Smith",
    capacity: 20,
    enrolled: 12,
    type: "english",
    description:
      "Practice English interview skills, common questions, and professional vocabulary for job seekers.",
  },
];

export default TrainingSchedule;
