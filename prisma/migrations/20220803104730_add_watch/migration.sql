-- CreateTable
CREATE TABLE "Watch" (
    "id" TEXT NOT NULL,
    "originUserId" TEXT NOT NULL,
    "destUserId" TEXT NOT NULL,

    CONSTRAINT "Watch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Watch_originUserId_destUserId_key" ON "Watch"("originUserId", "destUserId");
