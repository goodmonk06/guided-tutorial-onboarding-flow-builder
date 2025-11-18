import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleError, formatErrorResponse } from '@/lib/errors'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30', 10)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const analytics = await prisma.guideAnalytics.findMany({
      where: {
        guideId: params.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Calculate summary statistics
    const summary = analytics.reduce(
      (acc, day) => ({
        totalImpressions: acc.totalImpressions + day.impressions,
        totalStarts: acc.totalStarts + day.starts,
        totalCompletions: acc.totalCompletions + day.completions,
        totalSkips: acc.totalSkips + day.skips,
        avgTimeMs: acc.avgTimeMs + day.averageTimeMs,
        dataPoints: acc.dataPoints + 1,
      }),
      {
        totalImpressions: 0,
        totalStarts: 0,
        totalCompletions: 0,
        totalSkips: 0,
        avgTimeMs: 0,
        dataPoints: 0,
      }
    )

    const result = {
      guideId: params.id,
      period: { days, startDate, endDate: new Date() },
      summary: {
        impressions: summary.totalImpressions,
        starts: summary.totalStarts,
        completions: summary.totalCompletions,
        skips: summary.totalSkips,
        averageTimeMs:
          summary.dataPoints > 0 ? Math.round(summary.avgTimeMs / summary.dataPoints) : 0,
        completionRate:
          summary.totalStarts > 0
            ? Math.round((summary.totalCompletions / summary.totalStarts) * 100)
            : 0,
        startRate:
          summary.totalImpressions > 0
            ? Math.round((summary.totalStarts / summary.totalImpressions) * 100)
            : 0,
      },
      dailyData: analytics,
    }

    logger.debug('Analytics fetched', { guideId: params.id, days, dataPoints: analytics.length })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error fetching analytics', error as Error)
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}
