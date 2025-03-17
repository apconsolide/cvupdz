import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Clock, Calendar, BookOpen } from "lucide-react";

interface TrainingStatsProps {
  totalCourses?: number;
  completedCourses?: number;
  totalHoursLearned?: number;
  certificatesEarned?: number;
  lastActivity?: string;
  className?: string;
}

const TrainingStats = ({
  totalCourses = 5,
  completedCourses = 2,
  totalHoursLearned = 24,
  certificatesEarned = 2,
  lastActivity = "2023-06-10T14:30:00Z",
  className,
}: TrainingStatsProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const completionPercentage =
    totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  return (
    <Card
      className={`bg-cvup-blue text-white border-none shadow-lg ${className}`}
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-cvup-lightblue rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">
                Course Completion
              </h3>
              <BookOpen className="h-5 w-5 text-cvup-gold" />
            </div>
            <div className="flex items-end justify-between mb-1">
              <p className="text-2xl font-bold text-white">
                {completionPercentage}%
              </p>
              <p className="text-sm text-gray-400">
                {completedCourses}/{totalCourses} Courses
              </p>
            </div>
            <Progress value={completionPercentage} className="h-1" />
          </div>

          <div className="p-4 bg-cvup-lightblue rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">
                Learning Hours
              </h3>
              <Clock className="h-5 w-5 text-cvup-gold" />
            </div>
            <p className="text-2xl font-bold text-white">{totalHoursLearned}</p>
            <p className="text-sm text-gray-400">Total Hours</p>
          </div>

          <div className="p-4 bg-cvup-lightblue rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">
                Certificates
              </h3>
              <Award className="h-5 w-5 text-cvup-gold" />
            </div>
            <p className="text-2xl font-bold text-white">
              {certificatesEarned}
            </p>
            <p className="text-sm text-gray-400">Earned</p>
          </div>

          <div className="p-4 bg-cvup-lightblue rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">
                Last Activity
              </h3>
              <Calendar className="h-5 w-5 text-cvup-gold" />
            </div>
            <p className="text-xl font-bold text-white">
              {formatDate(lastActivity)}
            </p>
            <p className="text-sm text-gray-400">Recent Learning</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingStats;
