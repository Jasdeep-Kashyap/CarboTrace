# CarboTrace - Project Memory & Context

This document serves as a living memory file for any AI assistant working on the CarboTrace project. 
**Instructions for AI:** Please read this file to understand the project context. Update this file as you make significant architectural decisions, complete milestones, or learn important project-specific patterns.

## 1. Project Overview
CarboTrace is a Waste-to-Carbon (W2C) credit tracking application. It tracks the lifecycle of waste from collection to recycling and mints verified carbon credits.

## 2. Tech Stack & Architecture
- **Frontend:** React 19 + Vite + TypeScript (single Vite app at project root, NOT a monorepo)
- **Styling:** Tailwind CSS v4 + shadcn/ui (base-nova style, configured in `components.json`)
- **Routing:** React Router v7 (`react-router-dom`)
- **State/Data:** TanStack Query for server state + Supabase Realtime for live updates
- **Backend/DB:** Supabase (Auth via JWT/RLS, PostgreSQL + PostGIS for geofencing, Storage, Realtime, Edge Functions)
- **Validation:** Zod schemas for all forms and API payloads
- **Package Manager:** `pnpm`

## 3. User Roles & Flows
- **Generator:** Logs waste, uploads verification photos.
- **Driver:** Follows route map, geofenced stops (50m), logs weight, issues receipt.
- **Recycler:** Claims batch, logs processing methods and yield.
- **Checker (Auditor):** Reviews logs and mints carbon credits.
- **Buyer:** Marketplace access to buy and retire credits.
- **Admin:** Manages platform, disputes, and organizations.
- **Public:** Views dashboard, footprint calculators, and leaderboard.

## 4. Guidelines & Rules
1. Ensure strict **TypeScript** and **Zod** validation on all routes and components.
2. Keep Supabase queries secure using **Row Level Security (RLS)**.
3. Separate UI components into reusable **shadcn/ui** structures (located in `src/components`).
4. Follow the standard API response envelope: `{ ok, data, meta }` or `{ ok, error }`.
5. Path alias: `@/*` → `./src/*` (configured in `tsconfig.json` and `vite.config.ts`).

## 5. Current State & Recent Changes
- ✅ Initialized Tailwind CSS v4 and updated `vite.config.ts` and `index.css`.
- ✅ Configured path aliases (`@/*` → `./src/*`) in `tsconfig.json`.
- ✅ shadcn/ui initialized (`components.json` with base-nova style).
- ✅ Fixed `@types/node` error (installed at root level).
- ✅ **Removed `apps/` monorepo** (was Fastify API + duplicate web app). Now single Vite app + Supabase backend.
- ✅ Deleted `pnpm-workspace.yaml`.
- ✅ Updated root `package.json` with all dependencies (React, Supabase, React Router, TanStack Query, Zod, shadcn).
- ✅ Completed `database_schema.md` — 15 tables, 6 enums, PostGIS, RLS, RPCs, triggers, realtime.
- ✅ Completed `Roadmap.md` — 10-phase implementation plan.
- ✅ Updated `Architecture.md` to reflect actual Vite + React + Supabase stack.

## 6. Open Tasks / TODOs
- [x] Run `pnpm install` to install new dependencies.
- [x] Set up React Router route skeleton with all portals.
- [ ] Create Supabase project and apply migrations.
- [ ] Install base shadcn/ui components (Button, Card, Input, etc.).
- [x] Build shared layout shell (sidebar, topbar, responsive drawer).
- [x] Generate TypeScript types from Supabase schema.
- [x] Create Zod schemas mirroring database types (`src/lib/schemas/`).
- [x] Implement React.lazy code splitting and ErrorBoundary.
- [x] Complete PWA setup for offline Driver support.
- [x] Build missing portal views (ClaimBatch, AuditLog, Onboarding).

## 7. Key Files
- `CLAUDE.md` — Full project specification and context.
- `claude_prompt.md` — Prompt reference for AI assistants.
- `database_schema.md` — Complete PostgreSQL schema with 15 tables, RLS, RPCs.
- `Roadmap.md` — 10-phase implementation roadmap.
- `Architecture.md` — Architecture diagram and design decisions.
- `Api_spec.md` — RPC and Edge Function API reference.
- `User_Flows.md` — User role flows and edge cases.
- `components.json` — shadcn/ui configuration.
