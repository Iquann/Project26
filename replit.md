# Timber Taylor Doodles - Puppy Breeder Website

## Overview

This is a full-stack web application for Timber Taylor Doodles, a family-owned puppy breeder business in Utah specializing in Mini Goldendoodles and Bernedoodles. The application provides a public-facing website for customers to browse available puppies, view pricing, and place deposits, along with an admin dashboard for managing inventory, orders, payments, and users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom warm, family-friendly theme (CSS variables for theming)
- **Build Tool**: Vite with React plugin
- **Typography**: Montserrat (headings) and Open Sans (body) from Google Fonts

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Pattern**: RESTful JSON APIs under `/api/*` routes
- **Session Management**: express-session with MemoryStore (development), connect-pg-simple available for production
- **Authentication**: Custom session-based auth with bcryptjs password hashing
- **Role-Based Access Control**: Three roles - admin, manager, viewer

### Data Storage
- **Database**: PostgreSQL via Neon Serverless
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Key Tables**: users, puppies, litters, deposits, mailingList, paymentMethods, emailSettings, notifications, siteSettings

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   ├── db.ts         # Drizzle database connection
│   └── paypal.ts     # PayPal integration
├── shared/           # Shared code (schema, types)
└── migrations/       # Drizzle database migrations
```

### Key Design Decisions
1. **Monorepo Structure**: Client and server in same repo with shared types for type safety
2. **Path Aliases**: `@/` for client, `@shared/` for shared code
3. **Component Library**: shadcn/ui chosen for customizable, accessible components
4. **Database Access Pattern**: Storage interface abstracting Drizzle queries for testability

## External Dependencies

### Payment Processing
- **PayPal**: Server SDK (`@paypal/paypal-server-sdk`) for deposit payments
  - Environment variables: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
  - Sandbox mode for development, Production mode based on `NODE_ENV`
- **Alternative Payments**: UI supports Cash App, Zelle, Apple Pay, Crypto (manual processing)

### Database
- **Neon Serverless PostgreSQL**: `@neondatabase/serverless`
  - Connection via `DATABASE_URL` environment variable
  - WebSocket configuration for serverless compatibility

### Email (Planned)
- **Nodemailer**: Available in dependencies for transactional emails

### Development Tools
- **Replit Plugins**: vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner
- **Database Migrations**: Drizzle Kit for schema push (`npm run db:push`)

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `PAYPAL_CLIENT_ID` - PayPal API credentials
- `PAYPAL_CLIENT_SECRET` - PayPal API credentials
- `NODE_ENV` - development/production flag