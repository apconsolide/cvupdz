import React, { useEffect, useState } from "react";
import ModuleCard from "./ModuleCard";
import { FileText, Video, Linkedin, BookOpen } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";

interface ModuleCardsProps {
  modules?: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    progress: number;
    bgColor: string;
    onClick?: () => void;
  }>;
}

const ModuleCards = ({ modules: propModules }: ModuleCardsProps) => {
  const { progress, loading } = useUserProgress();
  const [modules, setModules] = useState<any[]>([]);

  // Default module definitions
  const defaultModules = [
    {
      id: "cv-builder",
      title: "CV Builder",
      description:
        "Create and optimize your CV with ATS-friendly templates designed for the Algerian job market.",
      icon: (
        <FileText className="w-12 h-12 p-2 rounded-full bg-blue-200 text-blue-600" />
      ),
      progress: 0,
      bgColor: "#1A1F2C",
      onClick: () => console.log("CV Builder clicked"),
    },
    {
      id: "interview-prep",
      title: "Interview Preparation",
      description:
        "Practice with simulated interviews and receive personalized feedback to improve your performance.",
      icon: (
        <Video className="w-12 h-12 p-2 rounded-full bg-green-200 text-green-600" />
      ),
      progress: 0,
      bgColor: "#1A1F2C",
      onClick: () => console.log("Interview Prep clicked"),
    },
    {
      id: "linkedin",
      title: "LinkedIn Enhancement",
      description:
        "Optimize your LinkedIn profile and learn strategies to build your professional network.",
      icon: (
        <Linkedin className="w-12 h-12 p-2 rounded-full bg-blue-200 text-blue-600" />
      ),
      progress: 0,
      bgColor: "#1A1F2C",
      onClick: () => console.log("LinkedIn Enhancement clicked"),
    },
    {
      id: "training",
      title: "Training Dashboard",
      description:
        "Access skill development courses with personalized learning paths to advance your career.",
      icon: (
        <BookOpen className="w-12 h-12 p-2 rounded-full bg-purple-200 text-purple-600" />
      ),
      progress: 0,
      bgColor: "#1A1F2C",
      onClick: () => console.log("Training Dashboard clicked"),
    },
  ];

  // Use provided modules or default modules
  const baseModules = propModules || defaultModules;

  // Merge module definitions with progress data from backend
  useEffect(() => {
    if (loading) return;

    const mergedModules = baseModules.map((module) => {
      const moduleProgress = progress.find((p) => p.module === module.id);
      return {
        ...module,
        progress: moduleProgress ? moduleProgress.progress : module.progress,
      };
    });

    setModules(mergedModules);
  }, [progress, loading, baseModules]);

  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto bg-[#1A1F2C] p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-6">
          Career Development Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {baseModules.map((module) => (
            <div
              key={module.id}
              className="bg-[#242938] rounded-lg p-6 animate-pulse"
            >
              <div className="h-12 w-12 bg-gray-700 rounded-full mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-gray-700 rounded mb-4"></div>
              <div className="h-2 w-full bg-gray-700 rounded-full mt-6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-[#1A1F2C] p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        Career Development Modules
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            title={module.title}
            description={module.description}
            icon={module.icon}
            progress={module.progress}
            bgColor={module.bgColor}
            onClick={module.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleCards;
