-- CreateTable
CREATE TABLE "GuideTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "thumbnail" TEXT,
    "config" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GuideVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" TEXT NOT NULL,
    "changeLog" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GuideVersion_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStepId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "skippedAt" DATETIME,
    "lastViewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stepsCompleted" INTEGER NOT NULL DEFAULT 0,
    "stepsTotal" INTEGER NOT NULL,
    "metadata" TEXT,
    CONSTRAINT "UserProgress_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GuideAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "starts" INTEGER NOT NULL DEFAULT 0,
    "completions" INTEGER NOT NULL DEFAULT 0,
    "skips" INTEGER NOT NULL DEFAULT 0,
    "averageTimeMs" INTEGER NOT NULL DEFAULT 0,
    "dropOffSteps" TEXT,
    CONSTRAINT "GuideAnalytics_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GuideEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GuideEvent_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GuideStyle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "textColor" TEXT NOT NULL DEFAULT '#111827',
    "borderRadius" TEXT NOT NULL DEFAULT '12px',
    "fontSize" TEXT NOT NULL DEFAULT '14px',
    "customCss" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GuideTrigger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT NOT NULL,
    "triggerType" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GuideTrigger_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "templateId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "targetAudience" TEXT,
    "styleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    "archivedAt" DATETIME,
    CONSTRAINT "Guide_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "GuideTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Guide_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "GuideStyle" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Guide" ("createdAt", "description", "id", "key", "name", "updatedAt") SELECT "createdAt", "description", "id", "key", "name", "updatedAt" FROM "Guide";
DROP TABLE "Guide";
ALTER TABLE "new_Guide" RENAME TO "Guide";
CREATE UNIQUE INDEX "Guide_key_key" ON "Guide"("key");
CREATE INDEX "Guide_key_idx" ON "Guide"("key");
CREATE INDEX "Guide_status_idx" ON "Guide"("status");
CREATE INDEX "Guide_templateId_idx" ON "Guide"("templateId");
CREATE TABLE "new_GuideStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guideId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "selector" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "placement" TEXT NOT NULL DEFAULT 'bottom',
    "routePath" TEXT,
    "metaJson" TEXT,
    "delayMs" INTEGER,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GuideStep_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GuideStep" ("contentMarkdown", "createdAt", "guideId", "id", "metaJson", "orderIndex", "placement", "routePath", "selector", "updatedAt") SELECT "contentMarkdown", "createdAt", "guideId", "id", "metaJson", "orderIndex", "placement", "routePath", "selector", "updatedAt" FROM "GuideStep";
DROP TABLE "GuideStep";
ALTER TABLE "new_GuideStep" RENAME TO "GuideStep";
CREATE INDEX "GuideStep_guideId_orderIndex_idx" ON "GuideStep"("guideId", "orderIndex");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "GuideTemplate_key_key" ON "GuideTemplate"("key");

-- CreateIndex
CREATE INDEX "GuideTemplate_category_idx" ON "GuideTemplate"("category");

-- CreateIndex
CREATE INDEX "GuideTemplate_key_idx" ON "GuideTemplate"("key");

-- CreateIndex
CREATE INDEX "GuideVersion_guideId_idx" ON "GuideVersion"("guideId");

-- CreateIndex
CREATE UNIQUE INDEX "GuideVersion_guideId_version_key" ON "GuideVersion"("guideId", "version");

-- CreateIndex
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");

-- CreateIndex
CREATE INDEX "UserProgress_guideId_idx" ON "UserProgress"("guideId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_guideId_userId_key" ON "UserProgress"("guideId", "userId");

-- CreateIndex
CREATE INDEX "GuideAnalytics_guideId_idx" ON "GuideAnalytics"("guideId");

-- CreateIndex
CREATE INDEX "GuideAnalytics_date_idx" ON "GuideAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "GuideAnalytics_guideId_date_key" ON "GuideAnalytics"("guideId", "date");

-- CreateIndex
CREATE INDEX "GuideEvent_guideId_idx" ON "GuideEvent"("guideId");

-- CreateIndex
CREATE INDEX "GuideEvent_eventType_idx" ON "GuideEvent"("eventType");

-- CreateIndex
CREATE INDEX "GuideEvent_timestamp_idx" ON "GuideEvent"("timestamp");

-- CreateIndex
CREATE INDEX "GuideEvent_userId_idx" ON "GuideEvent"("userId");

-- CreateIndex
CREATE INDEX "GuideStyle_name_idx" ON "GuideStyle"("name");

-- CreateIndex
CREATE INDEX "GuideTrigger_guideId_idx" ON "GuideTrigger"("guideId");

-- CreateIndex
CREATE INDEX "GuideTrigger_triggerType_idx" ON "GuideTrigger"("triggerType");
