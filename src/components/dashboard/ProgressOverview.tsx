import React, { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUserProgress } from "@/hooks/useUserProgress";

interface ModuleProgress {
  id: string;
  name: string;
  progress: number;
  color: string;
}

interface ProgressOverviewProps {
  modules?: ModuleProgress[];
  className?: string;
}

const ProgressOverview = ({ className }: ProgressOverviewProps) => {
  const { progress, loading } = useUserProgress();

  // Module definitions for display names and colors
  const moduleDefinitions = {
    "cv-builder": { name: "CV Builder", color: "bg-blue-500" },
    "interview-prep": { name: "Interview Preparation", color: "bg-amber-500" },
    linkedin: { name: "LinkedIn Enhancement", color: "bg-green-500" },
    training: { name: "Training Courses", color: "bg-purple-500" },
  };

  // Format module progress data for display
  const modules = useMemo(() => {
    return Object.entries(moduleDefinitions).map(([id, def]) => {
      const moduleData = progress.find((p) => p.module === id);
      return {
        id,
        name: def.name,
        progress: moduleData ? moduleData.progress : 0,
        color: def.color,
      };
    });
  }, [progress]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (modules.length === 0) return 0;
    return Math.round(
      modules.reduce((sum, module) => sum + module.progress, 0) /
        modules.length,
    );
  }, [modules]);

  if (loading) {
    return (
      <div
        className={cn(
          "p-6 rounded-xl bg-[#1A1F2C] shadow-lg animate-pulse",
          className,
        )}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="h-6 w-40 bg-gray-700 rounded"></div>
            <div className="h-6 w-12 bg-gray-700 rounded"></div>
          </div>
          <div className="h-3 bg-gray-700 rounded-full w-full"></div>
        </div>

        <div className="h-6 w-40 bg-gray-700 rounded mb-4"></div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-gray-700 rounded"></div>
                <div className="h-4 w-12 bg-gray-700 rounded"></div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 rounded-xl bg-[#1A1F2C] shadow-lg", className)}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-white">Overall Progress</h2>
          <span className="text-[#ffbd59] font-bold">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-3 bg-gray-700" />
      </div>

      <h3 className="text-lg font-medium text-white mb-4">Module Progress</h3>

      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">{module.name}</span>
              <span className="text-sm text-[#ffbd59]">{module.progress}%</span>
            </div>
            <Progress value={module.progress} className={`h-2 bg-gray-700`} />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Last updated: Today</span>
          <button className="text-sm text-[#ffbd59] hover:underline">
            View detailed stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;
