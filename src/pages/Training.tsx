import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import TrainingDashboard from "@/components/training/TrainingDashboard";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";

const Training = () => {
  const [activeTab, setActiveTab] = useState("progress");
  const { loadCourses } = useCourses();

  // Load courses when component mounts
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#121620] text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Training Dashboard</h1>
                <p className="text-gray-400 mt-1">
                  Access training sessions and skill development resources
                </p>
              </div>
              <Button
                className="bg-[#ffbd59] hover:bg-[#e6a94f] text-black font-medium"
                onClick={() => handleTabChange("courses")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Browse All Courses
              </Button>
            </div>

            <TrainingDashboard
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Training;
