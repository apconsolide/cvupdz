import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RoleSelector from "./RoleSelector";
import { UserRole } from "@/types/auth";

interface AuthFormProps {
  onSuccess?: () => void;
  className?: string;
}

const AuthForm = ({ onSuccess, className }: AuthFormProps) => {
  const { signIn, signUp, error: authError, isConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [formError, setFormError] = useState<string | null>(null);

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  // Role selection removed - all new users are assigned participant role by default

  // Handle authentication errors
  const handleAuthError = (error: any) => {
    setFormError(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred. Please try again.",
    );
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isConfigured) {
      setFormError(
        "Supabase is not configured. Please set up your environment variables.",
      );
      return;
    }

    try {
      await signIn({
        email: signInData.email,
        password: signInData.password,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Sign in error:", error);
      // Error is handled by the AuthContext
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isConfigured) {
      setFormError(
        "Supabase is not configured. Please set up your environment variables.",
      );
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      await signUp({
        fullName: signUpData.fullName,
        email: signUpData.email,
        password: signUpData.password,
      });

      // After signup, switch to sign in tab
      setActiveTab("signin");
      setSignInData({
        email: signUpData.email,
        password: "",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Sign up error:", error);
      // Error is handled by the AuthContext
    }
  };

  return (
    <Card
      className={`w-full max-w-md mx-auto bg-cvup-blue text-white border-gray-700 ${className}`}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
      >
        <TabsList className="grid w-full grid-cols-2 bg-cvup-lightblue">
          <TabsTrigger
            value="signin"
            className="data-[state=active]:bg-cvup-blue data-[state=active]:text-cvup-gold"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="data-[state=active]:bg-cvup-blue data-[state=active]:text-cvup-gold"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <form onSubmit={handleSignIn}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-400">
                Sign in to your CV UP account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(authError || formError) && (
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-800 text-red-300"
                >
                  <AlertDescription>{formError || authError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={signInData.email}
                  onChange={handleSignInChange}
                  className="bg-cvup-lightblue border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="signin-password">Password</Label>
                  <a
                    href="#"
                    className="text-xs text-cvup-gold hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={signInData.password}
                  onChange={handleSignInChange}
                  className="bg-cvup-lightblue border-gray-700 text-white"
                  required
                />
              </div>

              {!isConfigured && (
                <div className="text-amber-500 text-sm mt-2">
                  <p>
                    Supabase is not configured. Please set up your environment
                    variables to enable authentication.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
                disabled={!isConfigured}
              >
                Sign In
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignUp}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                Create Account
              </CardTitle>
              <CardDescription className="text-gray-400">
                Sign up for a new CV UP account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(authError || formError) && (
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-800 text-red-300"
                >
                  <AlertDescription>{formError || authError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  name="fullName"
                  placeholder="John Doe"
                  value={signUpData.fullName}
                  onChange={handleSignUpChange}
                  className="bg-cvup-lightblue border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  className="bg-cvup-lightblue border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  className="bg-cvup-lightblue border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">
                  Confirm Password
                </Label>
                <Input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
                  className="bg-cvup-lightblue border-gray-700 text-white"
                  required
                />
              </div>

              {/* Role selection removed - all new users are assigned participant role by default */}

              {!isConfigured && (
                <div className="text-amber-500 text-sm mt-2">
                  <p>
                    Supabase is not configured. Please set up your environment
                    variables to enable user registration.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
                disabled={!isConfigured}
              >
                Sign Up
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
