import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a demo guide
  const demoGuide = await prisma.guide.upsert({
    where: { key: 'demo-app-tour' },
    update: {},
    create: {
      name: 'Demo App Tour',
      key: 'demo-app-tour',
      description: 'A quick walkthrough of the demo application features',
      steps: {
        create: [
          {
            orderIndex: 0,
            selector: '#welcome-section',
            contentMarkdown: '# Welcome!\n\nWelcome to our demo app. Let\'s take a quick tour of the main features.',
            placement: 'bottom',
            routePath: '/',
          },
          {
            orderIndex: 1,
            selector: '#feature-one',
            contentMarkdown: '## Feature One\n\nThis is our **first amazing feature**. Click here to explore more.',
            placement: 'right',
            routePath: '/',
          },
          {
            orderIndex: 2,
            selector: '#feature-two',
            contentMarkdown: '## Feature Two\n\nOur second feature helps you accomplish tasks faster. Try it out!',
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

  console.log('Created demo guide:', demoGuide)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
