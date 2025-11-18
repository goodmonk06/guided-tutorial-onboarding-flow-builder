import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleError, formatErrorResponse } from '@/lib/errors'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const progress = await prisma.userProgress.findMany({
      where: {
        userId,
      },
      include: {
        guide: {
          select: {
            id: true,
            name: true,
            key: true,
            description: true,
          },
        },
      },
      orderBy: {
        lastViewedAt: 'desc',
      },
    })

    logger.debug('User progress fetched', { userId, count: progress.length })

    return NextResponse.json(progress)
  } catch (error) {
    logger.error('Error fetching user progress', error as Error)
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}
