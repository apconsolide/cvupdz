-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  level TEXT,
  category TEXT,
  instructor_id UUID REFERENCES profiles(id),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_content table
CREATE TABLE IF NOT EXISTS course_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL, -- 'video', 'document', 'quiz', etc.
  content_url TEXT,
  content_data JSONB, -- For quizzes, exercises, etc.
  duration TEXT,
  sequence_order INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  certificate_url TEXT,
  certificate_data JSONB, -- For storing certificate template data
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES training_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  join_time TIMESTAMP WITH TIME ZONE,
  leave_time TIMESTAMP WITH TIME ZONE,
  attendance_duration INTEGER, -- in seconds
  attendance_percentage INTEGER,
  status TEXT, -- 'present', 'partial', 'absent'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'enrolled', -- 'enrolled', 'in-progress', 'completed', 'dropped'
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create course_progress table
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  content_id UUID REFERENCES course_content(id) ON DELETE CASCADE,
  completion_status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  progress INTEGER DEFAULT 0,
  last_position INTEGER DEFAULT 0, -- For videos, last position in seconds
  quiz_score INTEGER, -- For quizzes
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_course_content_course_id ON course_content(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_session_id ON attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_content_id ON course_progress(content_id);

-- Add tables to realtime publication
alter publication supabase_realtime add table courses;
alter publication supabase_realtime add table course_content;
alter publication supabase_realtime add table certificates;
alter publication supabase_realtime add table attendance_records;
alter publication supabase_realtime add table course_enrollments;
alter publication supabase_realtime add table course_progress;

-- Create policies for courses table
DROP POLICY IF EXISTS "Public courses are viewable by everyone" ON courses;
CREATE POLICY "Public courses are viewable by everyone"
  ON courses FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Instructors can insert their own courses" ON courses;
CREATE POLICY "Instructors can insert their own courses"
  ON courses FOR INSERT
  WITH CHECK (instructor_id = auth.uid() OR 
             EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

DROP POLICY IF EXISTS "Instructors can update their own courses" ON courses;
CREATE POLICY "Instructors can update their own courses"
  ON courses FOR UPDATE
  USING (instructor_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

DROP POLICY IF EXISTS "Instructors can delete their own courses" ON courses;
CREATE POLICY "Instructors can delete their own courses"
  ON courses FOR DELETE
  USING (instructor_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

-- Create policies for course_content table
DROP POLICY IF EXISTS "Public course content is viewable by everyone" ON course_content;
CREATE POLICY "Public course content is viewable by everyone"
  ON course_content FOR SELECT
  USING (is_published = true AND EXISTS (SELECT 1 FROM courses WHERE courses.id = course_content.course_id AND courses.is_published = true));

DROP POLICY IF EXISTS "Instructors can manage their own course content" ON course_content;
CREATE POLICY "Instructors can manage their own course content"
  ON course_content FOR ALL
  USING (EXISTS (SELECT 1 FROM courses WHERE courses.id = course_content.course_id AND 
                (courses.instructor_id = auth.uid() OR 
                 EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')))));

-- Create policies for certificates table
DROP POLICY IF EXISTS "Users can view their own certificates" ON certificates;
CREATE POLICY "Users can view their own certificates"
  ON certificates FOR SELECT
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

DROP POLICY IF EXISTS "Admins can manage certificates" ON certificates;
CREATE POLICY "Admins can manage certificates"
  ON certificates FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

-- Create policies for attendance_records table
DROP POLICY IF EXISTS "Users can view their own attendance records" ON attendance_records;
CREATE POLICY "Users can view their own attendance records"
  ON attendance_records FOR SELECT
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

DROP POLICY IF EXISTS "Admins can manage attendance records" ON attendance_records;
CREATE POLICY "Admins can manage attendance records"
  ON attendance_records FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

-- Create policies for course_enrollments table
DROP POLICY IF EXISTS "Users can view their own enrollments" ON course_enrollments;
CREATE POLICY "Users can view their own enrollments"
  ON course_enrollments FOR SELECT
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

DROP POLICY IF EXISTS "Users can enroll themselves" ON course_enrollments;
CREATE POLICY "Users can enroll themselves"
  ON course_enrollments FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own enrollments" ON course_enrollments;
CREATE POLICY "Users can update their own enrollments"
  ON course_enrollments FOR UPDATE
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

DROP POLICY IF EXISTS "Admins can manage all enrollments" ON course_enrollments;
CREATE POLICY "Admins can manage all enrollments"
  ON course_enrollments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

-- Create policies for course_progress table
DROP POLICY IF EXISTS "Users can view their own progress" ON course_progress;
CREATE POLICY "Users can view their own progress"
  ON course_progress FOR SELECT
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

DROP POLICY IF EXISTS "Users can update their own progress" ON course_progress;
CREATE POLICY "Users can update their own progress"
  ON course_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own progress" ON course_progress;
CREATE POLICY "Users can update their own progress"
  ON course_progress FOR UPDATE
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));

DROP POLICY IF EXISTS "Admins can manage all progress" ON course_progress;
CREATE POLICY "Admins can manage all progress"
  ON course_progress FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'supervisor')));
