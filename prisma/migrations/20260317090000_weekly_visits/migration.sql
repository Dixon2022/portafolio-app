-- CreateTable
CREATE TABLE "public"."WeeklyVisit" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyVisit_visitorId_weekStart_key" ON "public"."WeeklyVisit"("visitorId", "weekStart");

-- CreateIndex
CREATE INDEX "WeeklyVisit_weekStart_idx" ON "public"."WeeklyVisit"("weekStart");
