import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ArrowLeft,
  Video,
  FileText,
  CheckCircle,
  Clock,
  Award,
  Play,
  Download,
  Lock,
} from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useToast } from "@/components/ui/use-toast";

interface CourseContentProps {
  courseId: string;
  onBack?: () => void;
  className?: string;
}

const CourseContent = ({ courseId, onBack, className }: CourseContentProps) => {
  const {
    loadCourseDetails,
    updateContentProgress,
    generateCertificate,
    loading,
    error,
  } = useCourses();
  const { toast } = useToast();

  const [course, setCourse] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [activeContentId, setActiveContentId] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [loadingContent, setLoadingContent] = useState(true);

  React.useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoadingContent(true);
        const details = await loadCourseDetails(courseId);
        setCourse(details.course);
        setContent(details.content);
        setProgress(details.progress);

        // Calculate overall progress
        if (details.progress.length > 0 && details.content.length > 0) {
          const completedItems = details.progress.filter(
            (p: any) => p.completionStatus === "completed",
          ).length;
          const progressPercentage = Math.round(
            (completedItems / details.content.length) * 100,
          );
          setOverallProgress(progressPercentage);

          // Set active content to first incomplete item or first item
          const firstIncomplete = details.content.find((c: any) => {
            const progressItem = details.progress.find(
              (p: any) => p.contentId === c.id,
            );
            return (
              !progressItem || progressItem.completionStatus !== "completed"
            );
          });

          if (firstIncomplete) {
            setActiveContentId(firstIncomplete.id);
          } else if (details.content.length > 0) {
            setActiveContentId(details.content[0].id);
          }
        } else if (details.content.length > 0) {
          setActiveContentId(details.content[0].id);
        }
      } catch (err) {
        toast({
          title: "Error",
          description:
            err instanceof Error
              ? err.message
              : "Failed to load course details",
          variant: "destructive",
        });
      } finally {
        setLoadingContent(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, loadCourseDetails, toast]);

  const getContentProgress = (contentId: string) => {
    const contentProgress = progress.find((p) => p.contentId === contentId);
    return contentProgress ? contentProgress.completionStatus : "not_started";
  };

  const handleMarkComplete = async (contentId: string) => {
    try {
      await updateContentProgress(courseId, contentId, {
        completionStatus: "completed",
        progress: 100,
      });

      // Update local progress state
      const updatedProgress = [...progress];
      const existingIndex = updatedProgress.findIndex(
        (p) => p.contentId === contentId,
      );

      if (existingIndex >= 0) {
        updatedProgress[existingIndex] = {
          ...updatedProgress[existingIndex],
          completionStatus: "completed",
          progress: 100,
        };
      } else {
        updatedProgress.push({
          contentId,
          courseId,
          completionStatus: "completed",
          progress: 100,
        });
      }

      setProgress(updatedProgress);

      // Recalculate overall progress
      const completedItems = updatedProgress.filter(
        (p) => p.completionStatus === "completed",
      ).length;
      const newOverallProgress = Math.round(
        (completedItems / content.length) * 100,
      );
      setOverallProgress(newOverallProgress);

      toast({
        title: "Progress Updated",
        description: "This item has been marked as completed.",
      });

      // If all content is completed, generate certificate
      if (newOverallProgress === 100) {
        try {
          await generateCertificate(courseId);
          toast({
            title: "Congratulations!",
            description:
              "You've completed the course! Your certificate is now available.",
          });
        } catch (certError) {
          console.error("Error generating certificate:", certError);
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case "video":
        return <Video className="h-5 w-5 text-blue-400" />;
      case "document":
        return <FileText className="h-5 w-5 text-green-400" />;
      case "quiz":
        return <CheckCircle className="h-5 w-5 text-purple-400" />;
      default:
        return <BookOpen className="h-5 w-5 text-cvup-gold" />;
    }
  };

  const getContentStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Lock className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderContentItem = () => {
    if (!activeContentId) return null;

    const activeContent = content.find((c) => c.id === activeContentId);
    if (!activeContent) return null;

    switch (activeContent.contentType) {
      case "video":
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              {activeContent.contentUrl ? (
                <iframe
                  src={activeContent.contentUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-center">
                  <Play className="h-16 w-16 text-cvup-gold mx-auto mb-4" />
                  <p className="text-gray-400">
                    Video content will be displayed here
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                {activeContent.title}
              </h3>
              <Badge
                className={`${getContentProgress(activeContent.id) === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
              >
                {activeContent.duration || "10 mins"}
              </Badge>
            </div>
            <p className="text-gray-300">{activeContent.description}</p>
            <Button
              className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
              onClick={() => handleMarkComplete(activeContent.id)}
              disabled={getContentProgress(activeContent.id) === "completed"}
            >
              {getContentProgress(activeContent.id) === "completed"
                ? "Completed"
                : "Mark as Completed"}
            </Button>
          </div>
        );

      case "document":
        return (
          <div className="space-y-4">
            <div className="p-6 bg-cvup-lightblue rounded-lg">
              <FileText className="h-12 w-12 text-cvup-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                {activeContent.title}
              </h3>
              <p className="text-gray-300 text-center mb-6">
                {activeContent.description}
              </p>
              {activeContent.contentUrl ? (
                <Button
                  className="mx-auto flex items-center justify-center bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
                  onClick={() =>
                    window.open(activeContent.contentUrl, "_blank")
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Document
                </Button>
              ) : (
                <p className="text-center text-gray-400">
                  Document will be available here
                </p>
              )}
            </div>
            <Button
              className="w-full bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
              onClick={() => handleMarkComplete(activeContent.id)}
              disabled={getContentProgress(activeContent.id) === "completed"}
            >
              {getContentProgress(activeContent.id) === "completed"
                ? "Completed"
                : "Mark as Completed"}
            </Button>
          </div>
        );

      case "quiz":
        return (
          <div className="space-y-4">
            <div className="p-6 bg-cvup-lightblue rounded-lg">
              <CheckCircle className="h-12 w-12 text-cvup-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                {activeContent.title}
              </h3>
              <p className="text-gray-300 text-center mb-6">
                {activeContent.description}
              </p>
              <div className="text-center">
                <p className="text-gray-400 mb-4">
                  Quiz content will be displayed here
                </p>
                <Button className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium">
                  Start Quiz
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 bg-cvup-lightblue rounded-lg text-center">
            <BookOpen className="h-12 w-12 text-cvup-gold mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeContent.title}
            </h3>
            <p className="text-gray-300 mb-6">{activeContent.description}</p>
            <Button
              className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
              onClick={() => handleMarkComplete(activeContent.id)}
              disabled={getContentProgress(activeContent.id) === "completed"}
            >
              {getContentProgress(activeContent.id) === "completed"
                ? "Completed"
                : "Mark as Completed"}
            </Button>
          </div>
        );
    }
  };

  if (loadingContent) {
    return (
      <Card
        className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cvup-gold" />
            Loading Course...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-12">
            <BookOpen className="h-8 w-8 text-cvup-gold animate-pulse" />
            <span className="ml-2 text-gray-300">
              Loading course content...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !course) {
    return (
      <Card
        className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cvup-gold" />
            Course Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-center">
            <p className="text-white">
              Error loading course. Please try again later.
            </p>
            {onBack && (
              <Button
                className="mt-4 bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
                onClick={onBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-cvup-lightblue mr-2"
                onClick={onBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cvup-gold" />
              {course.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-400">
              Overall Progress: {overallProgress}%
            </div>
            <Progress
              value={overallProgress}
              className="w-32 h-2 bg-gray-700"
            />
            {overallProgress === 100 && (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <Award className="h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-white">Course Content</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {content.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg flex items-center justify-between cursor-pointer ${activeContentId === item.id ? "bg-cvup-gold text-cvup-blue" : "bg-cvup-lightblue hover:bg-cvup-lightblue/80 text-white"}`}
                  onClick={() => setActiveContentId(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getContentIcon(item.contentType)}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${activeContentId === item.id ? "text-cvup-blue" : "text-white"}`}
                      >
                        {index + 1}. {item.title}
                      </p>
                      <p
                        className={`text-xs ${activeContentId === item.id ? "text-cvup-blue/80" : "text-gray-400"}`}
                      >
                        {item.duration || "10 mins"} •{" "}
                        {item.contentType.charAt(0).toUpperCase() +
                          item.contentType.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getContentStatusIcon(getContentProgress(item.id))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Display */}
          <div className="lg:col-span-2">{renderContentItem()}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseContent;
