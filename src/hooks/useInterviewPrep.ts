import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getInterviewQuestions,
  getMockInterviews,
  getMockInterview,
  startInterviewSession,
  completeInterviewSession,
  getUserInterviewSessions,
  uploadInterviewRecording,
  InterviewQuestion,
  MockInterview,
  UserInterviewSession,
} from "@/lib/api/interview-prep";

export function useInterviewPrep() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [mockInterviews, setMockInterviews] = useState<MockInterview[]>([]);
  const [userSessions, setUserSessions] = useState<UserInterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Load questions and mock interviews regardless of user login status
        const [questionsData, interviewsData] = await Promise.all([
          getInterviewQuestions(),
          getMockInterviews(),
        ]);

        setQuestions(questionsData);
        setMockInterviews(interviewsData);

        // Only load user sessions if logged in
        if (user) {
          const userSessionsData = await getUserInterviewSessions(user.id);
          setUserSessions(userSessionsData);
        }
      } catch (err) {
        console.error("Error loading interview prep data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load interview prep data",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const getQuestionsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const filteredQuestions = await getInterviewQuestions(category);
      return filteredQuestions;
    } catch (err) {
      console.error("Error getting questions by category:", err);
      setError(err instanceof Error ? err.message : "Failed to get questions");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getInterviewsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const filteredInterviews = await getMockInterviews(category);
      return filteredInterviews;
    } catch (err) {
      console.error("Error getting interviews by category:", err);
      setError(err instanceof Error ? err.message : "Failed to get interviews");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getInterviewDetails = async (interviewId: string) => {
    try {
      setLoading(true);
      setError(null);
      return await getMockInterview(interviewId);
    } catch (err) {
      console.error("Error getting interview details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to get interview details",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (mockInterviewId: string) => {
    if (!user) throw new Error("User must be logged in");

    try {
      setLoading(true);
      setError(null);
      const sessionId = await startInterviewSession(user.id, mockInterviewId);

      // Refresh user sessions
      const updatedSessions = await getUserInterviewSessions(user.id);
      setUserSessions(updatedSessions);

      return sessionId;
    } catch (err) {
      console.error("Error starting interview session:", err);
      setError(err instanceof Error ? err.message : "Failed to start session");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async (
    sessionId: string,
    score: number,
    feedback: any,
    recordingFile?: File,
  ) => {
    try {
      setLoading(true);
      setError(null);

      let recordingUrl = null;
      if (recordingFile) {
        recordingUrl = await uploadInterviewRecording(sessionId, recordingFile);
      }

      await completeInterviewSession(sessionId, score, feedback, recordingUrl);

      // Refresh user sessions
      if (user) {
        const updatedSessions = await getUserInterviewSessions(user.id);
        setUserSessions(updatedSessions);
      }
    } catch (err) {
      console.error("Error completing interview session:", err);
      setError(
        err instanceof Error ? err.message : "Failed to complete session",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    questions,
    mockInterviews,
    userSessions,
    loading,
    error,
    getQuestionsByCategory,
    getInterviewsByCategory,
    getInterviewDetails,
    startSession,
    completeSession,
  };
}
