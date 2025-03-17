import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Clock, Calendar, BookOpen } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useUserProgress } from "@/hooks/useUserProgress";

interface TrainingStatsProps {
  totalCourses?: number;
  completedCourses?: number;
  totalHoursLearned?: number;
  certificatesEarned?: number;
  lastActivity?: string;
  className?: string;
}

const TrainingStats = ({
  totalCourses,
  completedCourses,
  totalHoursLearned,
  certificatesEarned,
  lastActivity,
  className,
}: TrainingStatsProps) => {
  const { enrollments, certificates, loading } = useCourses();
  const { progress } = useUserProgress();

  // Calculate stats from real data
  const calculatedTotalCourses = enrollments.length || 0;
  const calculatedCompletedCourses =
    enrollments.filter((e) => e.progress === 100).length || 0;
  const calculatedCertificatesEarned = certificates.length || 0;

  // Calculate total hours learned (estimate based on courses)
  const calculatedTotalHoursLearned = enrollments.reduce((total, course) => {
    // Assume each course is about 10 hours, and multiply by progress percentage
    return total + 10 * (course.progress / 100);
  }, 0);

  // Get the most recent activity timestamp
  const activityDates = [
    ...enrollments.map((e) => e.lastAccessedAt),
    ...progress.map((p) => p.lastActivity),
  ].filter(Boolean);

  const calculatedLastActivity =
    activityDates.length > 0
      ? new Date(
          Math.max(
            ...activityDates.map((date) => new Date(date || 0).getTime()),
          ),
        ).toISOString()
      : new Date().toISOString();

  // Use calculated values or fallback to props
  const displayTotalCourses = loading
    ? totalCourses || 0
    : calculatedTotalCourses;
  const displayCompletedCourses = loading
    ? completedCourses || 0
    : calculatedCompletedCourses;
  const displayTotalHoursLearned = loading
    ? totalHoursLearned || 0
    : Math.round(calculatedTotalHoursLearned);
  const displayCertificatesEarned = loading
    ? certificatesEarned || 0
    : calculatedCertificatesEarned;
  const displayLastActivity = loading
    ? lastActivity || new Date().toISOString()
    : calculatedLastActivity;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const completionPercentage =
    displayTotalCourses > 0
      ? Math.round((displayCompletedCourses / displayTotalCourses) * 100)
      : 0;

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
                {displayCompletedCourses}/{displayTotalCourses} Courses
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
            <p className="text-2xl font-bold text-white">
              {displayTotalHoursLearned}
            </p>
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
              {displayCertificatesEarned}
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
              {formatDate(displayLastActivity)}
            </p>
            <p className="text-sm text-gray-400">Recent Learning</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingStats;
