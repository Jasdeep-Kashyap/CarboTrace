# Architecture

## Stack
- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (base-nova style)
- **Routing:** React Router v7
- **State/Data:** TanStack Query + Supabase Realtime
- **Backend:** Supabase (no separate API server)
- **Validation:** Zod

## Diagram
```
React + Vite (Vercel/Netlify)
  → Supabase JS Client
    → Supabase
       ├── Auth (JWT, roles via RLS)
       ├── PostgreSQL + PostGIS
       │   ├── 15 tables with RLS policies
       │   ├── 6 enums
       │   ├── 5 RPC functions (geofence, impact, leaderboard, footprint, serial gen)
       │   └── Realtime subscriptions (impact, pickups, routes, credits)
       ├── Storage (photos, receipts, certificates, lab reports)
       └── Edge Functions
           ├── verify-photo (generator photo inspection)
           ├── geofence-check (driver 50m proximity)
           ├── weighbridge-receipt (weight + SMS)
           ├── whatsapp-reminder (cron: pickup alerts)
           ├── mint-credit (checker → W2C serial)
           └── refresh-impact (cron: aggregate metrics)
```

## Route Structure
```
/                  → Public dashboard (no auth)
/login             → Authentication
/register          → Registration + role selection
/onboarding        → Profile completion + org setup

/generator         → Waste supplier portal
/driver            → Driver mobile web portal
/recycler          → Recycler/processing portal
/checker           → Auditor/checker portal
/marketplace       → Buyer credit marketplace
/admin             → Platform admin panel
```

## Key Design Decisions
1. **No separate API server** — Supabase handles auth, database, storage, serverless functions, and realtime. No need for Fastify/Express.
2. **PostGIS for geofencing** — 50m proximity check is a DB-level RPC, not client-side distance calculation.
3. **RLS for security** — Every table has row-level security policies. The frontend talks directly to Supabase; RLS ensures data isolation per role/org.
4. **Edge Functions for side effects** — Photo verification, credit minting, SMS/WhatsApp, and metric rollups run as serverless Deno functions.
5. **Single-page app** — React Router handles client-side navigation. Each role gets a dedicated portal with its own layout.