ALTER TABLE public.mcq
  ADD COLUMN IF NOT EXISTS attemptid INTEGER;

CREATE INDEX IF NOT EXISTS idx_mcq_attemptid ON public.mcq(attemptid);

