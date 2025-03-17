export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance_records: {
        Row: {
          attendance_duration: number | null
          attendance_percentage: number | null
          created_at: string | null
          id: string
          join_time: string | null
          leave_time: string | null
          notes: string | null
          session_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attendance_duration?: number | null
          attendance_percentage?: number | null
          created_at?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          notes?: string | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attendance_duration?: number | null
          attendance_percentage?: number | null
          created_at?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          notes?: string | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_data: Json | null
          certificate_url: string | null
          course_id: string | null
          created_at: string | null
          id: string
          is_valid: boolean | null
          issue_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          certificate_data?: Json | null
          certificate_url?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_valid?: boolean | null
          issue_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_data?: Json | null
          certificate_url?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_valid?: boolean | null
          issue_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_content: {
        Row: {
          content_data: Json | null
          content_type: string
          content_url: string | null
          course_id: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          is_published: boolean | null
          sequence_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          content_data?: Json | null
          content_type: string
          content_url?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean | null
          sequence_order: number
          title: string
          updated_at?: string | null
        }
        Update: {
          content_data?: Json | null
          content_type?: string
          content_url?: string | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean | null
          sequence_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_content_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completion_date: string | null
          course_id: string | null
          created_at: string | null
          enrollment_date: string | null
          id: string
          last_accessed_at: string | null
          progress: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completion_date?: string | null
          course_id?: string | null
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          last_accessed_at?: string | null
          progress?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completion_date?: string | null
          course_id?: string | null
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          last_accessed_at?: string | null
          progress?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed_at: string | null
          completion_status: string | null
          content_id: string | null
          course_id: string | null
          created_at: string | null
          id: string
          last_position: number | null
          progress: number | null
          quiz_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_status?: string | null
          content_id?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          last_position?: number | null
          progress?: number | null
          quiz_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_status?: string | null
          content_id?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          last_position?: number | null
          progress?: number | null
          quiz_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "course_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          instructor_id: string | null
          is_published: boolean | null
          level: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          instructor_id?: string | null
          is_published?: boolean | null
          level?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          instructor_id?: string | null
          is_published?: boolean | null
          level?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_premium: boolean | null
          name: string
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name: string
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      interview_questions: {
        Row: {
          category: string
          created_at: string | null
          difficulty: string | null
          id: string
          question: string
        }
        Insert: {
          category: string
          created_at?: string | null
          difficulty?: string | null
          id?: string
          question: string
        }
        Update: {
          category?: string
          created_at?: string | null
          difficulty?: string | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      linkedin_profiles: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          optimization_score: number | null
          profile_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          optimization_score?: number | null
          profile_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          optimization_score?: number | null
          profile_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "linkedin_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string
          id: string
          role: string
          role_id: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name: string
          id: string
          role?: string
          role_id?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          role?: string
          role_id?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_role"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      session_participants: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          rating: number | null
          session_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          session_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          session_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_recordings: {
        Row: {
          created_at: string | null
          duration: number | null
          id: string
          session_id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          id?: string
          session_id: string
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          id?: string
          session_id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_recordings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_sessions: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_time: string
          id: string
          location: string | null
          max_participants: number | null
          meet_link: string | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          max_participants?: number | null
          meet_link?: string | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          max_participants?: number | null
          meet_link?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cvs: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          is_public: boolean | null
          template_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          template_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cvs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "cv_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cvs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interview_practice: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          question_id: string | null
          rating: number | null
          updated_at: string | null
          user_answer: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          question_id?: string | null
          rating?: number | null
          updated_at?: string | null
          user_answer?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          question_id?: string | null
          rating?: number | null
          updated_at?: string | null
          user_answer?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interview_practice_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "interview_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interview_practice_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          created_at: string | null
          id: string
          last_activity: string | null
          module: string
          progress: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_activity?: string | null
          module: string
          progress?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_activity?: string | null
          module?: string
          progress?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      zoom_meetings: {
        Row: {
          agenda: string | null
          created_at: string | null
          duration: number
          id: string
          join_url: string
          password: string
          start_time: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          agenda?: string | null
          created_at?: string | null
          duration: number
          id: string
          join_url: string
          password: string
          start_time: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          agenda?: string | null
          created_at?: string | null
          duration?: number
          id?: string
          join_url?: string
          password?: string
          start_time?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      zoom_participants: {
        Row: {
          created_at: string | null
          duration: number | null
          email: string
          id: string
          join_time: string
          leave_time: string | null
          meeting_id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          email: string
          id?: string
          join_time: string
          leave_time?: string | null
          meeting_id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          email?: string
          id?: string
          join_time?: string
          leave_time?: string | null
          meeting_id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "zoom_participants_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "zoom_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      zoom_recordings: {
        Row: {
          created_at: string | null
          download_url: string
          file_size: number
          file_type: string
          id: string
          meeting_id: string
          play_url: string
          recording_end: string
          recording_start: string
        }
        Insert: {
          created_at?: string | null
          download_url: string
          file_size: number
          file_type: string
          id?: string
          meeting_id: string
          play_url: string
          recording_end: string
          recording_start: string
        }
        Update: {
          created_at?: string | null
          download_url?: string
          file_size?: number
          file_type?: string
          id?: string
          meeting_id?: string
          play_url?: string
          recording_end?: string
          recording_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "zoom_recordings_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "zoom_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
