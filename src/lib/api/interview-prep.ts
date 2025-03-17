import { supabase } from "../supabase";

export type InterviewQuestion = {
  id: string;
  category: string;
  question: string;
  answerGuide: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
};

export type MockInterview = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in minutes
  questionIds: string[];
  tags: string[];
};

export type UserInterviewSession = {
  id: string;
  userId: string;
  mockInterviewId: string;
  startedAt: string;
  completedAt: string | null;
  score: number | null;
  feedback: any | null;
  recordingUrl: string | null;
};

export const getInterviewQuestions = async (
  category?: string,
): Promise<InterviewQuestion[]> => {
  let query = supabase.from("interview_questions").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map((q) => ({
    id: q.id,
    category: q.category,
    question: q.question,
    answerGuide: q.answer_guide,
    difficulty: q.difficulty,
    tags: q.tags,
  }));
};

export const getMockInterviews = async (
  category?: string,
): Promise<MockInterview[]> => {
  let query = supabase.from("mock_interviews").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map((interview) => ({
    id: interview.id,
    title: interview.title,
    description: interview.description,
    category: interview.category,
    duration: interview.duration,
    questionIds: interview.question_ids,
    tags: interview.tags,
  }));
};

export const getMockInterview = async (
  interviewId: string,
): Promise<MockInterview | null> => {
  const { data, error } = await supabase
    .from("mock_interviews")
    .select("*")
    .eq("id", interviewId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    duration: data.duration,
    questionIds: data.question_ids,
    tags: data.tags,
  };
};

export const startInterviewSession = async (
  userId: string,
  mockInterviewId: string,
): Promise<string> => {
  const { data, error } = await supabase
    .from("user_interview_sessions")
    .insert([
      {
        user_id: userId,
        mock_interview_id: mockInterviewId,
        started_at: new Date(),
      },
    ])
    .select();

  if (error) throw error;
  return data[0].id;
};

export const completeInterviewSession = async (
  sessionId: string,
  score: number,
  feedback: any,
  recordingUrl?: string,
) => {
  const { error } = await supabase
    .from("user_interview_sessions")
    .update({
      completed_at: new Date(),
      score,
      feedback,
      recording_url: recordingUrl,
    })
    .eq("id", sessionId);

  if (error) throw error;
};

export const getUserInterviewSessions = async (
  userId: string,
): Promise<UserInterviewSession[]> => {
  const { data, error } = await supabase
    .from("user_interview_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (error) throw error;

  return data.map((session) => ({
    id: session.id,
    userId: session.user_id,
    mockInterviewId: session.mock_interview_id,
    startedAt: session.started_at,
    completedAt: session.completed_at,
    score: session.score,
    feedback: session.feedback,
    recordingUrl: session.recording_url,
  }));
};

export const uploadInterviewRecording = async (
  sessionId: string,
  file: File,
): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${sessionId}-${Math.random()}.${fileExt}`;
  const filePath = `interview-recordings/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("user-content")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("user-content").getPublicUrl(filePath);
  const recordingUrl = data.publicUrl;

  // Update session with recording URL
  const { error } = await supabase
    .from("user_interview_sessions")
    .update({ recording_url: recordingUrl })
    .eq("id", sessionId);

  if (error) throw error;

  return recordingUrl;
};
