import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-cvup-blue flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">
          <span className="text-cvup-gold">CV</span>
          <span className="text-white">UP</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Elevate your career with professional tools
        </p>
      </div>

      <AuthForm onSuccess={handleAuthSuccess} />

      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>By signing in, you agree to our</p>
        <div className="flex justify-center space-x-2 mt-1">
          <a href="#" className="text-cvup-gold hover:underline">
            Terms of Service
          </a>
          <span>and</span>
          <a href="#" className="text-cvup-gold hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
