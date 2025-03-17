import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronDown, Search, User, Video } from "lucide-react";
import { supabase } from "../../lib/supabaseClient"; // Adjust this import path to match your project structure

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
  userAvatar?: string;
}

interface UserProfile {
  id?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  // Add other profile fields as needed
}

const Navbar = ({ userAvatar = "" }: NavbarProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get the current authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        if (!user) {
          setLoading(false);
          return; // No authenticated user
        }
        
        // Fetch the user's profile from the profiles table
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role' )
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        setUserProfile(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
const getUserInitials = () => {
  if (!userProfile || (!userProfile.full_name && !userProfile.role)) return '';
  
  // Use full_name if available, otherwise use role
  const textForInitials = userProfile.full_name || userProfile.role || '';
  
  return textForInitials
    .split(" ")
    .map((name) => name[0])
    .join("");
};

// Username to display - use full_name, then fall back to role, then to Loading...
const displayName = userProfile?.full_name || userProfile?.role || 'Loading...';

// User avatar to display - use avatar_url from profile or fallback to prop
const displayAvatar = userProfile?.avatar_url || userAvatar
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
          <Link
            to="/session-management"
            className="text-white hover:text-cvup-gold transition-colors"
          >
            Sessions
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
                <AvatarImage src={displayAvatar} alt={displayName} />
                <AvatarFallback className="bg-cvup-lightblue text-cvup-gold">
                  {getUserInitials()}
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
              <Video className="mr-2 h-4 w-4" />
              <span>My Sessions</span>
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
