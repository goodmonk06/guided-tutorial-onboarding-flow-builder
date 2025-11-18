# Changelog

All notable changes to the Guided Onboarding Flow Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-18

### 🎉 Initial Production Release

This release represents a complete transformation from a basic prototype to a production-ready, enterprise-grade onboarding system.

### Added

#### Domain Model (8 New Entities)
- **GuideTemplate**: Reusable guide patterns with categories and usage tracking
- **GuideVersion**: Version history and rollback capabilities
- **UserProgress**: Individual user journey tracking with completion status
- **GuideAnalytics**: Aggregate metrics (impressions, starts, completions, skips)
- **GuideEvent**: Comprehensive audit log and event stream
- **GuideStyle**: Per-guide custom styling and branding
- **GuideTrigger**: Conditional display logic with configurable triggers
- **Enums**: GuideStatus (DRAFT/PUBLISHED/ARCHIVED), TriggerType, EventType

#### Infrastructure
- **Validation**: Zod schemas for all API endpoints with comprehensive error messages
- **Error Handling**: Centralized error handling with custom error classes (ValidationError, NotFoundError, ConflictError)
- **Logging**: Structured logging system with contextual information and log levels
- **Metrics**: Full metrics collection (counters, gauges, histograms) with aggregation
- **Event System**: Domain event bus with pub/sub pattern and event history
- **Plugin Architecture**: Adapter interfaces for analytics, notifications, and storage

#### API Endpoints
- `GET /api/templates` - List guide templates with category filtering
- `GET /api/templates/:key` - Get template details
- `GET /api/analytics/guides/:id` - Comprehensive analytics with summary statistics
- `GET /api/progress/:userId` - Get user progress across guides
- `POST /api/progress/track` - Track user actions (start, complete, skip, step_view)

#### Testing
- Vitest test framework with 25+ unit tests
- Test setup with mocking infrastructure
- Validation test suite for all schemas
- Error handling test suite
- Test coverage reporting

#### Docker & Deployment
- Dockerfile with multi-stage build
- docker-compose.yml with PostgreSQL
- .dockerignore for optimized builds
- Environment configuration (.env.example)
- Production deployment checklist

#### Documentation
- Comprehensive README with architecture diagrams
- Phase 3 Overview document (PHASE3_OVERVIEW.md)
- API reference with request/response examples
- Integration guides for React, Vue, and vanilla JS
- Extension/plugin documentation
- Monitoring and observability guide

#### Developer Experience
- Enhanced package.json scripts:
  * test, test:watch, test:ui, test:coverage
  * db:migrate, db:push, db:seed, db:studio
  * docker:build, docker:up, docker:down, docker:logs
  * typecheck, lint, lint:fix, format
- Seed script with comprehensive demo data (5 templates, 3 guides, analytics, progress)
- Pre-configured development environment

### Changed

#### Enhanced Existing Features
- **Guide Model**: Added status, version, priority, tags, templateId, styleId fields
- **GuideStep Model**: Added delayMs, required, enhanced metaJson support
- **API Endpoints**: Updated all admin endpoints with validation and error handling
- **Widget**: Ready for progress tracking integration (schema complete)

#### Migration Path
- Backward-compatible database migration
- Existing guides automatically set to PUBLISHED status
- All guide keys remain valid

### Technical Improvements
- End-to-end TypeScript type safety
- Prisma schema with indexes for performance
- Memory-efficient event and metric storage
- Proper error boundaries throughout the stack
- Extensible architecture for future growth

## [0.1.0] - 2024-11-18

### Initial Release
- Basic guide CRUD operations
- Step management with ordering
- Public API for widget
- Embeddable widget
- Admin UI
- Demo page
- SQLite database
- Basic seed data

---

## Migration Guide

### Upgrading from 0.1.0 to 1.0.0

**Database**:
```bash
# Run migration
npm run db:migrate

# Re-seed with new templates and data
npm run db:seed
```

**Code Changes**:
- No breaking changes to widget API
- Admin API endpoints maintain backward compatibility
- New optional fields in Guide model (status defaults to DRAFT)

**New Features to Integrate**:
1. Progress Tracking: Add `POST /api/progress/track` calls to widget
2. Analytics: Use `GET /api/analytics/guides/:id` for dashboard
3. Templates: Use template system for faster guide creation
4. Events: Subscribe to domain events for custom behaviors
5. Adapters: Register custom analytics/notification adapters

---

## Roadmap

### v1.1.0 (Planned)
- Analytics dashboard UI
- Template marketplace
- Guide versioning UI
- Batch operations API

### v1.2.0 (Planned)
- A/B testing framework
- Advanced conditional logic
- Workflow approval system
- Team collaboration features

### v2.0.0 (Future)
- Multi-language support
- Mobile SDKs
- GraphQL API
- Real-time collaboration
- Zapier/Make.com integrations
