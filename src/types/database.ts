export type Tables = {
  roles: {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
  profiles: {
    id: string;
    full_name: string;
    title: string | null;
    bio: string | null;
    avatar_url: string | null;
    role: string;
    role_id: number | null;
    created_at: string;
    updated_at: string;
  };
  training_sessions: {
    id: string;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string;
    location: string | null;
    max_participants: number | null;
    created_by: string;
    created_at: string;
    updated_at: string;
  };
  session_participants: {
    id: string;
    session_id: string;
    user_id: string;
    status: string;
    feedback: string | null;
    rating: number | null;
    created_at: string;
    updated_at: string;
  };
  session_recordings: {
    id: string;
    session_id: string;
    title: string;
    url: string;
    duration: number | null;
    created_at: string;
  };
  cv_templates: {
    id: string;
    name: string;
    description: string | null;
    thumbnail_url: string | null;
    is_premium: boolean;
    created_at: string;
  };
  user_cvs: {
    id: string;
    user_id: string;
    template_id: string | null;
    title: string;
    content: Record<string, any>;
    is_public: boolean;
    created_at: string;
    updated_at: string;
  };
  interview_questions: {
    id: string;
    category: string;
    question: string;
    difficulty: string | null;
    created_at: string;
  };
  user_interview_practice: {
    id: string;
    user_id: string;
    question_id: string | null;
    user_answer: string | null;
    feedback: string | null;
    rating: number | null;
    created_at: string;
    updated_at: string;
  };
  linkedin_profiles: {
    id: string;
    user_id: string;
    profile_url: string | null;
    content: Record<string, any> | null;
    optimization_score: number | null;
    created_at: string;
    updated_at: string;
  };
  user_progress: {
    id: string;
    user_id: string;
    module: string;
    progress: number;
    last_activity: string;
    created_at: string;
    updated_at: string;
  };
  user_activities: {
    id: string;
    user_id: string;
    activity_type: string;
    description: string;
    created_at: string;
  };
};
