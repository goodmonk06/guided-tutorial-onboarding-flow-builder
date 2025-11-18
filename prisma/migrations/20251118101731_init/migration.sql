-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GuideStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "selector" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "placement" TEXT NOT NULL DEFAULT 'bottom',
    "routePath" TEXT,
    "metaJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GuideStep_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Guide_key_key" ON "Guide"("key");

-- CreateIndex
CREATE INDEX "Guide_key_idx" ON "Guide"("key");

-- CreateIndex
CREATE INDEX "GuideStep_guideId_orderIndex_idx" ON "GuideStep"("guideId", "orderIndex");
