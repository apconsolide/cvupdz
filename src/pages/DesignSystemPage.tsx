import React from "react";
import DesignSystem from "@/components/ui/design-system";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const DesignSystemPage = () => {
  const { user, permissions } = useAuth();

  // Only allow admins and supervisors to access the design system
  if (!user || !permissions.canAccessAdminPanel) {
    return <Navigate to="/dashboard" replace />;
  }

  return <DesignSystem />;
};

export default DesignSystemPage;
