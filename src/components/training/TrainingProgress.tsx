import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Award, ArrowRight } from "lucide-react";

interface CourseProgressItem {
  id: string;
  courseId: string;
  courseTitle: string;
  progress: number;
  lastActivity?: string;
  totalModules: number;
  completedModules: number;
}

interface TrainingProgressProps {
  courses?: CourseProgressItem[];
  onViewCourse?: (courseId: string) => void;
  className?: string;
}

const TrainingProgress = ({
  courses = [
    {
      id: "1",
      courseId: "c1",
      courseTitle: "Advanced Excel for Professionals",
      progress: 75,
      lastActivity: "2023-06-10T14:30:00Z",
      totalModules: 8,
      completedModules: 6,
    },
    {
      id: "2",
      courseId: "c2",
      courseTitle: "Communication Skills Workshop",
      progress: 40,
      lastActivity: "2023-06-08T09:15:00Z",
      totalModules: 5,
      completedModules: 2,
    },
    {
      id: "3",
      courseId: "c3",
      courseTitle: "Business French for Beginners",
      progress: 100,
      lastActivity: "2023-06-01T16:45:00Z",
      totalModules: 10,
      completedModules: 10,
    },
  ],
  onViewCourse,
  className,
}: TrainingProgressProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cvup-gold" />
          Your Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {courses.length === 0 ? (
            <div className="p-6 bg-cvup-lightblue rounded-lg text-center">
              <BookOpen className="h-12 w-12 mx-auto text-cvup-gold mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
              <p className="text-gray-400 mb-4">
                You haven't enrolled in any courses yet. Browse our catalog to
                start learning.
              </p>
              <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
                Browse Courses
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-lg bg-cvup-lightblue hover:bg-[#2A3042] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {course.courseTitle}
                    </h3>
                    {course.progress === 100 ? (
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800">
                        In Progress
                      </Badge>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">
                        Progress: {course.progress}%
                      </span>
                      <span className="text-gray-400">
                        {course.completedModules}/{course.totalModules} Modules
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-4 w-4 text-cvup-gold mr-1" />
                      Last activity: {formatDate(course.lastActivity)} at{" "}
                      {formatTime(course.lastActivity)}
                    </div>
                    <Button
                      size="sm"
                      className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue"
                      onClick={() =>
                        onViewCourse && onViewCourse(course.courseId)
                      }
                    >
                      Continue
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingProgress;
