import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  FileText,
  Video,
  Linkedin,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  className?: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon, label, href, active = false }: NavItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        "hover:bg-cvup-lightblue hover:text-cvup-gold",
        active ? "bg-cvup-lightblue text-cvup-gold" : "text-gray-300",
      )}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar = ({ className = "" }: SidebarProps) => {
  // Get current path to determine active link
  const currentPath = window.location.pathname;
  const { supabase, permissions } = useAuth();

  return (
    <aside
      className={cn(
        "w-[280px] h-[calc(100vh-70px)] bg-cvup-blue text-white flex flex-col border-r border-gray-700",
        className,
      )}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="text-cvup-gold">CV</span>
          <span className="ml-1">UP</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Career Development Platform
        </p>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Main
          </p>
          <nav className="space-y-1">
            <NavItem
              icon={<Home />}
              label="Dashboard"
              href="/dashboard"
              active={currentPath === "/dashboard"}
            />
          </nav>
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Modules
          </p>
          <nav className="space-y-1">
            <NavItem
              icon={<FileText />}
              label="CV Builder"
              href="/cv-builder"
              active={currentPath === "/cv-builder"}
            />
            <NavItem
              icon={<Video />}
              label="Interview Prep"
              href="/interview-prep"
              active={currentPath === "/interview-prep"}
            />
            <NavItem
              icon={<Linkedin />}
              label="LinkedIn Enhancement"
              href="/linkedin"
              active={currentPath === "/linkedin"}
            />
            <NavItem
              icon={<BookOpen />}
              label="Training"
              href="/training"
              active={currentPath === "/training"}
            />
            {permissions.canManageTrainingSessions && (
              <NavItem
                icon={<Video />}
                label="Session Management"
                href="/session-management"
                active={currentPath === "/session-management"}
              />
            )}
            <NavItem
              icon={<Download />}
              label="Chrome Extension"
              href="/chrome-extension"
              active={currentPath === "/chrome-extension"}
            />
          </nav>
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Support
          </p>
          <nav className="space-y-1">
            <NavItem
              icon={<Settings />}
              label="Settings"
              href="/settings"
              active={currentPath === "/settings"}
            />
            <NavItem
              icon={<HelpCircle />}
              label="Help & Support"
              href="/help"
              active={currentPath === "/help"}
            />
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => {
            supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-cvup-lightblue hover:text-cvup-gold transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
