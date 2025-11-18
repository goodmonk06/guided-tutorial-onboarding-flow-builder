import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleError, formatErrorResponse, NotFoundError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const template = await prisma.guideTemplate.findUnique({
      where: { key },
    })

    if (!template) {
      throw new NotFoundError('Template not found')
    }

    logger.debug('Template fetched', { key })

    return NextResponse.json(template)
  } catch (error) {
    logger.error('Error fetching template', error as Error)
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}
