import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RoleBasedRouteProps {
  requiredPermission: keyof UserPermissions;
  redirectTo?: string;
}

import { UserPermissions } from "@/types/auth";

const RoleBasedRoute = ({
  requiredPermission,
  redirectTo = "/dashboard",
}: RoleBasedRouteProps) => {
  const { user, permissions, loading, isConfigured } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-cvup-blue">
        <div className="text-cvup-gold text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated or Supabase is not configured, redirect to login
  if (!user || !isConfigured) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but doesn't have the required permission, redirect
  if (!permissions[requiredPermission]) {
    return <Navigate to={redirectTo} replace />;
  }

  // If authenticated and has the required permission, render the route
  return <Outlet />;
};

export default RoleBasedRoute;
