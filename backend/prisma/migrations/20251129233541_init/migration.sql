/*
  Warnings:

  - You are about to drop the column `difficulty` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "difficulty",
ADD COLUMN     "experience" TEXT;
