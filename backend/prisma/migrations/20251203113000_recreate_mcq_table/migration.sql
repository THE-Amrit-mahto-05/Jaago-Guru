-- Recreate MCQ table as lowercase 'mcq' with jsonb options and required fields
-- Drop old quoted table if it exists

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'MCQ'
  ) THEN
    EXECUTE 'DROP TABLE "MCQ" CASCADE';
  END IF;
END $$;

-- Create new table 'mcq'
CREATE TABLE IF NOT EXISTS public.mcq (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  answer TEXT NOT NULL,
  explanation TEXT,
  createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT mcq_user_fkey FOREIGN KEY (userId) REFERENCES public."User"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mcq_user ON public.mcq(userId);
CREATE INDEX IF NOT EXISTS idx_mcq_subject_topic ON public.mcq(subject, topic);

