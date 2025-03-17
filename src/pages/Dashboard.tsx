import React from "react";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
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
import ModuleCards from "@/components/dashboard/ModuleCards";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { profile } = useProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userInitials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : user?.email?.substring(0, 2).toUpperCase() || "NU";

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="h-[70px] w-full bg-[#1A1F2C] border-b border-gray-800 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-2xl font-bold text-white mr-2">
          CV<span className="text-[#ffbd59]">UP</span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-[#242938] border-gray-700 text-white focus:border-[#ffbd59] focus:ring-[#ffbd59]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-[#242938]"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-[#ffbd59]">
                <AvatarImage
                  src={
                    profile?.avatar_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name || user?.email || "User"}`
                  }
                  alt={profile?.full_name || user?.email || "User"}
                />
                <AvatarFallback className="bg-[#242938] text-[#ffbd59]">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

const Sidebar = () => {
  const { profile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userInitials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : user?.email?.substring(0, 2).toUpperCase() || "NU";

  const isAdmin = profile?.role === "admin" || profile?.role === "supervisor";

  const menuItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard", active: true },
    { name: "CV Builder", icon: "📄", path: "/cv-builder" },
    { name: "Interview Prep", icon: "🎥", path: "/interview-prep" },
    { name: "LinkedIn", icon: "🔗", path: "/linkedin-enhancement" },
    { name: "Training", icon: "📚", path: "/training" },
  ];

  // Add admin menu items if user has admin role
  if (isAdmin) {
    menuItems.push(
      { name: "Admin", icon: "⚙️", path: "/admin" },
      { name: "Users", icon: "👥", path: "/admin/users" },
      { name: "Sessions", icon: "📅", path: "/admin/training-sessions" },
    );
  }

  return (
    <aside className="w-[280px] h-[calc(100vh-70px)] bg-[#1A1F2C] border-r border-gray-800 p-4 flex flex-col">
      <div className="mb-6">
        <div className="flex items-center space-x-3 p-3 bg-[#242938] rounded-lg">
          <Avatar className="h-10 w-10 border-2 border-[#ffbd59]">
            <AvatarImage
              src={
                profile?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name || user?.email || "User"}`
              }
              alt={profile?.full_name || user?.email || "User"}
            />
            <AvatarFallback className="bg-[#242938] text-[#ffbd59]">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium">
              {profile?.full_name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-gray-400 text-sm">
              {profile?.job_title || "CV UP Member"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.name}
            variant={item.active ? "default" : "ghost"}
            className={`w-full justify-start text-left ${item.active ? "bg-[#ffbd59] text-black" : "text-gray-300 hover:text-white hover:bg-[#242938]"}`}
            onClick={() => navigate(item.path)}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Button>
        ))}
      </div>

      <div className="mt-auto p-4 bg-[#242938] rounded-lg">
        <h3 className="text-white font-medium mb-2">Need Help?</h3>
        <p className="text-gray-400 text-sm mb-3">
          Contact our support team for assistance with your career development
          journey.
        </p>
        <Button
          className="w-full bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium"
          onClick={() => window.open("mailto:support@cvup.com", "_blank")}
        >
          Contact Support
        </Button>
      </div>
    </aside>
  );
};

const Dashboard = () => {
  const { profile, loading } = useProfile();
  const { user } = useAuth();

  const displayName =
    profile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-[#121620] text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  {loading ? "Loading..." : `Welcome back, ${displayName}!`}
                </h1>
                <p className="text-gray-400 mt-1">
                  Here's an overview of your career development progress
                </p>
              </div>
              <Button
                className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium"
                onClick={() => navigate("/cv-builder")}
              >
                Create New CV
              </Button>
            </div>

            <ModuleCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ProgressOverview className="lg:col-span-1" />
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
