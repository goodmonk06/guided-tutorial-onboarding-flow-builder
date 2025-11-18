import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createStepSchema } from '@/lib/validations/guide'
import { handleError, formatErrorResponse } from '@/lib/errors'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const steps = await prisma.guideStep.findMany({
      where: { guideId: id },
      orderBy: {
        orderIndex: 'asc',
      },
    })

    return NextResponse.json(steps)
  } catch (error) {
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = createStepSchema.parse(body)

    // Get the highest orderIndex for this guide
    const maxStep = await prisma.guideStep.findFirst({
      where: { guideId: id },
      orderBy: { orderIndex: 'desc' },
    })

    const newOrderIndex = validatedData.orderIndex ?? (maxStep ? maxStep.orderIndex + 1 : 0)

    const step = await prisma.guideStep.create({
      data: {
        guideId: id,
        orderIndex: newOrderIndex,
        selector: validatedData.selector,
        contentMarkdown: validatedData.contentMarkdown,
        placement: validatedData.placement || 'bottom',
        routePath: validatedData.routePath,
        metaJson: validatedData.metaJson,
      },
    })

    return NextResponse.json(step, { status: 201 })
  } catch (error) {
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}
