import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { handleError, formatErrorResponse } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { eventBus, createEvent } from '@/lib/events/bus'
import { DomainEventType } from '@/lib/events/types'
import { analyticsService } from '@/lib/adapters/analytics'

const trackProgressSchema = z.object({
  guideId: z.string(),
  userId: z.string(),
  action: z.enum(['start', 'complete', 'skip', 'step_view']),
  stepId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = trackProgressSchema.parse(body)

    const guide = await prisma.guide.findUnique({
      where: { id: data.guideId },
      include: { steps: true },
    })

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 })
    }

    // Get or create user progress
    let progress = await prisma.userProgress.findUnique({
      where: {
        guideId_userId: {
          guideId: data.guideId,
          userId: data.userId,
        },
      },
    })

    const now = new Date()

    if (!progress) {
      // Create new progress record
      progress = await prisma.userProgress.create({
        data: {
          guideId: data.guideId,
          userId: data.userId,
          stepsTotal: guide.steps.length,
          stepsCompleted: 0,
          metadata: JSON.stringify(data.metadata || {}),
        },
      })

      // Publish event
      await eventBus.publish(
        createEvent(DomainEventType.GUIDE_STARTED, {
          guideId: data.guideId,
          userId: data.userId,
        })
      )

      // Track in analytics
      await analyticsService.track({
        guideId: data.guideId,
        eventType: 'guide_started',
        userId: data.userId,
        metadata: data.metadata,
      })
    }

    // Handle different actions
    switch (data.action) {
      case 'complete':
        progress = await prisma.userProgress.update({
          where: { id: progress.id },
          data: {
            completedAt: now,
            stepsCompleted: guide.steps.length,
            lastViewedAt: now,
          },
        })

        await eventBus.publish(
          createEvent(DomainEventType.GUIDE_COMPLETED, {
            guideId: data.guideId,
            userId: data.userId,
            durationMs: now.getTime() - progress.startedAt.getTime(),
            stepsCompleted: guide.steps.length,
            stepsTotal: guide.steps.length,
          })
        )

        await analyticsService.track({
          guideId: data.guideId,
          eventType: 'guide_completed',
          userId: data.userId,
          metadata: data.metadata,
        })
        break

      case 'skip':
        progress = await prisma.userProgress.update({
          where: { id: progress.id },
          data: {
            skippedAt: now,
            lastViewedAt: now,
          },
        })

        await eventBus.publish(
          createEvent(DomainEventType.GUIDE_SKIPPED, {
            guideId: data.guideId,
            userId: data.userId,
          })
        )

        await analyticsService.track({
          guideId: data.guideId,
          eventType: 'guide_skipped',
          userId: data.userId,
          metadata: data.metadata,
        })
        break

      case 'step_view':
        if (data.stepId) {
          const stepIndex = guide.steps.findIndex((s) => s.id === data.stepId)
          const newStepsCompleted = Math.max(progress.stepsCompleted, stepIndex + 1)

          progress = await prisma.userProgress.update({
            where: { id: progress.id },
            data: {
              currentStepId: data.stepId,
              stepsCompleted: newStepsCompleted,
              lastViewedAt: now,
            },
          })

          await eventBus.publish(
            createEvent(DomainEventType.STEP_VIEWED, {
              guideId: data.guideId,
              stepId: data.stepId,
              userId: data.userId,
              orderIndex: stepIndex,
              selector: guide.steps[stepIndex]?.selector,
            })
          )
        }
        break
    }

    logger.debug('Progress tracked', {
      guideId: data.guideId,
      userId: data.userId,
      action: data.action,
    })

    return NextResponse.json(progress)
  } catch (error) {
    logger.error('Error tracking progress', error as Error)
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}
