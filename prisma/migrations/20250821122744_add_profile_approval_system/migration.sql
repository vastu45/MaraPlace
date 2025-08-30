-- CreateEnum
CREATE TYPE "UpdateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "ProfileUpdate" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "status" "UpdateStatus" NOT NULL DEFAULT 'PENDING',
    "updatedFields" JSONB NOT NULL,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "ProfileUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileUpdate" ADD CONSTRAINT "ProfileUpdate_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AgentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
