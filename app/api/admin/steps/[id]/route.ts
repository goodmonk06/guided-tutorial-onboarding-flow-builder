import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { orderIndex, selector, contentMarkdown, placement, routePath, metaJson } = body

    const step = await prisma.guideStep.update({
      where: { id: params.id },
      data: {
        orderIndex,
        selector,
        contentMarkdown,
        placement,
        routePath,
        metaJson,
      },
    })

    return NextResponse.json(step)
  } catch (error) {
    console.error('Error updating step:', error)
    return NextResponse.json(
      { error: 'Failed to update step' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.guideStep.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting step:', error)
    return NextResponse.json(
      { error: 'Failed to delete step' },
      { status: 500 }
    )
  }
}
