import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "premium";
  status: "active" | "inactive" | "pending";
  joinDate: string;
  avatar?: string;
  initials: string;
}

interface UserTableProps {
  users?: User[];
  className?: string;
}

const UserTable = ({ users = defaultUsers, className }: UserTableProps) => {
  const getRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Admin
          </Badge>
        );
      case "premium":
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
          Premium
        </Badge>;
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            User
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
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
            <TableHead className="text-gray-300 font-semibold">User</TableHead>
            <TableHead className="text-gray-300 font-semibold">Role</TableHead>
            <TableHead className="text-gray-300 font-semibold">
              Status
            </TableHead>
            <TableHead className="text-gray-300 font-semibold">
              Joined
            </TableHead>
            <TableHead className="text-gray-300 font-semibold text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="border-b border-gray-700 hover:bg-[#242938] transition-colors"
            >
              <TableCell className="py-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border-2 border-[#ffbd59]">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-[#2A3042] text-[#ffbd59]">
                        {user.initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell className="text-gray-300">{user.joinDate}</TableCell>
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
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400 hover:bg-[#2A3042] hover:text-red-400 cursor-pointer">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
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

const defaultUsers: User[] = [
  {
    id: "1",
    name: "Ahmed Benali",
    email: "ahmed.benali@example.com",
    role: "admin",
    status: "active",
    joinDate: "Jan 10, 2023",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    initials: "AB",
  },
  {
    id: "2",
    name: "Leila Mansouri",
    email: "leila.m@example.com",
    role: "user",
    status: "active",
    joinDate: "Feb 15, 2023",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leila",
    initials: "LM",
  },
  {
    id: "3",
    name: "Karim Hadj",
    email: "karim.h@example.com",
    role: "premium",
    status: "active",
    joinDate: "Mar 22, 2023",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim",
    initials: "KH",
  },
  {
    id: "4",
    name: "Amina Berrada",
    email: "amina.b@example.com",
    role: "user",
    status: "inactive",
    joinDate: "Apr 5, 2023",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina",
    initials: "AB",
  },
  {
    id: "5",
    name: "Youssef Alami",
    email: "youssef.a@example.com",
    role: "user",
    status: "pending",
    joinDate: "May 18, 2023",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef",
    initials: "YA",
  },
];

export default UserTable;
