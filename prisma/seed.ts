import { PrismaClient, GuideStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create default style
  const defaultStyle = await prisma.guideStyle.upsert({
    where: { id: 'default-style' },
    update: {},
    create: {
      id: 'default-style',
      name: 'Default',
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      borderRadius: '12px',
      fontSize: '14px',
    },
  })

  const darkStyle = await prisma.guideStyle.upsert({
    where: { id: 'dark-style' },
    update: {},
    create: {
      id: 'dark-style',
      name: 'Dark',
      primaryColor: '#60a5fa',
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
      borderRadius: '8px',
      fontSize: '14px',
    },
  })

  console.log('✅ Created styles')

  // Create guide templates
  const templates = [
    {
      key: 'welcome-tour',
      name: 'Welcome Tour',
      description: 'Standard welcome tour for new users',
      category: 'onboarding',
      config: JSON.stringify({
        suggestedSteps: ['welcome', 'overview', 'first-action', 'resources'],
        estimatedDuration: 180000,
      }),
    },
    {
      key: 'feature-announcement',
      name: 'Feature Announcement',
      description: 'Highlight a new feature to existing users',
      category: 'announcement',
      config: JSON.stringify({
        suggestedSteps: ['whats-new', 'how-to-use', 'benefits'],
        estimatedDuration: 60000,
      }),
    },
    {
      key: 'error-recovery',
      name: 'Error Recovery Guide',
      description: 'Help users recover from common errors',
      category: 'support',
      config: JSON.stringify({
        suggestedSteps: ['identify-issue', 'solution-steps', 'prevention'],
        estimatedDuration: 120000,
      }),
    },
    {
      key: 'advanced-features',
      name: 'Advanced Features Tour',
      description: 'Showcase advanced functionality for power users',
      category: 'education',
      config: JSON.stringify({
        suggestedSteps: ['prerequisites', 'feature-1', 'feature-2', 'feature-3', 'tips'],
        estimatedDuration: 300000,
      }),
    },
    {
      key: 'quick-start',
      name: 'Quick Start Guide',
      description: 'Get users up and running in 60 seconds',
      category: 'onboarding',
      config: JSON.stringify({
        suggestedSteps: ['setup', 'first-task', 'done'],
        estimatedDuration: 60000,
      }),
    },
  ]

  for (const template of templates) {
    await prisma.guideTemplate.upsert({
      where: { key: template.key },
      update: {},
      create: template,
    })
  }

  console.log('✅ Created templates')

  // Create demo guides
  const demoGuide = await prisma.guide.upsert({
    where: { key: 'demo-app-tour' },
    update: {},
    create: {
      name: 'Demo App Tour',
      key: 'demo-app-tour',
      description: 'A quick walkthrough of the demo application features',
      status: GuideStatus.PUBLISHED,
      priority: 100,
      tags: 'demo,onboarding,featured',
      publishedAt: new Date(),
      styleId: defaultStyle.id,
      steps: {
        create: [
          {
            orderIndex: 0,
            selector: '#welcome-section',
            contentMarkdown:
              "# Welcome!\n\nWelcome to our demo app. Let's take a quick tour of the main features.",
            placement: 'bottom',
            routePath: '/',
          },
          {
            orderIndex: 1,
            selector: '#feature-one',
            contentMarkdown:
              '## Feature One\n\nThis is our **first amazing feature**. Click here to explore more.',
            placement: 'right',
            routePath: '/',
          },
          {
            orderIndex: 2,
            selector: '#feature-two',
            contentMarkdown:
              '## Feature Two\n\nOur second feature helps you accomplish tasks faster. Try it out!',
            placement: 'left',
            routePath: '/',
          },
          {
            orderIndex: 3,
            selector: '#settings-button',
            contentMarkdown: '## Settings\n\nCustomize your experience in the settings panel.',
            placement: 'bottom',
            routePath: '/',
          },
        ],
      },
    },
  })

  const advancedGuide = await prisma.guide.upsert({
    where: { key: 'advanced-features-guide' },
    update: {},
    create: {
      name: 'Advanced Features Guide',
      key: 'advanced-features-guide',
      description: 'Learn about our advanced features and power-user tips',
      status: GuideStatus.PUBLISHED,
      priority: 50,
      tags: 'advanced,power-user,tips',
      publishedAt: new Date(),
      styleId: darkStyle.id,
      templateId: (await prisma.guideTemplate.findUnique({ where: { key: 'advanced-features' } }))
        ?.id,
      steps: {
        create: [
          {
            orderIndex: 0,
            selector: '#dashboard',
            contentMarkdown:
              '# Advanced Dashboard\n\nUnlock powerful insights with our advanced dashboard features.',
            placement: 'top',
            routePath: '/dashboard',
          },
          {
            orderIndex: 1,
            selector: '#analytics-panel',
            contentMarkdown:
              '## Deep Analytics\n\nTrack metrics, visualize trends, and make data-driven decisions.',
            placement: 'right',
            routePath: '/dashboard',
          },
          {
            orderIndex: 2,
            selector: '#automation-menu',
            contentMarkdown:
              '## Automation Rules\n\nSet up automated workflows to save time and reduce errors.',
            placement: 'left',
            routePath: '/dashboard',
            delayMs: 500,
          },
        ],
      },
    },
  })

  const draftGuide = await prisma.guide.upsert({
    where: { key: 'work-in-progress' },
    update: {},
    create: {
      name: 'Work in Progress Guide',
      key: 'work-in-progress',
      description: 'A guide that is still being developed',
      status: GuideStatus.DRAFT,
      priority: 10,
      tags: 'draft,upcoming',
      steps: {
        create: [
          {
            orderIndex: 0,
            selector: '#new-feature',
            contentMarkdown: '# Coming Soon\n\nThis feature is still under development.',
            placement: 'bottom',
          },
        ],
      },
    },
  })

  console.log('✅ Created guides:', { demoGuide: demoGuide.id, advancedGuide: advancedGuide.id, draftGuide: draftGuide.id })

  // Create sample analytics data
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  await prisma.guideAnalytics.upsert({
    where: {
      guideId_date: {
        guideId: demoGuide.id,
        date: yesterday,
      },
    },
    update: {},
    create: {
      guideId: demoGuide.id,
      date: yesterday,
      impressions: 150,
      starts: 120,
      completions: 95,
      skips: 15,
      averageTimeMs: 180000,
      dropOffSteps: JSON.stringify([2, 3]),
    },
  })

  await prisma.guideAnalytics.upsert({
    where: {
      guideId_date: {
        guideId: advancedGuide.id,
        date: yesterday,
      },
    },
    update: {},
    create: {
      guideId: advancedGuide.id,
      date: yesterday,
      impressions: 50,
      starts: 35,
      completions: 28,
      skips: 5,
      averageTimeMs: 240000,
    },
  })

  console.log('✅ Created analytics data')

  // Create sample user progress
  const sampleUsers = ['user_001', 'user_002', 'user_003', 'user_004', 'user_005']

  for (const userId of sampleUsers.slice(0, 3)) {
    await prisma.userProgress.upsert({
      where: {
        guideId_userId: {
          guideId: demoGuide.id,
          userId,
        },
      },
      update: {},
      create: {
        guideId: demoGuide.id,
        userId,
        stepsCompleted: 4,
        stepsTotal: 4,
        completedAt: new Date(),
        metadata: JSON.stringify({ sessionId: `session_${userId}`, referrer: 'homepage' }),
      },
    })
  }

  // Some users still in progress
  for (const userId of sampleUsers.slice(3)) {
    await prisma.userProgress.upsert({
      where: {
        guideId_userId: {
          guideId: demoGuide.id,
          userId,
        },
      },
      update: {},
      create: {
        guideId: demoGuide.id,
        userId,
        stepsCompleted: 2,
        stepsTotal: 4,
        currentStepId: 'step_2',
      },
    })
  }

  console.log('✅ Created user progress')

  // Create sample events
  await prisma.guideEvent.create({
    data: {
      guideId: demoGuide.id,
      eventType: 'GUIDE_STARTED',
      userId: 'user_001',
      metadata: JSON.stringify({ source: 'homepage', device: 'desktop' }),
    },
  })

  await prisma.guideEvent.create({
    data: {
      guideId: demoGuide.id,
      eventType: 'GUIDE_COMPLETED',
      userId: 'user_001',
      metadata: JSON.stringify({ duration: 180000, rating: 5 }),
    },
  })

  console.log('✅ Created events')

  // Create triggers
  await prisma.guideTrigger.create({
    data: {
      guideId: demoGuide.id,
      triggerType: 'PAGE_LOAD',
      config: JSON.stringify({
        url: '/demo',
        delay: 2000,
        showOnce: false,
      }),
      isActive: true,
      priority: 100,
    },
  })

  await prisma.guideTrigger.create({
    data: {
      guideId: advancedGuide.id,
      triggerType: 'USER_EVENT',
      config: JSON.stringify({
        event: 'feature_enabled',
        conditions: { userType: 'power_user' },
      }),
      isActive: true,
      priority: 50,
    },
  })

  console.log('✅ Created triggers')

  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
