CREATE TABLE IF NOT EXISTS public.mcq_attempt (
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  correct INTEGER NOT NULL,
  wrong INTEGER NOT NULL,
  total INTEGER NOT NULL,
  timesec INTEGER NOT NULL,
  selected JSONB NOT NULL,
  createdat TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mcq_attempt_user ON public.mcq_attempt(userid);
CREATE INDEX IF NOT EXISTS idx_mcq_attempt_subject_topic ON public.mcq_attempt(subject, topic);

