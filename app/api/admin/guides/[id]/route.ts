import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateGuideSchema } from '@/lib/validations/guide'
import { handleError, formatErrorResponse, NotFoundError } from '@/lib/errors'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const guide = await prisma.guide.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    })

    if (!guide) {
      throw new NotFoundError('Guide not found')
    }

    return NextResponse.json(guide)
  } catch (error) {
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = updateGuideSchema.parse(body)

    const guide = await prisma.guide.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(guide)
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
    await prisma.guide.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const errorResponse = handleError(error)
    return formatErrorResponse(errorResponse, errorResponse.error.statusCode)
  }
}
