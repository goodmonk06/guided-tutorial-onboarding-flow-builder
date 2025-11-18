import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const steps = await prisma.guideStep.findMany({
      where: { guideId: params.id },
      orderBy: {
        orderIndex: 'asc',
      },
    })

    return NextResponse.json(steps)
  } catch (error) {
    console.error('Error fetching steps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch steps' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { orderIndex, selector, contentMarkdown, placement, routePath, metaJson } = body

    if (selector === undefined || contentMarkdown === undefined) {
      return NextResponse.json(
        { error: 'Selector and contentMarkdown are required' },
        { status: 400 }
      )
    }

    // Get the highest orderIndex for this guide
    const maxStep = await prisma.guideStep.findFirst({
      where: { guideId: params.id },
      orderBy: { orderIndex: 'desc' },
    })

    const newOrderIndex = orderIndex ?? (maxStep ? maxStep.orderIndex + 1 : 0)

    const step = await prisma.guideStep.create({
      data: {
        guideId: params.id,
        orderIndex: newOrderIndex,
        selector,
        contentMarkdown,
        placement: placement || 'bottom',
        routePath,
        metaJson,
      },
    })

    return NextResponse.json(step, { status: 201 })
  } catch (error) {
    console.error('Error creating step:', error)
    return NextResponse.json(
      { error: 'Failed to create step' },
      { status: 500 }
    )
  }
}
