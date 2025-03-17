import React from "react";
import TrainingStats from "./TrainingStats";
import TrainingProgress from "./TrainingProgress";
import UpcomingTrainings from "./UpcomingTrainings";

interface TrainingOverviewProps {
  className?: string;
  onViewCourse?: (courseId: string) => void;
  onViewAllCourses?: () => void;
  onViewAllSessions?: () => void;
  onEnrollSession?: (sessionId: string) => void;
}

const TrainingOverview = ({
  className,
  onViewCourse,
  onViewAllCourses,
  onViewAllSessions,
  onEnrollSession,
}: TrainingOverviewProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <TrainingStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrainingProgress onViewCourse={onViewCourse} />

        <UpcomingTrainings
          onViewAll={onViewAllSessions}
          onEnroll={onEnrollSession}
        />
      </div>
    </div>
  );
};

export default TrainingOverview;
