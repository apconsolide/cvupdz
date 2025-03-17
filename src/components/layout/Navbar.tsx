import React from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronDown, Search, User } from "lucide-react";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface NavbarProps {
  userName?: string;
  userAvatar?: string;
}

import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/context/AuthContext";

const Navbar = ({ userName, userAvatar }: NavbarProps) => {
  const { profile } = useProfile();
  const { user } = useAuth();

  // Use profile data if available, otherwise fallback to props or defaults
  const displayName =
    profile?.full_name || userName || user?.email?.split("@")[0] || "User";
  const avatarUrl =
    userAvatar ||
    profile?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
  return (
    <nav className="w-full h-[70px] bg-cvup-blue border-b border-gray-700 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <span className="text-cvup-gold font-bold text-2xl mr-2">CV</span>
          <span className="text-white font-bold text-2xl">UP</span>
        </Link>

        <div className="hidden md:flex ml-10 space-x-6">
          <Link
            to="/dashboard"
            className="text-white hover:text-cvup-gold transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/cv-builder"
            className="text-white hover:text-cvup-gold transition-colors"
          >
            CV Builder
          </Link>
          <Link
            to="/interview-prep"
            className="text-white hover:text-cvup-gold transition-colors"
          >
            Interview Prep
          </Link>
          <Link
            to="/linkedin"
            className="text-white hover:text-cvup-gold transition-colors"
          >
            LinkedIn
          </Link>
          <Link
            to="/training"
            className="text-white hover:text-cvup-gold transition-colors"
          >
            Training
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full text-sm w-48 focus:outline-none focus:ring-2 focus:ring-cvup-gold"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-white"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-white hover:bg-gray-800"
            >
              <Avatar className="h-8 w-8 border-2 border-cvup-gold">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-cvup-lightblue text-cvup-gold">
                  {displayName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{displayName}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#242938] border-gray-800 text-white"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="hover:bg-cvup-lightblue hover:text-cvup-gold cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-cvup-lightblue hover:text-cvup-gold cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem className="hover:bg-cvup-lightblue cursor-pointer text-red-400">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
