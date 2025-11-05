# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A personal ticket management system (Kanban board) for indie developers built with Next.js 15 and Firebase Firestore. The application provides real-time ticket synchronization and a responsive UI.

## Commands

### Development
```bash
npm run dev        # Start development server at http://localhost:3000
npm run build      # Build production application
npm start          # Start production server
npm run lint       # Run ESLint
```

### Environment Setup
```bash
cp .env.local.example .env.local   # Create environment config
```

Required environment variables (all prefixed with `NEXT_PUBLIC_`):
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore (real-time sync)
- **Hosting**: Vercel

### Core Architecture Patterns

**Client-Side Only Application**: All components use `'use client'` directive. There are no server components or server actions. This is a fully client-rendered application that interacts directly with Firebase Firestore.

**Real-time Data Synchronization**: The application uses Firebase's `onSnapshot` for real-time updates. The `Board` component subscribes to ticket changes via `subscribeToTickets()` in `lib/firestore.ts`, ensuring the UI automatically updates when data changes in Firestore.

**Path Aliasing**: Uses `@/*` alias for imports (configured in `tsconfig.json`), e.g., `import { Ticket } from '@/types/ticket'`

### Data Model

**Ticket**:
- `id`, `title`, `description`
- `status`: 'todo' | 'in-progress' | 'done'
- `priority`: 'low' | 'medium' | 'high'
- `labels`: string[] (array of label IDs)
- `createdAt`, `updatedAt`: Date

**Label**:
- `id`, `name`, `color`

### Key Files

- **`lib/firebase.ts`**: Firebase initialization and singleton pattern for app/db instances
- **`lib/firestore.ts`**: All Firestore CRUD operations (createTicket, updateTicket, deleteTicket, subscribeToTickets, label management)
- **`types/ticket.ts`**: TypeScript type definitions for Ticket, Label, TicketStatus, TicketPriority
- **`components/Board.tsx`**: Main Kanban view with three columns, uses real-time subscription
- **`components/TicketCard.tsx`**: Individual ticket display
- **`components/CreateTicketModal.tsx`**: Modal for ticket creation/editing

### Firebase Integration

- Firebase is initialized once using singleton pattern (checks `getApps().length`)
- All dates are stored as Firestore Timestamps and converted to JavaScript Date objects on retrieval
- Real-time updates use `onSnapshot` for live sync
- No authentication is currently implemented (security rules allow all read/write for single-user setup)

## Development Notes

- The app uses Next.js 15 App Router (not Pages Router)
- All components are client components - no server-side rendering
- TypeScript strict mode is enabled
- Firestore collections: `tickets` and `labels`
- UI uses German language strings
- No drag-and-drop functionality currently implemented (tickets are moved by editing status)

## Deployment

Deploy to Vercel with automatic Git integration. Add all `NEXT_PUBLIC_FIREBASE_*` environment variables in Vercel project settings.
