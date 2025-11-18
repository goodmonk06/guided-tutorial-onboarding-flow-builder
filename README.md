# Guided Onboarding Flow Builder

> A comprehensive, production-ready system for creating, managing, and delivering interactive onboarding experiences and guided tours in web applications.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748)](https://www.prisma.io/)
[![Tests](https://img.shields.io/badge/Tests-Passing-success)](https://vitest.dev/)

## 🎯 Overview

The Guided Onboarding Flow Builder solves the challenge of user onboarding and feature discovery in modern web applications. Unlike static documentation or video tutorials, this system provides:

- **Dynamic, context-aware guidance** that highlights specific UI elements
- **User progress tracking** and engagement analytics
- **Template-based creation** for rapid deployment
- **Event-driven architecture** for extensibility
- **Multi-channel delivery** (currently widget-based, expandable)

## ✨ Key Features

### Core Capabilities
- ✅ **Visual Guide Builder**: Create and manage guides through intuitive admin UI
- ✅ **CSS Selector Targeting**: Highlight any element on your page
- ✅ **Markdown Content**: Rich, formatted step content with full markdown support
- ✅ **Embeddable Widget**: Lightweight (<10KB) vanilla JavaScript widget
- ✅ **Preview Mode**: Test guides before deployment
- ✅ **Version Control**: Track changes and rollback capabilities (schema ready)

### Advanced Features
- ✅ **Guide Templates**: 5 built-in templates + create custom ones
- ✅ **User Progress Tracking**: Track individual user journeys
- ✅ **Analytics Dashboard**: Completion rates, drop-off analysis, engagement metrics
- ✅ **Custom Styling**: Per-guide branding and theming
- ✅ **Conditional Triggers**: Control when/how guides appear
- ✅ **Event System**: Extensible pub/sub architecture
- ✅ **Plugin Architecture**: Analytics, notification, and storage adapters

### Production Ready
- ✅ **Type Safety**: End-to-end TypeScript coverage
- ✅ **Input Validation**: Zod schemas for all API endpoints
- ✅ **Error Handling**: Centralized error management with proper HTTP codes
- ✅ **Testing**: Vitest with 25+ unit tests
- ✅ **Docker Support**: Full containerization with PostgreSQL
- ✅ **Logging & Metrics**: Structured logging and metrics collection
- ✅ **Comprehensive Documentation**: API reference, integration guides, architecture docs

## 🏗️ Architecture

### Domain Model

```
Guide (DRAFT/PUBLISHED/ARCHIVED)
├── GuideStep[] (ordered, conditional)
├── GuideVersion[] (history & rollback)
├── GuideAnalytics[] (metrics by date)
├── UserProgress[] (per-user tracking)
├── GuideEvent[] (audit log)
├── GuideTrigger[] (display conditions)
├── GuideTemplate (optional parent)
└── GuideStyle (custom styling)

GuideTemplate (reusable patterns)
├── Categories: onboarding, announcement, support, education
└── Usage tracking

UserProgress (individual journeys)
├── Current step
├── Completion status
├── Timestamps
└── Metadata

GuideAnalytics (aggregate metrics)
├── Impressions, starts, completions, skips
├── Average time
└── Drop-off analysis
```

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                     Admin UI (Next.js)                   │
│  Guide Management │ Template Library │ Analytics Dashboard│
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   REST API (Next.js)                     │
│  /api/admin/* │ /api/guides/* │ /api/analytics/*        │
│  /api/templates/* │ /api/progress/*                     │
└─────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌─────────┐      ┌──────────┐    ┌──────────┐
    │ Prisma  │      │  Event   │    │ Adapters │
    │   ORM   │      │   Bus    │    │ (Plugins)│
    └─────────┘      └──────────┘    └──────────┘
          │                │                │
          ▼                ▼                ▼
    PostgreSQL/       Event Stream    Analytics/
     SQLite                           Notifications

                           ▼
┌─────────────────────────────────────────────────────────┐
│              Embeddable Widget (Vanilla JS)              │
│    Overlay UI │ Progress Tracking │ Event Reporting     │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Option 1: Local Development

```bash
# 1. Clone and install
git clone <repository-url>
cd guided-tutorial-onboarding-flow-builder
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your configuration

# 3. Initialize database
npm run db:migrate
npm run db:seed

# 4. Start development server
npm run dev

# 5. Open browser
open http://localhost:3000
```

### Option 2: Docker (Recommended for Production)

```bash
# 1. Clone repository
git clone <repository-url>
cd guided-tutorial-onboarding-flow-builder

# 2. Configure environment
cp .env.example .env
# Edit .env with your configuration

# 3. Start with Docker Compose
npm run docker:up

# 4. Access application
open http://localhost:3000
```

## 📖 Usage Guide

### Creating Your First Guide

1. **Navigate to Admin Panel**: `http://localhost:3000/admin`

2. **Create from Template** (Recommended):
   ```
   - Click "Templates" tab
   - Select "Welcome Tour" template
   - Customize name and key
   - Edit steps to match your app
   ```

3. **Or Create from Scratch**:
   ```
   - Click "Create Guide"
   - Enter guide details (name, key, description)
   - Add steps one by one:
     * CSS selector (e.g., #signup-button)
     * Markdown content
     * Placement (top/right/bottom/left)
     * Optional: route path, delay
   ```

4. **Preview**: Click "Preview" to test in a safe environment

5. **Publish**: Change status to PUBLISHED when ready

### Integrating the Widget

#### Basic HTML Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <div id="welcome-section">Welcome!</div>
  <button id="get-started">Get Started</button>

  <!-- Load widget -->
  <script src="https://your-domain.com/widget.js"></script>
  <script>
    OnboardingWidget.init({
      guideKey: 'welcome-tour',
      apiBaseUrl: 'https://your-domain.com',
      onComplete: function() {
        console.log('Tour completed!');
      }
    });
  </script>
</body>
</html>
```

#### React Integration

```tsx
'use client'

import { useEffect } from 'react'

export default function MyPage() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/widget.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if ((window as any).OnboardingWidget) {
        (window as any).OnboardingWidget.init({
          guideKey: 'welcome-tour',
          apiBaseUrl: window.location.origin,
          onComplete: () => {
            // Track completion
            analytics.track('Onboarding Completed')
          }
        })
      }
    }

    return () => script.remove()
  }, [])

  return (
    <div>
      <h1 id="welcome">Welcome!</h1>
      {/* Your app content */}
    </div>
  )
}
```

#### Vue Integration

```vue
<template>
  <div>
    <h1 id="welcome">Welcome!</h1>
    <!-- Your app content -->
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = '/widget.js'
  script.async = true
  document.body.appendChild(script)

  script.onload = () => {
    if (window.OnboardingWidget) {
      window.OnboardingWidget.init({
        guideKey: 'welcome-tour',
        apiBaseUrl: window.location.origin
      })
    }
  }
})
</script>
```

### Tracking User Progress

Use the Progress API to track user journey:

```javascript
// Track guide start
fetch('/api/progress/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    guideId: 'guide-id',
    userId: 'user-123',
    action: 'start',
    metadata: { source: 'homepage' }
  })
})

// Track step view
fetch('/api/progress/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    guideId: 'guide-id',
    userId: 'user-123',
    action: 'step_view',
    stepId: 'step-id'
  })
})

// Track completion
fetch('/api/progress/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    guideId: 'guide-id',
    userId: 'user-123',
    action: 'complete',
    metadata: { rating: 5 }
  })
})
```

## 📡 API Reference

### Guide Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/guides` | GET | List all guides |
| `/api/admin/guides` | POST | Create guide |
| `/api/admin/guides/:id` | GET | Get guide details |
| `/api/admin/guides/:id` | PUT | Update guide |
| `/api/admin/guides/:id` | DELETE | Delete guide |
| `/api/admin/guides/:id/steps` | GET | List guide steps |
| `/api/admin/guides/:id/steps` | POST | Create step |
| `/api/admin/steps/:id` | PUT | Update step |
| `/api/admin/steps/:id` | DELETE | Delete step |

### Public API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/guides/:key` | GET | Get guide by key (for widget) |
| `/api/templates` | GET | List templates |
| `/api/templates/:key` | GET | Get template by key |

### Analytics & Progress

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/guides/:id` | GET | Get guide analytics |
| `/api/progress/:userId` | GET | Get user progress |
| `/api/progress/track` | POST | Track user action |

### Request/Response Examples

**Create Guide**:
```json
POST /api/admin/guides
{
  "name": "Welcome Tour",
  "key": "welcome-tour",
  "description": "First-time user onboarding"
}

Response: 201 Created
{
  "id": "guide_123",
  "name": "Welcome Tour",
  "key": "welcome-tour",
  "status": "DRAFT",
  "version": 1,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Get Analytics**:
```json
GET /api/analytics/guides/guide_123?days=30

Response: 200 OK
{
  "guideId": "guide_123",
  "period": { "days": 30, "startDate": "...", "endDate": "..." },
  "summary": {
    "impressions": 1500,
    "starts": 1200,
    "completions": 950,
    "skips": 150,
    "averageTimeMs": 180000,
    "completionRate": 79,
    "startRate": 80
  },
  "dailyData": [...]
}
```

## 🔌 Extension & Integration

### Analytics Adapters

Integrate with external analytics platforms:

```typescript
import { IAnalyticsAdapter, analyticsService } from '@/lib/adapters/analytics'

// Create custom adapter
class MyAnalyticsAdapter implements IAnalyticsAdapter {
  async track(data: AnalyticsData): Promise<void> {
    // Send to your analytics platform
    await myAnalytics.track(data.eventType, {
      guideId: data.guideId,
      userId: data.userId,
      ...data.metadata
    })
  }

  getName(): string {
    return 'my-analytics'
  }
}

// Register adapter
analyticsService.registerAdapter(new MyAnalyticsAdapter())
```

### Notification Adapters

Send notifications through various channels:

```typescript
import { INotificationAdapter, notificationService } from '@/lib/adapters/notification'

// Register webhook adapter
const webhook = new WebhookNotificationAdapter(
  'https://your-webhook.com/notify',
  'your-secret'
)
notificationService.registerAdapter(webhook)

// Send notification
await notificationService.send({
  userId: 'user-123',
  channel: 'webhook',
  message: 'User completed onboarding!',
  metadata: { guideId: 'guide-123' }
})
```

### Event Subscribers

Listen to domain events:

```typescript
import { eventBus, DomainEventType } from '@/lib/events'

// Subscribe to guide completions
eventBus.on(DomainEventType.GUIDE_COMPLETED, async (event) => {
  const { guideId, userId, durationMs } = event.payload

  // Send celebration email
  await sendEmail(userId, 'Congrats on completing the tour!')

  // Award badge
  await awardBadge(userId, 'onboarding-complete')
})

// Subscribe to all events
eventBus.onAny(async (event) => {
  await logToExternalService(event)
})
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📊 Monitoring & Observability

### Structured Logging

```typescript
import { logger } from '@/lib/logger'

// Basic logging
logger.info('Guide created', { guideId, userId })
logger.error('Failed to save guide', error, { guideId })

// With context
const guideLogger = logger.withContext({ guideId: 'guide-123' })
guideLogger.info('Step added')
guideLogger.info('Step updated')
```

### Metrics Collection

```typescript
import { metrics } from '@/lib/metrics'

// Count events
metrics.counter('guide_created', 1, { template: 'welcome-tour' })

// Track timing
metrics.timing('guide_load_time', durationMs, { cached: false })

// Measure async operations
await metrics.measure('save_guide', async () => {
  return await prisma.guide.create(...)
}, { userId })

// Get statistics
const stats = metrics.getHistogramStats('guide_load_time')
console.log(`P95: ${stats.p95}ms`)
```

## 🚢 Deployment

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Application
NODE_ENV="production"
APP_PORT=3000

# Optional: External Services
ANALYTICS_ENDPOINT="https://analytics.example.com"
WEBHOOK_URL="https://webhooks.example.com"
LOG_LEVEL="info"
```

### Production Checklist

- [ ] Update `DATABASE_URL` to PostgreSQL
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for widget
- [ ] Set up SSL/TLS
- [ ] Configure logging level
- [ ] Set up monitoring/alerting
- [ ] Run migrations: `npm run db:migrate:deploy`
- [ ] Seed production data (if needed)
- [ ] Test widget integration on staging
- [ ] Set up backup strategy
- [ ] Configure CDN for widget.js

### Docker Deployment

```bash
# Build image
npm run docker:build

# Run with compose
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

## 📚 Additional Documentation

- [Phase 3 Overview](./docs/PHASE3_OVERVIEW.md) - Detailed feature roadmap
- [Architecture Guide](./docs/ARCHITECTURE.md) - System design and patterns
- [Integration Recipes](./docs/INTEGRATION_RECIPES.md) - Common integration patterns
- [API Reference](./docs/API_REFERENCE.md) - Complete API documentation

## 🗺️ Roadmap

### Completed ✅
- Core guide builder and management
- User progress tracking
- Analytics and metrics
- Template system
- Event-driven architecture
- Plugin/adapter system
- Docker support
- Comprehensive testing

### In Progress 🚧
- Analytics dashboard UI
- Template marketplace
- A/B testing framework

### Planned 📋
- Multi-language support
- Mobile SDK (React Native, Flutter)
- Advanced conditional logic
- Workflow approval system
- Team collaboration features
- Zapier/Make.com integrations
- GraphQL API
- Real-time collaboration

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

## 🙋 Support

- **Documentation**: Check `/docs` directory
- **Issues**: Open a GitHub issue
- **Demo**: Try `/demo` for live examples

---

Built with ❤️ using Next.js, TypeScript, Prisma, and modern best practices.
