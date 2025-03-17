import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Download, Clock, Calendar } from "lucide-react";

interface AttendanceReportProps {
  sessionId?: string;
  sessionTitle?: string;
  sessionDate?: string;
  sessionTime?: string;
  participants?: {
    id: string;
    name: string;
    email: string;
    attendancePercentage: number;
    joinTime?: string;
    leaveTime?: string;
    status: "present" | "partial" | "absent";
  }[];
  className?: string;
}

const AttendanceReport = ({
  sessionId = "1",
  sessionTitle = "Advanced Excel for Professionals",
  sessionDate = "June 15, 2023",
  sessionTime = "10:00 AM - 2:00 PM",
  participants = [
    {
      id: "p1",
      name: "Ahmed Benali",
      email: "ahmed.b@example.com",
      attendancePercentage: 95,
      joinTime: "9:58 AM",
      leaveTime: "2:00 PM",
      status: "present" as const,
    },
    {
      id: "p2",
      name: "Leila Mansouri",
      email: "leila.m@example.com",
      attendancePercentage: 65,
      joinTime: "10:45 AM",
      leaveTime: "1:30 PM",
      status: "partial" as const,
    },
    {
      id: "p3",
      name: "Karim Hadj",
      email: "karim.h@example.com",
      attendancePercentage: 0,
      status: "absent" as const,
    },
    {
      id: "p4",
      name: "Amina Berrada",
      email: "amina.b@example.com",
      attendancePercentage: 85,
      joinTime: "10:05 AM",
      leaveTime: "1:45 PM",
      status: "present" as const,
    },
    {
      id: "p5",
      name: "Youssef Alami",
      email: "youssef.a@example.com",
      attendancePercentage: 40,
      joinTime: "11:20 AM",
      leaveTime: "12:45 PM",
      status: "partial" as const,
    },
  ],
  className,
}: AttendanceReportProps) => {
  // Calculate overall attendance statistics
  const totalParticipants = participants.length;
  const presentCount = participants.filter(
    (p) => p.status === "present",
  ).length;
  const partialCount = participants.filter(
    (p) => p.status === "partial",
  ).length;
  const absentCount = participants.filter((p) => p.status === "absent").length;

  const averageAttendance =
    participants.reduce((sum, p) => sum + p.attendancePercentage, 0) /
    totalParticipants;

  const getStatusBadge = (status: "present" | "partial" | "absent") => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card
      className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-cvup-gold" />
            Attendance Report
          </CardTitle>
          <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-cvup-lightblue">
            <h3 className="text-lg font-semibold text-white mb-4">
              {sessionTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cvup-gold" />
                <span className="text-sm text-gray-300">{sessionDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cvup-gold" />
                <span className="text-sm text-gray-300">{sessionTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cvup-gold" />
                <span className="text-sm text-gray-300">
                  {totalParticipants} Participants
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-[#1A1F2C] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Average Attendance</p>
                <div className="flex items-end justify-between">
                  <h4 className="text-2xl font-bold text-white">
                    {Math.round(averageAttendance)}%
                  </h4>
                  <Progress value={averageAttendance} className="h-2 w-24" />
                </div>
              </div>

              <div className="p-4 bg-[#1A1F2C] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Attendance Status</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-green-500">{presentCount}</span>
                    <span className="text-yellow-500">{partialCount}</span>
                    <span className="text-red-500">{absentCount}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#1A1F2C] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Session ID</p>
                <p className="text-sm font-mono bg-[#242938] p-1 rounded">
                  {sessionId}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Participant Details</h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Participant
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Join Time
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Leave Time
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-b border-gray-700 hover:bg-[#2A3042]"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-white">
                            {participant.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {participant.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(participant.status)}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {participant.joinTime || "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {participant.leaveTime || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={participant.attendancePercentage}
                            className="h-2 w-24"
                          />
                          <span className="text-sm text-gray-300">
                            {participant.attendancePercentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceReport;
