import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TrainingSession {
  id: string;
  title: string;
  date: string;
  time: string;
  instructor: string;
  type: "excel" | "soft-skills" | "french" | "english";
  capacity: number;
  enrolled: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

interface TrainingSessionTableProps {
  sessions?: TrainingSession[];
  className?: string;
}

const TrainingSessionTable = ({
  sessions = defaultSessions,
  className,
}: TrainingSessionTableProps) => {
  const getTypeBadge = (type: TrainingSession["type"]) => {
    switch (type) {
      case "excel":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Excel
          </Badge>
        );
      case "soft-skills":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Soft Skills
          </Badge>
        );
      case "french":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            French
          </Badge>
        );
      case "english":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            English
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TrainingSession["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Scheduled
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full overflow-auto ${className}`}>
      <Table className="border-collapse w-full">
        <TableHeader className="bg-[#1A1F2C]">
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-300 font-semibold">
              Session
            </TableHead>
            <TableHead className="text-gray-300 font-semibold">Type</TableHead>
            <TableHead className="text-gray-300 font-semibold">
              Date & Time
            </TableHead>
            <TableHead className="text-gray-300 font-semibold">
              Instructor
            </TableHead>
            <TableHead className="text-gray-300 font-semibold">
              Enrollment
            </TableHead>
            <TableHead className="text-gray-300 font-semibold">
              Status
            </TableHead>
            <TableHead className="text-gray-300 font-semibold text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow
              key={session.id}
              className="border-b border-gray-700 hover:bg-[#242938] transition-colors"
            >
              <TableCell className="py-4">
                <p className="font-medium text-white">{session.title}</p>
              </TableCell>
              <TableCell>{getTypeBadge(session.type)}</TableCell>
              <TableCell className="text-gray-300">
                <p>{session.date}</p>
                <p className="text-sm text-gray-400">{session.time}</p>
              </TableCell>
              <TableCell className="text-gray-300">
                {session.instructor}
              </TableCell>
              <TableCell className="text-gray-300">
                <p>
                  {session.enrolled}/{session.capacity}
                </p>
                <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-[#ffbd59] rounded-full"
                    style={{
                      width: `${(session.enrolled / session.capacity) * 100}%`,
                    }}
                  />
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(session.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#2A3042]"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#242938] border-gray-700"
                  >
                    <DropdownMenuLabel className="text-white">
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="text-gray-300 hover:bg-[#2A3042] hover:text-[#ffbd59] cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 hover:bg-[#2A3042] hover:text-[#ffbd59] cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400 hover:bg-[#2A3042] hover:text-red-400 cursor-pointer">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Cancel</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const defaultSessions: TrainingSession[] = [
  {
    id: "1",
    title: "Advanced Excel for Professionals",
    date: "June 15, 2023",
    time: "10:00 AM - 2:00 PM",
    instructor: "Ahmed Kaddour",
    type: "excel",
    capacity: 25,
    enrolled: 18,
    status: "scheduled",
  },
  {
    id: "2",
    title: "Communication Skills Workshop",
    date: "June 18, 2023",
    time: "1:00 PM - 4:00 PM",
    instructor: "Leila Benali",
    type: "soft-skills",
    capacity: 20,
    enrolled: 15,
    status: "scheduled",
  },
  {
    id: "3",
    title: "Business French for Beginners",
    date: "June 20, 2023",
    time: "9:00 AM - 12:00 PM",
    instructor: "Marie Dubois",
    type: "french",
    capacity: 15,
    enrolled: 10,
    status: "in-progress",
  },
  {
    id: "4",
    title: "English for Job Interviews",
    date: "June 22, 2023",
    time: "2:00 PM - 5:00 PM",
    instructor: "John Smith",
    type: "english",
    capacity: 20,
    enrolled: 12,
    status: "scheduled",
  },
  {
    id: "5",
    title: "Excel Data Analysis",
    date: "June 10, 2023",
    time: "9:00 AM - 1:00 PM",
    instructor: "Ahmed Kaddour",
    type: "excel",
    capacity: 25,
    enrolled: 25,
    status: "completed",
  },
];

export default TrainingSessionTable;
