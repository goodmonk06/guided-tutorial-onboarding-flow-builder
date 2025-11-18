import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createGuideSchema } from '@/lib/validations/guide'
import { handleError, formatErrorResponse } from '@/lib/errors'

export async function GET() {
  try {
    const guides = await prisma.guide.findMany({
      include: {
        steps: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(guides)
  } catch (error) {
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createGuideSchema.parse(body)

    const guide = await prisma.guide.create({
      data: validatedData,
    })

    return NextResponse.json(guide, { status: 201 })
  } catch (error) {
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}
