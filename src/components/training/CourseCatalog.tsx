import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Filter, Loader2 } from "lucide-react";
import CourseCard from "./CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { useToast } from "@/components/ui/use-toast";

interface CourseCatalogProps {
  className?: string;
  onCourseSelect?: (courseId: string) => void;
}

const CourseCatalog = ({ className, onCourseSelect }: CourseCatalogProps) => {
  const { courses, enrollments, loadCourses, enrollCourse, loading, error } =
    useCourses();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(courses);

  // Extract unique categories and levels for filters
  const categories = Array.from(
    new Set(courses.map((course) => course.category).filter(Boolean)),
  );
  const levels = Array.from(
    new Set(courses.map((course) => course.level).filter(Boolean)),
  );

  // Load courses when component mounts
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Apply filters when courses or filter values change
  useEffect(() => {
    let result = [...courses];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          (course.description &&
            course.description.toLowerCase().includes(term)),
      );
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter((course) => course.category === categoryFilter);
    }

    // Apply level filter
    if (levelFilter) {
      result = result.filter((course) => course.level === levelFilter);
    }

    setFilteredCourses(result);
  }, [courses, searchTerm, categoryFilter, levelFilter]);

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollCourse(courseId);
      toast({
        title: "Enrolled Successfully",
        description: "You have been enrolled in the course.",
      });
    } catch (err) {
      toast({
        title: "Enrollment Failed",
        description:
          err instanceof Error
            ? err.message
            : "Failed to enroll in the course.",
        variant: "destructive",
      });
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.courseId === courseId);
  };

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find((e) => e.courseId === courseId);
    return enrollment ? enrollment.progress : 0;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setLevelFilter("");
  };

  return (
    <Card
      className={`w-full bg-cvup-blue text-white border-none shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cvup-gold" />
          Course Catalog
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-cvup-lightblue border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] bg-cvup-lightblue border-gray-700 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-cvup-lightblue border-gray-700 text-white">
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[180px] bg-cvup-lightblue border-gray-700 text-white">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-cvup-lightblue border-gray-700 text-white">
                  <SelectItem value="">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white"
                onClick={resetFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Course Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-cvup-gold animate-spin" />
              <span className="ml-2 text-gray-300">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-center">
              <p className="text-white">
                Error loading courses. Please try again later.
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-6 bg-cvup-lightblue rounded-lg text-center">
              <BookOpen className="h-12 w-12 mx-auto text-cvup-gold mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || categoryFilter || levelFilter
                  ? "No courses match your search criteria. Try adjusting your filters."
                  : "There are no courses available at the moment."}
              </p>
              {(searchTerm || categoryFilter || levelFilter) && (
                <Button
                  className="bg-cvup-gold hover:bg-cvup-gold/90 text-cvup-blue font-medium"
                  onClick={resetFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description || ""}
                  thumbnailUrl={course.thumbnailUrl || undefined}
                  duration={course.duration || undefined}
                  level={course.level || undefined}
                  category={course.category || undefined}
                  instructorName={course.instructorName}
                  enrolled={isEnrolled(course.id)}
                  progress={getEnrollmentProgress(course.id)}
                  onClick={() => onCourseSelect && onCourseSelect(course.id)}
                  onEnroll={() => handleEnroll(course.id)}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCatalog;
