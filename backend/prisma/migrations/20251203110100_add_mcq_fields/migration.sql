-- Add missing columns to MCQ table to match Prisma model
-- Safe to run multiple times: use IF NOT EXISTS checks via DO blocks

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'MCQ' AND column_name = 'answer'
  ) THEN
    ALTER TABLE "MCQ" ADD COLUMN "answer" TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'MCQ' AND column_name = 'explanation'
  ) THEN
    ALTER TABLE "MCQ" ADD COLUMN "explanation" TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'MCQ' AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE "MCQ" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

