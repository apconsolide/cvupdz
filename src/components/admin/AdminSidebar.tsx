import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  BookOpen,
  Settings,
  BarChart,
  MessageSquare,
  LogOut,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
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

const AdminSidebar = ({ className = "" }: AdminSidebarProps) => {
  const { supabase } = useAuth();
  return (
    <aside
      className={cn(
        "w-[280px] h-full bg-cvup-blue text-white flex flex-col border-r border-gray-700",
        className,
      )}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="text-cvup-gold">CV</span>
          <span className="ml-1">UP</span>
          <span className="ml-2 text-sm bg-cvup-gold text-black px-2 py-0.5 rounded-md">
            Admin
          </span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">Administration Panel</p>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Dashboard
          </p>
          <nav className="space-y-1">
            <NavItem
              icon={<LayoutDashboard />}
              label="Overview"
              href="/admin"
              active={true}
            />
            <NavItem
              icon={<BarChart />}
              label="Analytics"
              href="/admin/analytics"
            />
          </nav>
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Management
          </p>
          <nav className="space-y-1">
            <NavItem icon={<Users />} label="Users" href="/admin/users" />
            <NavItem
              icon={<FileText />}
              label="CV Templates"
              href="/admin/cv-templates"
            />
            <NavItem
              icon={<Calendar />}
              label="Training Sessions"
              href="/admin/training-sessions"
            />
            <NavItem
              icon={<BookOpen />}
              label="Courses"
              href="/admin/courses"
            />
            <NavItem
              icon={<MessageSquare />}
              label="Feedback"
              href="/admin/feedback"
            />
            <NavItem
              icon={<Palette />}
              label="Design System"
              href="/design-system"
            />
          </nav>
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Settings
          </p>
          <nav className="space-y-1">
            <NavItem
              icon={<Settings />}
              label="General"
              href="/admin/settings"
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

export default AdminSidebar;
