import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleError, formatErrorResponse } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { metrics } from '@/lib/metrics'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    const templates = await prisma.guideTemplate.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ usageCount: 'desc' }, { name: 'asc' }],
    })

    metrics.counter('api_templates_list', 1)
    logger.debug('Templates fetched', { count: templates.length, category })

    return NextResponse.json(templates)
  } catch (error) {
    logger.error('Error fetching templates', error as Error)
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}
