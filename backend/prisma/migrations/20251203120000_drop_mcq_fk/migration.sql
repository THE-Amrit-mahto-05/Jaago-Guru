-- Drop foreign key on mcq.userid if it exists to allow inserts for any userId
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE table_name = 'mcq' AND constraint_name = 'mcq_user_fkey'
  ) THEN
    ALTER TABLE public.mcq DROP CONSTRAINT mcq_user_fkey;
  END IF;
END $$;

