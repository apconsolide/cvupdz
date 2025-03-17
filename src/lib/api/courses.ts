import { supabase } from "../supabase";

export type Course = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  duration: string | null;
  level: string | null;
  category: string | null;
  instructorId: string;
  instructorName?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CourseContent = {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  contentType: string;
  contentUrl: string | null;
  contentData: any | null;
  duration: string | null;
  sequenceOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CourseEnrollment = {
  id: string;
  userId: string;
  courseId: string;
  enrollmentDate: string;
  completionDate: string | null;
  progress: number;
  status: "enrolled" | "in-progress" | "completed" | "dropped";
  lastAccessedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CourseProgress = {
  id: string;
  userId: string;
  courseId: string;
  contentId: string;
  completionStatus: "not_started" | "in_progress" | "completed";
  progress: number;
  lastPosition: number;
  quizScore: number | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Certificate = {
  id: string;
  userId: string;
  courseId: string;
  issueDate: string;
  certificateUrl: string | null;
  certificateData: any | null;
  isValid: boolean;
  createdAt: string;
  updatedAt: string;
};

// Course Management
export const getCourses = async (options?: {
  published?: boolean;
  category?: string;
  level?: string;
  instructorId?: string;
}): Promise<Course[]> => {
  let query = supabase
    .from("courses")
    .select("*, profiles!courses_instructor_id_fkey(full_name)")
    .order("created_at", { ascending: false });

  if (options?.published !== undefined) {
    query = query.eq("is_published", options.published);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.level) {
    query = query.eq("level", options.level);
  }

  if (options?.instructorId) {
    query = query.eq("instructor_id", options.instructorId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnail_url,
    duration: course.duration,
    level: course.level,
    category: course.category,
    instructorId: course.instructor_id,
    instructorName: course.profiles?.full_name || "Unknown",
    isPublished: course.is_published,
    createdAt: course.created_at,
    updatedAt: course.updated_at,
  }));
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
  const { data, error } = await supabase
    .from("courses")
    .select("*, profiles!courses_instructor_id_fkey(full_name)")
    .eq("id", courseId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    thumbnailUrl: data.thumbnail_url,
    duration: data.duration,
    level: data.level,
    category: data.category,
    instructorId: data.instructor_id,
    instructorName: data.profiles?.full_name || "Unknown",
    isPublished: data.is_published,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const createCourse = async (
  courseData: Omit<Course, "id" | "createdAt" | "updatedAt" | "instructorName">,
): Promise<string> => {
  const { data, error } = await supabase
    .from("courses")
    .insert([
      {
        title: courseData.title,
        description: courseData.description,
        thumbnail_url: courseData.thumbnailUrl,
        duration: courseData.duration,
        level: courseData.level,
        category: courseData.category,
        instructor_id: courseData.instructorId,
        is_published: courseData.isPublished,
      },
    ])
    .select();

  if (error) throw error;
  return data[0].id;
};

export const updateCourse = async (
  courseId: string,
  updates: Partial<
    Omit<Course, "id" | "createdAt" | "updatedAt" | "instructorName">
  >,
): Promise<void> => {
  const updateData: any = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined)
    updateData.description = updates.description;
  if (updates.thumbnailUrl !== undefined)
    updateData.thumbnail_url = updates.thumbnailUrl;
  if (updates.duration !== undefined) updateData.duration = updates.duration;
  if (updates.level !== undefined) updateData.level = updates.level;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.instructorId !== undefined)
    updateData.instructor_id = updates.instructorId;
  if (updates.isPublished !== undefined)
    updateData.is_published = updates.isPublished;

  const { error } = await supabase
    .from("courses")
    .update(updateData)
    .eq("id", courseId);

  if (error) throw error;
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  const { error } = await supabase.from("courses").delete().eq("id", courseId);

  if (error) throw error;
};

// Course Content Management
export const getCourseContent = async (
  courseId: string,
  options?: { published?: boolean },
): Promise<CourseContent[]> => {
  let query = supabase
    .from("course_content")
    .select("*")
    .eq("course_id", courseId)
    .order("sequence_order", { ascending: true });

  if (options?.published !== undefined) {
    query = query.eq("is_published", options.published);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map((content) => ({
    id: content.id,
    courseId: content.course_id,
    title: content.title,
    description: content.description,
    contentType: content.content_type,
    contentUrl: content.content_url,
    contentData: content.content_data,
    duration: content.duration,
    sequenceOrder: content.sequence_order,
    isPublished: content.is_published,
    createdAt: content.created_at,
    updatedAt: content.updated_at,
  }));
};

export const getContentItem = async (
  contentId: string,
): Promise<CourseContent | null> => {
  const { data, error } = await supabase
    .from("course_content")
    .select("*")
    .eq("id", contentId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    courseId: data.course_id,
    title: data.title,
    description: data.description,
    contentType: data.content_type,
    contentUrl: data.content_url,
    contentData: data.content_data,
    duration: data.duration,
    sequenceOrder: data.sequence_order,
    isPublished: data.is_published,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const createCourseContent = async (
  contentData: Omit<CourseContent, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const { data, error } = await supabase
    .from("course_content")
    .insert([
      {
        course_id: contentData.courseId,
        title: contentData.title,
        description: contentData.description,
        content_type: contentData.contentType,
        content_url: contentData.contentUrl,
        content_data: contentData.contentData,
        duration: contentData.duration,
        sequence_order: contentData.sequenceOrder,
        is_published: contentData.isPublished,
      },
    ])
    .select();

  if (error) throw error;
  return data[0].id;
};

export const updateCourseContent = async (
  contentId: string,
  updates: Partial<Omit<CourseContent, "id" | "createdAt" | "updatedAt">>,
): Promise<void> => {
  const updateData: any = {};

  if (updates.courseId !== undefined) updateData.course_id = updates.courseId;
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined)
    updateData.description = updates.description;
  if (updates.contentType !== undefined)
    updateData.content_type = updates.contentType;
  if (updates.contentUrl !== undefined)
    updateData.content_url = updates.contentUrl;
  if (updates.contentData !== undefined)
    updateData.content_data = updates.contentData;
  if (updates.duration !== undefined) updateData.duration = updates.duration;
  if (updates.sequenceOrder !== undefined)
    updateData.sequence_order = updates.sequenceOrder;
  if (updates.isPublished !== undefined)
    updateData.is_published = updates.isPublished;

  const { error } = await supabase
    .from("course_content")
    .update(updateData)
    .eq("id", contentId);

  if (error) throw error;
};

export const deleteCourseContent = async (contentId: string): Promise<void> => {
  const { error } = await supabase
    .from("course_content")
    .delete()
    .eq("id", contentId);

  if (error) throw error;
};

// Course Enrollment Management
export const enrollInCourse = async (
  userId: string,
  courseId: string,
): Promise<string> => {
  // Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from("course_enrollments")
    .select("id, status")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (existingEnrollment) {
    // If dropped, reactivate enrollment
    if (existingEnrollment.status === "dropped") {
      await supabase
        .from("course_enrollments")
        .update({
          status: "enrolled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingEnrollment.id);
    }
    return existingEnrollment.id;
  }

  // Create new enrollment
  const { data, error } = await supabase
    .from("course_enrollments")
    .insert([
      {
        user_id: userId,
        course_id: courseId,
        enrollment_date: new Date().toISOString(),
        status: "enrolled",
        progress: 0,
      },
    ])
    .select();

  if (error) throw error;
  return data[0].id;
};

export const getUserEnrollments = async (
  userId: string,
  status?: string,
): Promise<CourseEnrollment[]> => {
  let query = supabase
    .from("course_enrollments")
    .select("*")
    .eq("user_id", userId)
    .order("enrollment_date", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map((enrollment) => ({
    id: enrollment.id,
    userId: enrollment.user_id,
    courseId: enrollment.course_id,
    enrollmentDate: enrollment.enrollment_date,
    completionDate: enrollment.completion_date,
    progress: enrollment.progress,
    status: enrollment.status,
    lastAccessedAt: enrollment.last_accessed_at,
    createdAt: enrollment.created_at,
    updatedAt: enrollment.updated_at,
  }));
};

export const updateEnrollmentStatus = async (
  enrollmentId: string,
  status: "enrolled" | "in-progress" | "completed" | "dropped",
  completionDate?: string,
): Promise<void> => {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "completed" && completionDate) {
    updateData.completion_date = completionDate;
  }

  const { error } = await supabase
    .from("course_enrollments")
    .update(updateData)
    .eq("id", enrollmentId);

  if (error) throw error;
};

export const updateEnrollmentProgress = async (
  enrollmentId: string,
  progress: number,
): Promise<void> => {
  const { error } = await supabase
    .from("course_enrollments")
    .update({
      progress,
      last_accessed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...(progress === 100 && {
        status: "completed",
        completion_date: new Date().toISOString(),
      }),
    })
    .eq("id", enrollmentId);

  if (error) throw error;
};

// Course Progress Tracking
export const trackContentProgress = async (
  userId: string,
  courseId: string,
  contentId: string,
  data: {
    completionStatus?: "not_started" | "in_progress" | "completed";
    progress?: number;
    lastPosition?: number;
    quizScore?: number;
  },
): Promise<void> => {
  // Check if progress record exists
  const { data: existingProgress } = await supabase
    .from("course_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("content_id", contentId)
    .single();

  const now = new Date().toISOString();
  const updateData: any = {
    updated_at: now,
  };

  if (data.completionStatus !== undefined) {
    updateData.completion_status = data.completionStatus;
    if (data.completionStatus === "completed") {
      updateData.completed_at = now;
    }
  }

  if (data.progress !== undefined) updateData.progress = data.progress;
  if (data.lastPosition !== undefined)
    updateData.last_position = data.lastPosition;
  if (data.quizScore !== undefined) updateData.quiz_score = data.quizScore;

  if (existingProgress) {
    // Update existing record
    const { error } = await supabase
      .from("course_progress")
      .update(updateData)
      .eq("id", existingProgress.id);

    if (error) throw error;
  } else {
    // Create new record
    const { error } = await supabase.from("course_progress").insert([
      {
        user_id: userId,
        course_id: courseId,
        content_id: contentId,
        completion_status: data.completionStatus || "not_started",
        progress: data.progress || 0,
        last_position: data.lastPosition || 0,
        quiz_score: data.quizScore,
        created_at: now,
        updated_at: now,
      },
    ]);

    if (error) throw error;
  }

  // Update overall course progress
  await updateOverallCourseProgress(userId, courseId);
};

export const getUserContentProgress = async (
  userId: string,
  courseId: string,
): Promise<CourseProgress[]> => {
  const { data, error } = await supabase
    .from("course_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId);

  if (error) throw error;

  return data.map((progress) => ({
    id: progress.id,
    userId: progress.user_id,
    courseId: progress.course_id,
    contentId: progress.content_id,
    completionStatus: progress.completion_status,
    progress: progress.progress,
    lastPosition: progress.last_position,
    quizScore: progress.quiz_score,
    completedAt: progress.completed_at,
    createdAt: progress.created_at,
    updatedAt: progress.updated_at,
  }));
};

// Helper function to update overall course progress
async function updateOverallCourseProgress(
  userId: string,
  courseId: string,
): Promise<void> {
  // Get all content items for the course
  const { data: contentItems, error: contentError } = await supabase
    .from("course_content")
    .select("id")
    .eq("course_id", courseId);

  if (contentError) throw contentError;

  // Get progress for all content items
  const { data: progressItems, error: progressError } = await supabase
    .from("course_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId);

  if (progressError) throw progressError;

  // Calculate overall progress percentage
  const totalItems = contentItems.length;
  if (totalItems === 0) return; // No content items

  const completedItems = progressItems.filter(
    (item) => item.completion_status === "completed",
  ).length;

  const overallProgress = Math.round((completedItems / totalItems) * 100);

  // Get enrollment record
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (enrollmentError) throw enrollmentError;

  // Update enrollment progress
  await updateEnrollmentProgress(enrollment.id, overallProgress);
}

// Certificate Management
export const generateCertificate = async (
  userId: string,
  courseId: string,
  certificateData?: any,
): Promise<string> => {
  // Check if certificate already exists
  const { data: existingCert } = await supabase
    .from("certificates")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (existingCert) {
    return existingCert.id;
  }

  // Create certificate
  const { data, error } = await supabase
    .from("certificates")
    .insert([
      {
        user_id: userId,
        course_id: courseId,
        issue_date: new Date().toISOString(),
        certificate_data: certificateData || {},
        is_valid: true,
      },
    ])
    .select();

  if (error) throw error;
  return data[0].id;
};

export const getUserCertificates = async (
  userId: string,
): Promise<Certificate[]> => {
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", userId)
    .order("issue_date", { ascending: false });

  if (error) throw error;

  return data.map((cert) => ({
    id: cert.id,
    userId: cert.user_id,
    courseId: cert.course_id,
    issueDate: cert.issue_date,
    certificateUrl: cert.certificate_url,
    certificateData: cert.certificate_data,
    isValid: cert.is_valid,
    createdAt: cert.created_at,
    updatedAt: cert.updated_at,
  }));
};

export const getCertificate = async (
  certificateId: string,
): Promise<Certificate | null> => {
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", certificateId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    courseId: data.course_id,
    issueDate: data.issue_date,
    certificateUrl: data.certificate_url,
    certificateData: data.certificate_data,
    isValid: data.is_valid,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const updateCertificateUrl = async (
  certificateId: string,
  certificateUrl: string,
): Promise<void> => {
  const { error } = await supabase
    .from("certificates")
    .update({
      certificate_url: certificateUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", certificateId);

  if (error) throw error;
};
