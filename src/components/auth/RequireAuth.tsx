import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RequireAuthProps {
  children: JSX.Element;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-cvup-blue">
        <div className="text-cvup-gold text-xl">Loading...</div>
      </div>
    );
  }

  if (!isConfigured) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    // Redirect to the login page with a return to path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
