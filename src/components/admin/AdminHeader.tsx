import React from "react";
import { Bell, Search, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const AdminHeader = ({
  title = "Dashboard",
  subtitle = "Overview of your platform",
  className,
}: AdminHeaderProps) => {
  return (
    <header
      className={`w-full bg-[#1A1F2C] border-b border-gray-800 px-6 py-4 ${className}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-gray-400">{subtitle}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-[#242938] border-gray-700 text-white w-64 focus:border-[#ffbd59] focus:ring-[#ffbd59]"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-[#242938]"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10 border-2 border-[#ffbd59]">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                    alt="Admin"
                  />
                  <AvatarFallback className="bg-[#242938] text-[#ffbd59]">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-[#242938] border-gray-700"
              align="end"
            >
              <DropdownMenuLabel className="text-white">
                Admin Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="text-gray-300 hover:bg-[#2A2F3C] hover:text-[#ffbd59] cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-[#2A2F3C] hover:text-[#ffbd59] cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="text-red-400 hover:bg-[#2A2F3C] hover:text-red-400 cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
