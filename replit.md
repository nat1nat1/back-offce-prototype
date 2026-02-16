# TBA Back Office

## Overview

TBA Back Office is a full-stack inventory management and item search application. It provides a dashboard interface for searching, viewing, and managing auction items with features including advanced filtering, item details editing across multiple tabs (Details, Media & Specs, Logistics, Pricing, Buyer Info), and release notes tracking.

The application follows a monorepo structure with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API with typed routes defined in `shared/routes.ts`
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod for runtime validation, drizzle-zod for schema-to-validator generation

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/   # UI components (shadcn/ui + custom)
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # Page components
│       └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations layer
│   └── db.ts         # Database connection
├── shared/           # Shared code between frontend/backend
│   ├── schema.ts     # Drizzle database schema + Zod validators
│   └── routes.ts     # API route definitions with types
└── migrations/       # Drizzle database migrations
```

### Data Flow
1. Frontend components use custom hooks (`use-items.ts`, `use-release-notes.ts`) that wrap TanStack Query
2. Hooks call the Express API endpoints defined in `shared/routes.ts`
3. Express routes delegate to the storage layer (`server/storage.ts`)
4. Storage layer uses Drizzle ORM to interact with PostgreSQL

### Key Design Decisions
- **Shared Types**: Route definitions and schemas live in `shared/` to ensure type safety across frontend and backend
- **Path Aliases**: TypeScript path aliases (`@/` for client, `@shared/` for shared) simplify imports
- **Component Library**: shadcn/ui provides accessible, customizable components without the weight of a full design system
- **Database Push**: Uses `drizzle-kit push` for schema synchronization rather than traditional migrations

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database toolkit for TypeScript with type-safe queries

### Frontend Libraries
- **Radix UI**: Headless UI primitives for accessible components
- **TanStack Query**: Async state management and caching
- **date-fns**: Date formatting and manipulation
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Frontend build tool with HMR support
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required)