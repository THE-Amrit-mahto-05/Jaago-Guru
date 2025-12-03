DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'mcq'
  ) THEN
    EXECUTE 'DROP TABLE public.mcq CASCADE';
  END IF;
END $$;

ALTER TABLE public.mcq_attempt
  ADD COLUMN IF NOT EXISTS questions JSONB;

