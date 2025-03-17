import React from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { Info, Settings, User, Bell, Calendar } from "lucide-react";

interface GlassmorphismExampleProps {
  title?: string;
  description?: string;
}

const GlassmorphismExamples = ({
  title = "Glassmorphism Examples",
  description = "Examples of glassmorphism effects used throughout the CV UP application",
}: GlassmorphismExampleProps) => {
  return (
    <div className="w-full space-y-8 bg-[#1A1F2C] p-8 rounded-lg">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-gray-300">{description}</p>
      </div>

      <Separator className="bg-gray-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Glassmorphism Card */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">Basic Card</h3>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg blur opacity-20"></div>
            <Card className="relative backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
              <div className="p-6 space-y-4">
                <h4 className="text-lg font-medium text-white">Glass Card</h4>
                <p className="text-gray-300">
                  This card demonstrates the basic glassmorphism effect with
                  subtle transparency and blur.
                </p>
                <Button className="bg-[#ffbd59] hover:bg-[#ffbd59]/80 text-black">
                  Learn More
                </Button>
              </div>
            </Card>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            <p>
              Implementation: Use{" "}
              <code className="bg-gray-800 px-1 rounded">backdrop-blur-md</code>{" "}
              with <code className="bg-gray-800 px-1 rounded">bg-white/10</code>{" "}
              for the glass effect
            </p>
          </div>
        </div>

        {/* Dashboard Panel */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">Dashboard Panel</h3>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffbd59]/30 to-orange-600/30 rounded-lg blur opacity-20"></div>
            <Card className="relative backdrop-blur-md bg-white/5 border-white/10 shadow-xl">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-white">
                    Progress Overview
                  </h4>
                  <Settings className="h-5 w-5 text-gray-300" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-sm text-gray-300">CV Completion</p>
                    <p className="text-xl font-bold text-[#ffbd59]">75%</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-sm text-gray-300">Interviews</p>
                    <p className="text-xl font-bold text-[#ffbd59]">3/5</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            <p>
              Used in dashboard panels with{" "}
              <code className="bg-gray-800 px-1 rounded">bg-white/5</code> for
              subtle transparency
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">Navigation Menu</h3>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg blur opacity-20"></div>
            <Card className="relative backdrop-blur-md bg-white/5 border-white/10 shadow-xl">
              <div className="p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/10 text-[#ffbd59]">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 text-gray-300 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 text-gray-300 transition-colors">
                    <Calendar className="h-5 w-5" />
                    <span>Schedule</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 text-gray-300 transition-colors">
                    <Info className="h-5 w-5" />
                    <span>Help</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            <p>
              Navigation with glass effect and hover states using{" "}
              <code className="bg-gray-800 px-1 rounded">
                hover:bg-white/10
              </code>
            </p>
          </div>
        </div>

        {/* Form Elements */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">Form Elements</h3>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-600/20 rounded-lg blur opacity-20"></div>
            <Card className="relative backdrop-blur-md bg-white/5 border-white/10 shadow-xl">
              <div className="p-6 space-y-4">
                <h4 className="text-lg font-medium text-white">Contact Form</h4>
                <div className="space-y-3">
                  <Input
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Your name"
                  />
                  <Input
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Email address"
                  />
                  <Button className="w-full bg-[#ffbd59] hover:bg-[#ffbd59]/80 text-black">
                    Submit
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            <p>
              Form inputs with glass effect using{" "}
              <code className="bg-gray-800 px-1 rounded">bg-white/10</code> for
              inputs
            </p>
          </div>
        </div>

        {/* Modal Dialog */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">Modal Dialog</h3>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg blur opacity-20"></div>
            <Card className="relative backdrop-blur-xl bg-black/40 border-white/10 shadow-xl">
              <div className="p-6 space-y-4">
                <h4 className="text-lg font-medium text-white">
                  Confirm Action
                </h4>
                <p className="text-gray-300">
                  Are you sure you want to submit your CV for professional
                  review?
                </p>
                <div className="flex space-x-3 justify-end">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-[#ffbd59] hover:bg-[#ffbd59]/80 text-black">
                    Confirm
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            <p>
              Modal with stronger blur effect using{" "}
              <code className="bg-gray-800 px-1 rounded">backdrop-blur-xl</code>{" "}
              and <code className="bg-gray-800 px-1 rounded">bg-black/40</code>
            </p>
          </div>
        </div>

        {/* Notification */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">Notification</h3>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-600/20 rounded-lg blur opacity-20"></div>
            <Card className="relative backdrop-blur-md bg-white/5 border-white/10 shadow-xl">
              <div className="p-4 flex items-start space-x-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">
                    CV Review Complete
                  </h4>
                  <p className="text-xs text-gray-300">
                    Your CV has been reviewed by our professional team. View
                    feedback now.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>
            </Card>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            <p>
              Notification toast with subtle glass effect and colored icon
              background
            </p>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      <div className="space-y-4">
        <h3 className="text-xl font-medium text-white">
          Implementation Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="p-6 space-y-4">
              <h4 className="text-lg font-medium text-white">CSS Properties</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    backdrop-filter: blur(8px);
                  </code>{" "}
                  - Creates the blur effect
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    background-color: rgba(255, 255, 255, 0.1);
                  </code>{" "}
                  - Transparent background
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    border: 1px solid rgba(255, 255, 255, 0.2);
                  </code>{" "}
                  - Subtle border
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                  </code>{" "}
                  - Soft shadow
                </li>
              </ul>
            </div>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <div className="p-6 space-y-4">
              <h4 className="text-lg font-medium text-white">
                Tailwind Classes
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    backdrop-blur-md
                  </code>{" "}
                  - Medium blur effect
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">bg-white/10</code>{" "}
                  - 10% white background
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    border-white/20
                  </code>{" "}
                  - 20% white border
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">shadow-xl</code> -
                  Extra large shadow
                </li>
                <li>
                  <code className="bg-gray-700 px-1 rounded">
                    bg-gradient-to-br
                  </code>{" "}
                  - Background gradient
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphismExamples;
