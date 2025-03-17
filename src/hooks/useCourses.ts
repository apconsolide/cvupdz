import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseContent,
  getContentItem,
  createCourseContent,
  updateCourseContent,
  deleteCourseContent,
  enrollInCourse,
  getUserEnrollments,
  updateEnrollmentStatus,
  updateEnrollmentProgress,
  trackContentProgress,
  getUserContentProgress,
  generateCertificate,
  getUserCertificates,
  getCertificate,
  updateCertificateUrl,
  Course,
  CourseContent,
  CourseEnrollment,
  CourseProgress,
  Certificate,
} from "@/lib/api/courses";

export function useCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCourses([]);
      setEnrollments([]);
      setCertificates([]);
      setLoading(false);
      return;
    }

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load published courses
        const coursesData = await getCourses({ published: true });
        setCourses(coursesData);

        // Load user enrollments
        const enrollmentsData = await getUserEnrollments(user.id);
        setEnrollments(enrollmentsData);

        // Load user certificates
        const certificatesData = await getUserCertificates(user.id);
        setCertificates(certificatesData);
      } catch (err) {
        console.error("Error loading courses data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load courses data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user]);

  // Course Management
  const loadCourses = async (options?: {
    published?: boolean;
    category?: string;
    level?: string;
    instructorId?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await getCourses(options);
      setCourses(coursesData);
      return coursesData;
    } catch (err) {
      console.error("Error loading courses:", err);
      setError(err instanceof Error ? err.message : "Failed to load courses");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetails = async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);

      const [courseDetails, contentItems] = await Promise.all([
        getCourse(courseId),
        getCourseContent(courseId),
      ]);

      setCourseContent(contentItems);

      if (user) {
        // Load user's progress for this course
        const progressData = await getUserContentProgress(user.id, courseId);
        setProgress(progressData);
      }

      return {
        course: courseDetails,
        content: contentItems,
        progress: user ? progress : [],
      };
    } catch (err) {
      console.error("Error loading course details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load course details",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createNewCourse = async (
    courseData: Omit<
      Course,
      "id" | "createdAt" | "updatedAt" | "instructorName"
    >,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const courseId = await createCourse(courseData);

      // Refresh courses
      const updatedCourses = await getCourses();
      setCourses(updatedCourses);

      return courseId;
    } catch (err) {
      console.error("Error creating course:", err);
      setError(err instanceof Error ? err.message : "Failed to create course");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingCourse = async (
    courseId: string,
    updates: Partial<
      Omit<Course, "id" | "createdAt" | "updatedAt" | "instructorName">
    >,
  ) => {
    try {
      setLoading(true);
      setError(null);
      await updateCourse(courseId, updates);

      // Refresh courses
      const updatedCourses = await getCourses();
      setCourses(updatedCourses);
    } catch (err) {
      console.error("Error updating course:", err);
      setError(err instanceof Error ? err.message : "Failed to update course");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeExistingCourse = async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteCourse(courseId);

      // Update local state
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err);
      setError(err instanceof Error ? err.message : "Failed to delete course");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Course Content Management
  const loadCourseContent = async (
    courseId: string,
    options?: { published?: boolean },
  ) => {
    try {
      setLoading(true);
      setError(null);
      const contentItems = await getCourseContent(courseId, options);
      setCourseContent(contentItems);
      return contentItems;
    } catch (err) {
      console.error("Error loading course content:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load course content",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (
    contentData: Omit<CourseContent, "id" | "createdAt" | "updatedAt">,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const contentId = await createCourseContent(contentData);

      // Refresh content
      const updatedContent = await getCourseContent(contentData.courseId);
      setCourseContent(updatedContent);

      return contentId;
    } catch (err) {
      console.error("Error creating course content:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create course content",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (
    contentId: string,
    updates: Partial<Omit<CourseContent, "id" | "createdAt" | "updatedAt">>,
  ) => {
    try {
      setLoading(true);
      setError(null);
      await updateCourseContent(contentId, updates);

      // Get the course ID to refresh content
      const content = await getContentItem(contentId);
      if (content) {
        const updatedContent = await getCourseContent(content.courseId);
        setCourseContent(updatedContent);
      }
    } catch (err) {
      console.error("Error updating course content:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update course content",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (contentId: string, courseId: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteCourseContent(contentId);

      // Refresh content
      const updatedContent = await getCourseContent(courseId);
      setCourseContent(updatedContent);
    } catch (err) {
      console.error("Error deleting course content:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete course content",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Enrollment Management
  const enrollCourse = async (courseId: string) => {
    if (!user) throw new Error("User must be logged in");

    try {
      setLoading(true);
      setError(null);
      await enrollInCourse(user.id, courseId);

      // Refresh enrollments
      const updatedEnrollments = await getUserEnrollments(user.id);
      setEnrollments(updatedEnrollments);
    } catch (err) {
      console.error("Error enrolling in course:", err);
      setError(
        err instanceof Error ? err.message : "Failed to enroll in course",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadUserEnrollments = async (status?: string) => {
    if (!user) return [];

    try {
      setLoading(true);
      setError(null);
      const enrollmentsData = await getUserEnrollments(user.id, status);
      setEnrollments(enrollmentsData);
      return enrollmentsData;
    } catch (err) {
      console.error("Error loading enrollments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load enrollments",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEnrollment = async (
    enrollmentId: string,
    status: "enrolled" | "in-progress" | "completed" | "dropped",
    completionDate?: string,
  ) => {
    try {
      setLoading(true);
      setError(null);
      await updateEnrollmentStatus(enrollmentId, status, completionDate);

      // Refresh enrollments
      if (user) {
        const updatedEnrollments = await getUserEnrollments(user.id);
        setEnrollments(updatedEnrollments);
      }
    } catch (err) {
      console.error("Error updating enrollment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update enrollment",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Progress Tracking
  const updateContentProgress = async (
    courseId: string,
    contentId: string,
    data: {
      completionStatus?: "not_started" | "in_progress" | "completed";
      progress?: number;
      lastPosition?: number;
      quizScore?: number;
    },
  ) => {
    if (!user) throw new Error("User must be logged in");

    try {
      setLoading(true);
      setError(null);
      await trackContentProgress(user.id, courseId, contentId, data);

      // Refresh progress
      const updatedProgress = await getUserContentProgress(user.id, courseId);
      setProgress(updatedProgress);

      // Refresh enrollments to get updated overall progress
      const updatedEnrollments = await getUserEnrollments(user.id);
      setEnrollments(updatedEnrollments);

      return updatedProgress;
    } catch (err) {
      console.error("Error updating content progress:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update progress",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async (courseId: string) => {
    if (!user) return [];

    try {
      setLoading(true);
      setError(null);
      const progressData = await getUserContentProgress(user.id, courseId);
      setProgress(progressData);
      return progressData;
    } catch (err) {
      console.error("Error loading progress:", err);
      setError(err instanceof Error ? err.message : "Failed to load progress");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Certificate Management
  const generateCourseCertificate = async (
    courseId: string,
    certificateData?: any,
  ) => {
    if (!user) throw new Error("User must be logged in");

    try {
      setLoading(true);
      setError(null);
      const certificateId = await generateCertificate(
        user.id,
        courseId,
        certificateData,
      );

      // Refresh certificates
      const updatedCertificates = await getUserCertificates(user.id);
      setCertificates(updatedCertificates);

      return certificateId;
    } catch (err) {
      console.error("Error generating certificate:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate certificate",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadUserCertificates = async () => {
    if (!user) return [];

    try {
      setLoading(true);
      setError(null);
      const certificatesData = await getUserCertificates(user.id);
      setCertificates(certificatesData);
      return certificatesData;
    } catch (err) {
      console.error("Error loading certificates:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load certificates",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCertificate = async (certificateId: string, url: string) => {
    try {
      setLoading(true);
      setError(null);
      await updateCertificateUrl(certificateId, url);

      // Refresh certificates
      if (user) {
        const updatedCertificates = await getUserCertificates(user.id);
        setCertificates(updatedCertificates);
      }
    } catch (err) {
      console.error("Error updating certificate:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update certificate",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    courses,
    courseContent,
    enrollments,
    progress,
    certificates,
    loading,
    error,

    // Course Management
    loadCourses,
    loadCourseDetails,
    createCourse: createNewCourse,
    updateCourse: updateExistingCourse,
    deleteCourse: removeExistingCourse,

    // Course Content Management
    loadCourseContent,
    createContent,
    updateContent,
    deleteContent,

    // Enrollment Management
    enrollCourse,
    loadUserEnrollments,
    updateEnrollment,

    // Progress Tracking
    updateContentProgress,
    loadUserProgress,

    // Certificate Management
    generateCertificate: generateCourseCertificate,
    loadUserCertificates,
    updateCertificate,
  };
}
