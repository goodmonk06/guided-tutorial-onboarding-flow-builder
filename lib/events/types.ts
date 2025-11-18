/* eslint-disable @typescript-eslint/no-explicit-any */
export enum DomainEventType {
  // Guide events
  GUIDE_CREATED = 'guide.created',
  GUIDE_UPDATED = 'guide.updated',
  GUIDE_DELETED = 'guide.deleted',
  GUIDE_PUBLISHED = 'guide.published',
  GUIDE_ARCHIVED = 'guide.archived',
  GUIDE_VERSION_CREATED = 'guide.version_created',

  // Guide step events
  STEP_CREATED = 'step.created',
  STEP_UPDATED = 'step.updated',
  STEP_DELETED = 'step.deleted',
  STEP_REORDERED = 'step.reordered',

  // User interaction events
  GUIDE_STARTED = 'guide.started',
  GUIDE_COMPLETED = 'guide.completed',
  GUIDE_SKIPPED = 'guide.skipped',
  STEP_VIEWED = 'step.viewed',
  STEP_COMPLETED = 'step.completed',
  STEP_SKIPPED = 'step.skipped',

  // Template events
  TEMPLATE_CREATED = 'template.created',
  TEMPLATE_USED = 'template.used',

  // Analytics events
  ANALYTICS_RECORDED = 'analytics.recorded',
}

export interface DomainEvent<T = any> {
  id: string
  type: DomainEventType
  timestamp: Date
  payload: T
  metadata?: {
    userId?: string
    guideId?: string
    sessionId?: string
    [key: string]: any
  }
}

// Specific event payloads
export interface GuideCreatedPayload {
  guideId: string
  name: string
  key: string
  status: string
  templateId?: string
}

export interface GuideUpdatedPayload {
  guideId: string
  changes: Partial<{
    name: string
    description: string
    status: string
    priority: number
    tags: string[]
  }>
}

export interface GuideDeletedPayload {
  guideId: string
  name: string
}

export interface GuideStartedPayload {
  guideId: string
  userId: string
  sessionId?: string
  referrer?: string
}

export interface GuideCompletedPayload {
  guideId: string
  userId: string
  durationMs: number
  stepsCompleted: number
  stepsTotal: number
}

export interface StepViewedPayload {
  guideId: string
  stepId: string
  userId: string
  orderIndex: number
  selector: string
}

export interface AnalyticsRecordedPayload {
  guideId: string
  date: Date
  metrics: {
    impressions: number
    starts: number
    completions: number
    skips: number
    averageTimeMs: number
  }
}
