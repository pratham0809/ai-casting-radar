-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "searchTerm" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "company" TEXT,
    "date" TEXT,
    "url" TEXT,
    "applyLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_title_location_applyLink_key" ON "Job"("title", "location", "applyLink");
