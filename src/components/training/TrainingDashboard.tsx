import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Award, Video } from "lucide-react";
import TrainingStats from "./TrainingStats";
import TrainingProgress from "./TrainingProgress";
import CourseCatalog from "./CourseCatalog";
import CourseContent from "./CourseContent";
import CertificatesList from "./CertificatesList";
import RecordingsList from "./RecordingsList";

interface TrainingDashboardProps {
  className?: string;
}

const TrainingDashboard = ({ className }: TrainingDashboardProps) => {
  const [activeTab, setActiveTab] = useState("progress");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab("course-content");
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setActiveTab("courses");
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <TrainingStats />

      <Tabs
        defaultValue="progress"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-cvup-blue border-b border-gray-800 p-0 h-auto w-full justify-start">
          <TabsTrigger
            value="progress"
            className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-lightblue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold`}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            My Progress
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-lightblue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Course Catalog
          </TabsTrigger>
          <TabsTrigger
            value="certificates"
            className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-lightblue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold`}
          >
            <Award className="mr-2 h-4 w-4" />
            Certificates
          </TabsTrigger>
          <TabsTrigger
            value="recordings"
            className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-lightblue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold`}
          >
            <Video className="mr-2 h-4 w-4" />
            Recordings
          </TabsTrigger>
          {selectedCourseId && (
            <TabsTrigger
              value="course-content"
              className={`px-6 py-3 rounded-t-lg data-[state=active]:bg-cvup-lightblue data-[state=active]:text-cvup-gold data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-cvup-gold`}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Course Content
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="progress" className="mt-6">
          <TrainingProgress onViewCourse={handleCourseSelect} />
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <CourseCatalog onCourseSelect={handleCourseSelect} />
        </TabsContent>

        <TabsContent value="certificates" className="mt-6">
          <CertificatesList />
        </TabsContent>

        <TabsContent value="recordings" className="mt-6">
          <RecordingsList />
        </TabsContent>

        <TabsContent value="course-content" className="mt-6">
          {selectedCourseId && (
            <CourseContent
              courseId={selectedCourseId}
              onBack={handleBackToCourses}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingDashboard;
