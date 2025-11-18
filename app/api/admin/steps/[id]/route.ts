import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateStepSchema } from '@/lib/validations/guide'
import { handleError, formatErrorResponse } from '@/lib/errors'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateStepSchema.parse(body)

    const step = await prisma.guideStep.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(step)
  } catch (error) {
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.guideStep.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}
