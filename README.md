# Guided Onboarding Flow Builder

A powerful, flexible system for creating interactive step-by-step tutorials and onboarding flows for web applications. Build guided tours that highlight elements on your page and provide contextual information to help users learn your application.

## Features

- **Visual Admin Interface**: Create and manage guides through an intuitive web UI
- **CSS Selector Targeting**: Target any element on your page using CSS selectors
- **Markdown Support**: Write rich, formatted content for your tutorial steps
- **Flexible Positioning**: Choose tooltip placement (top, right, bottom, left)
- **Route-Based Steps**: Guide users through different pages of your application
- **Embeddable Widget**: Simple JavaScript snippet for easy integration
- **Preview Mode**: Test your guides before deployment
- **Step Ordering**: Easily reorder steps with up/down controls
- **RESTful API**: Programmatic access to guide data

## Tech Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Database**: Prisma ORM + SQLite (easily swap for PostgreSQL)
- **Widget**: Vanilla JavaScript (framework-agnostic)
- **API**: Next.js API Routes

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd guided-tutorial-onboarding-flow-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev --name init
```

4. Seed the database with demo data:
```bash
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Admin Panel

Access the admin panel at `/admin` to:

1. **Create Guides**: Click "Create Guide" and provide:
   - Name: Display name for your guide
   - Key: Unique identifier (used in the widget)
   - Description: Optional description

2. **Manage Steps**: Click "Edit" on a guide to:
   - Add steps with CSS selectors
   - Write markdown content for each step
   - Set tooltip placement (top, right, bottom, left)
   - Specify route paths for multi-page tours
   - Reorder steps with up/down arrows
   - Delete or edit existing steps

3. **Preview**: Click "Preview" to test your guide in action

### Demo Application

Visit `/demo` to see a working example of the widget integration.

## Integration Guide

### Basic Integration

Add the widget to any HTML page:

```html
<!-- 1. Include the widget script -->
<script src="https://your-domain.com/widget.js"></script>

<!-- 2. Initialize with your guide key -->
<script>
  OnboardingWidget.init({
    guideKey: 'your-guide-key',
    apiBaseUrl: 'https://your-domain.com',
    onComplete: function() {
      console.log('Tour completed!');
    }
  });
</script>
```

### React/Next.js Integration

```tsx
'use client'

import { useEffect } from 'react'

export default function MyPage() {
  useEffect(() => {
    // Load widget script
    const script = document.createElement('script')
    script.src = '/widget.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if ((window as any).OnboardingWidget) {
        (window as any).OnboardingWidget.init({
          guideKey: 'my-guide',
          apiBaseUrl: window.location.origin,
        })
      }
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div>
      <h1 id="welcome">Welcome!</h1>
      <button id="feature-button">Click me</button>
    </div>
  )
}
```

### Widget Configuration Options

```javascript
OnboardingWidget.init({
  // Required: Your guide's unique key
  guideKey: 'welcome-tour',

  // Required: Base URL of your API
  apiBaseUrl: 'https://your-api.com',

  // Optional: Callback when tour completes
  onComplete: function() {
    localStorage.setItem('tour-completed', 'true');
  }
})
```

## API Reference

### Public API

#### Get Guide by Key

```http
GET /api/guides/:key
```

Returns guide data with all steps in order.

**Response:**
```json
{
  "id": "guide-id",
  "name": "Welcome Tour",
  "key": "welcome-tour",
  "description": "A tour of our app",
  "steps": [
    {
      "id": "step-id",
      "orderIndex": 0,
      "selector": "#welcome",
      "contentMarkdown": "# Welcome!\\nThis is your dashboard.",
      "placement": "bottom",
      "routePath": "/dashboard",
      "metaJson": null
    }
  ]
}
```

### Admin API

#### List All Guides

```http
GET /api/admin/guides
```

#### Create Guide

```http
POST /api/admin/guides
Content-Type: application/json

{
  "name": "My Guide",
  "key": "my-guide",
  "description": "Optional description"
}
```

#### Update Guide

```http
PUT /api/admin/guides/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "key": "my-guide",
  "description": "Updated description"
}
```

#### Delete Guide

```http
DELETE /api/admin/guides/:id
```

#### Create Step

```http
POST /api/admin/guides/:id/steps
Content-Type: application/json

{
  "selector": "#my-element",
  "contentMarkdown": "# Step Title\\nStep content",
  "placement": "bottom",
  "routePath": "/page",
  "orderIndex": 0
}
```

#### Update Step

```http
PUT /api/admin/steps/:id
Content-Type: application/json

{
  "selector": "#updated-selector",
  "contentMarkdown": "Updated content",
  "placement": "right",
  "orderIndex": 1
}
```

#### Delete Step

```http
DELETE /api/admin/steps/:id
```

## Database Schema

### Guide Model

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| name | String | Display name |
| key | String | Unique key for API access |
| description | String? | Optional description |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### GuideStep Model

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| guideId | String | Parent guide ID |
| orderIndex | Int | Display order (0-based) |
| selector | String | CSS selector for target element |
| contentMarkdown | String | Markdown content to display |
| placement | String | Tooltip position (top/right/bottom/left) |
| routePath | String? | Optional route path for multi-page tours |
| metaJson | String? | Optional JSON metadata |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Creating Effective Guides

### Best Practices

1. **Clear Selectors**: Use specific, stable CSS selectors
   - ✅ Good: `#user-profile-button`
   - ❌ Bad: `div > div > button:nth-child(3)`

2. **Concise Content**: Keep step content brief and actionable
   - Use markdown for formatting
   - Include clear calls-to-action

3. **Logical Flow**: Order steps in a natural progression
   - Start with overview
   - Guide through core features
   - End with next steps or resources

4. **Test Thoroughly**: Use preview mode to ensure:
   - All selectors find their targets
   - Tooltips are positioned correctly
   - Content renders properly
   - Flow makes sense

### Example Guide Structure

```markdown
Step 1 (Selector: #welcome-banner):
# Welcome to Our App!
Let's take a quick tour of the main features.

Step 2 (Selector: #create-button):
## Create Your First Project
Click this button to create a new project.

Step 3 (Selector: #settings-menu):
## Customize Your Settings
Access your preferences here.

Step 4 (Selector: #help-center):
## Need Help?
Our help center has guides and tutorials.
```

## Deployment

### Database Configuration

For production, use PostgreSQL instead of SQLite:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

3. Run migrations:
```bash
npx prisma migrate deploy
```

### Environment Variables

Required for production:
- `DATABASE_URL`: Database connection string
- `NEXT_PUBLIC_API_URL`: Public API base URL (for CORS)

### Hosting the Widget

The widget is served from `/public/widget.js`. For production:

1. Consider hosting on a CDN for better performance
2. Enable CORS headers in your API routes for cross-origin requests
3. Use versioning for cache busting: `widget.v1.js`

## Development

### Project Structure

```
├── app/
│   ├── admin/              # Admin UI pages
│   │   ├── page.tsx        # Guide list
│   │   └── guides/[id]/    # Guide detail & step management
│   ├── api/
│   │   ├── admin/          # Admin API routes
│   │   └── guides/         # Public API routes
│   ├── demo/               # Demo integration page
│   └── preview/            # Preview mode pages
├── lib/
│   └── prisma.ts           # Prisma client instance
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
└── public/
    └── widget.js           # Embeddable widget
```

### Running Locally

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Roadmap

- [ ] Analytics: Track guide completion rates
- [ ] A/B Testing: Test different guide variations
- [ ] Conditional Steps: Show steps based on user behavior
- [ ] Multimedia: Support for images and videos
- [ ] Templates: Pre-built guide templates
- [ ] Localization: Multi-language support
- [ ] User Segmentation: Target guides to specific user groups
- [ ] Advanced Triggers: Time-based, event-based, or behavioral triggers

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this in your own projects!

## Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review the demo application for examples

---

Built with ❤️ using Next.js, TypeScript, and Prisma
