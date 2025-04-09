import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Download, Clock, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTraining } from "@/hooks/useTraining";
import { SessionParticipant } from "@/lib/api/training";
import { useToast } from "@/components/ui/use-toast";

interface AttendanceReportProps {
  sessionId?: string;
  sessionTitle?: string;
  sessionDate?: string;
  sessionTime?: string;
  className?: string;
}

const AttendanceReport = ({
  sessionId = "default-session",
  sessionTitle = "Advanced Excel for Professionals",
  sessionDate = "June 15, 2023",
  sessionTime = "10:00 AM - 2:00 PM",
  className,
}: AttendanceReportProps) => {
  const { loadSessionParticipants, participants, loading } = useTraining();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "attendance">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    // Load participants when component mounts or sessionId changes
    loadSessionParticipants(sessionId);
  }, [sessionId, loadSessionParticipants]);

  // Filter participants based on search term
  const filteredParticipants = participants.filter((participant) => {
    const searchString =
      `${participant.user_name} ${participant.user_email}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Sort participants based on sort criteria
  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    if (sortBy === "name") {
      return sortDirection === "asc"
        ? a.user_name.localeCompare(b.user_name)
        : b.user_name.localeCompare(a.user_name);
    } else {
      // Sort by attendance percentage
      const aPercentage = a.attendance_percentage || 0;
      const bPercentage = b.attendance_percentage || 0;
      return sortDirection === "asc"
        ? aPercentage - bPercentage
        : bPercentage - aPercentage;
    }
  });

  // Toggle sort direction or change sort field
  const toggleSort = (field: "name" | "attendance") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

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
    participants.length > 0
      ? participants.reduce(
          (sum, p) => sum + (p.attendance_percentage || 0),
          0,
        ) / totalParticipants
      : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to export attendance data to CSV
  const exportToCSV = async () => {
    if (participants.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no participants to include in the report.",
        variant: "destructive",
      });
      return;
    }

    try {
      setExportLoading(true);

      // Create CSV header
      const headers = [
        "Name",
        "Email",
        "Status",
        "Join Time",
        "Leave Time",
        "Attendance Percentage",
      ];

      // Format participant data for CSV
      const data = sortedParticipants.map((participant) => [
        participant.userName,
        participant.userEmail,
        participant.status,
        participant.joinTime
          ? new Date(participant.joinTime).toLocaleString()
          : "-",
        participant.leaveTime
          ? new Date(participant.leaveTime).toLocaleString()
          : "-",
        `${participant.attendancePercentage || 0}%`,
      ]);

      // Combine headers and data
      const csvContent = [
        headers.join(","),
        ...data.map((row) => row.join(",")),
      ].join("\n");

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `attendance_report_${sessionId}_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Attendance report has been downloaded as a CSV file.",
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the attendance report.",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
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
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search participants..."
                className="pl-8 bg-cvup-lightblue border-gray-700 text-white w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
              onClick={exportToCSV}
              disabled={exportLoading || loading || participants.length === 0}
            >
              {exportLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin">↻</span>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </>
              )}
            </Button>
          </div>
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

            {loading ? (
              <div className="text-center py-8 text-gray-400">
                Loading participant data...
              </div>
            ) : sortedParticipants.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No participants found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th
                        className="text-left py-3 px-4 text-gray-300 font-semibold cursor-pointer"
                        onClick={() => toggleSort("name")}
                      >
                        Participant{" "}
                        {sortBy === "name" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
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
                      <th
                        className="text-left py-3 px-4 text-gray-300 font-semibold cursor-pointer"
                        onClick={() => toggleSort("attendance")}
                      >
                        Attendance{" "}
                        {sortBy === "attendance" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedParticipants.map((participant) => (
                      <tr
                        key={participant.id}
                        className="border-b border-gray-700 hover:bg-[#2A3042]"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-white">
                              {participant.user_name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {participant.user_email}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(participant.status || "unknown")}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {formatTime(participant.join_time)}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {formatTime(participant.leave_time)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={participant.attendance_percentage || 0}
                              className="h-2 w-24"
                            />
                            <span className="text-sm text-gray-300">
                              {participant.attendance_percentage || 0}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceReport;
