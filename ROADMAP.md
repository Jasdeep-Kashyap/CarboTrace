# CarboTrace — Implementation Roadmap

A phased plan to build the Waste-to-Carbon credit tracking platform from foundation to deployment.

---

## Phase 0 · Foundation & Cleanup _(Week 1)_

**Goal:** Clean architecture, working dev environment, routing skeleton.

- [x] Fix TypeScript `@types/node` error at root level
- [ ] Remove `apps/` monorepo directory and `pnpm-workspace.yaml`
- [ ] Consolidate root `package.json` — add React, Vite, Supabase, shadcn/ui, React Router deps
- [ ] Install and configure `react-router-dom` with route structure matching all 7 portals
- [ ] Set up Supabase client (`src/lib/supabase.ts`) with env variables
- [ ] Install base shadcn/ui components (Button, Card, Input, Dialog, Sheet, Table, Badge, etc.)
- [ ] Create shared layout shell (sidebar nav, topbar, responsive drawer)
- [ ] Update `Architecture.md` and `memory.md` to reflect actual stack
- [ ] Verify `pnpm dev` starts and basic route navigation works

**Deliverables:** Clean project, working dev server, navigable route skeleton with layout

---

## Phase 1 · Database & Auth _(Weeks 2–3)_

**Goal:** Complete database, authentication, and role-based access.

### Database
- [ ] Create Supabase project (if not exists)
- [ ] Apply SQL migrations from `database_schema.md`:
  - Extensions (PostGIS, pgcrypto, pg_trgm)
  - Enums (6 types)
  - Tables (15 tables with indexes)
  - RLS policies (all roles)
  - RPC functions (geofence, impact, leaderboard, footprint)
  - Triggers (updated_at)
  - Realtime subscriptions
- [ ] Seed waste_types table with initial categories and CO₂e factors
- [ ] Generate TypeScript types from Supabase schema (`supabase gen types`)
- [ ] Set up Zod schemas mirroring database types (`src/lib/schemas/`)

### Authentication
- [ ] Configure Supabase Auth (email/password + optional Google OAuth)
- [ ] Build login page (`/login`)
- [ ] Build registration page with role selection (`/register`)
- [ ] Build onboarding flow (profile completion, org creation/join)
- [ ] Implement auth context provider (`src/hooks/useAuth.ts`)
- [ ] Add protected route wrapper that redirects based on role
- [ ] Create profile auto-creation trigger (on `auth.users` insert → create `profiles` row)

**Deliverables:** Fully migrated database, working auth flow, role-based routing

---

## Phase 2 · Generator Portal _(Weeks 4–5)_

**Goal:** Waste producers can log pickups and upload verification photos.

- [ ] Generator dashboard (`/generator`) — overview cards (pending/completed pickups, CO₂e impact)
- [ ] "New Pickup" form:
  - Waste type selector (from `waste_types` table)
  - Estimated weight input with validation
  - QR code scanner (bin QR) using `html5-qrcode` or similar
  - Overhead photo upload to Supabase Storage
  - Address / location picker (browser Geolocation API)
- [ ] Photo verification edge function (`supabase/functions/verify-photo/`)
  - Accepts `{ pickup_request_id, photo_url }`
  - Sets `photo_verified` / `photo_flag_reason`
  - Initially: simple pass-through; later: AI-based contamination check
- [ ] Pickup request list with status badges and filtering
- [ ] Pickup detail view (timeline, status history)
- [ ] Dispute raising form (weight/photo disputes)
- [ ] WhatsApp notification stub (edge function placeholder for pickup confirmation)

**Deliverables:** Functional generator portal with pickup lifecycle management

---

## Phase 3 · Driver Portal _(Weeks 6–7)_

**Goal:** Drivers can follow routes, log arrivals via geofencing, and issue weighbridge receipts.

- [ ] Driver dashboard (`/driver`) — today's route, pending stops, completed count
- [ ] Route map view using Leaflet.js (or Mapbox):
  - Display all stops as markers
  - Current location tracking
  - Route polyline
- [ ] "Start Route" / "End Route" controls
- [ ] Geofencing system:
  - Browser Geolocation API (watchPosition) for continuous tracking
  - Arrival detection: call `geofence-check` edge function when within proximity
  - Edge function calls `is_within_geofence()` RPC (50m check)
  - Auto-log arrival event → lock payout
  - Departure event → release payout
- [ ] Weighbridge receipt creation:
  - Weight input
  - Method selection (scale / weighbridge / estimate)
  - Optional receipt photo upload
  - SMS confirmation trigger (edge function)
- [ ] Stop-by-stop progress tracking
- [ ] Route history view

**Deliverables:** Functional driver portal with geofenced route management

---

## Phase 4 · Recycler Portal _(Weeks 8–9)_

**Goal:** Recyclers can claim batches, log processing, and submit for audit.

- [ ] Recycler dashboard (`/recycler`) — incoming deliveries, active batches, completed count
- [ ] "Claim Batch" flow:
  - View incoming delivered pickups
  - Group into processing batch
  - Confirm weight on arrival (compare with weighbridge receipt)
- [ ] Processing log form:
  - Methodology description
  - Energy consumption (kWh)
  - Material yield (kg)
  - Batch products / outputs
- [ ] Lab test upload:
  - Document upload to Supabase Storage
  - Lab certificate URL
- [ ] "Submit for Audit" action → changes batch status to `submitted`
- [ ] Batch detail view with full audit trail
- [ ] Batch history and analytics

**Deliverables:** Functional recycler portal with processing lifecycle management

---

## Phase 5 · Checker / Audit Portal _(Weeks 10–11)_

**Goal:** Auditors can review submissions and mint carbon credits.

- [ ] Checker dashboard (`/checker`) — audit queue count, recent reviews, mint stats
- [ ] Audit queue view:
  - List of submitted batches awaiting review
  - Sort by submission date, methodology, org
- [ ] Audit review form:
  - View all related data: pickup logs, driver geofence events, weighbridge tickets, recycling yields, lab tests
  - Structured checklist (JSONB) for systematic review
  - Feedback text area
- [ ] Approval flow:
  - **Approve** → triggers `mint-credit` edge function
  - Edge function generates serial (`W2C-YYYY-NNNNNN` via `generate_credit_serial()`)
  - Creates `carbon_credits` row
  - Updates `impact_metrics` via `refresh_impact_metrics()`
- [ ] Rejection flow:
  - **Reject** / **Request Info** → sets `needs_info` status with feedback
  - Notification to recycler
- [ ] Audit history and statistics

**Deliverables:** Functional audit portal with credit minting

---

## Phase 6 · Marketplace & Buyer Portal _(Weeks 12–13)_

**Goal:** Buyers can browse, purchase, and retire carbon credits.

- [ ] Marketplace page (`/marketplace`):
  - Credit grid/list with cards showing serial, CO₂e, vintage year, price, methodology
  - Filters: vintage year, methodology, price range, status
  - Sort: price, CO₂e, date
- [ ] Credit detail page:
  - Full provenance trail (generator → driver → recycler → checker)
  - Verification badges
- [ ] Checkout flow:
  - Purchase form (payment stub — integrate Razorpay/Stripe later)
  - Payment reference capture
  - Auto-update credit status to `sold`
- [ ] Auto-retire option:
  - Retire credit immediately after purchase
  - Generate verified certificate PDF (edge function or client-side)
  - Update credit status to `retired`
- [ ] Buyer dashboard:
  - Purchased credits
  - Retired credits with certificates
  - Total offset impact
- [ ] Download certificate PDF

**Deliverables:** Functional marketplace with purchase and retirement flows

---

## Phase 7 · Public Dashboard _(Week 14)_

**Goal:** Stunning public landing page with live data.

- [ ] Hero section with animated counters (Supabase Realtime on `impact_metrics`):
  - Total waste diverted (kg/tonnes)
  - CO₂e avoided
  - Credits minted / retired
  - Organizations registered
- [ ] Organization leaderboard (via `get_leaderboard()` RPC)
  - Ranked cards with org logo, name, CO₂e, badges
- [ ] Interactive footprint calculator:
  - Input waste type and weight
  - Show CO₂e equivalent avoided
  - Comparisons (e.g., "equivalent to X car-trips saved")
- [ ] Waste reduction playbook section:
  - Tips and best practices
  - Link to resources
- [ ] CTA: "Register Your Organization" → `/register`
- [ ] SEO optimization (meta tags, OG tags, structured data)

**Deliverables:** Beautiful, data-driven public landing page

---

## Phase 8 · Admin Panel _(Week 15)_

**Goal:** Platform administration and oversight.

- [ ] Admin dashboard (`/admin`):
  - Platform-wide metrics overview
  - Recent activity feed
- [ ] Organization management:
  - CRUD for organizations
  - Tier management (free/basic/pro/enterprise)
  - Fee structures
- [ ] Dispute resolution:
  - Dispute queue
  - Investigation tools
  - Resolution actions
- [ ] User management:
  - View/search all profiles
  - Role changes
  - Account actions (suspend/activate)
- [ ] Immutable audit log:
  - Searchable log of all platform actions
  - Export to CSV

**Deliverables:** Functional admin panel with full platform oversight

---

## Phase 9 · Polish & Deploy _(Weeks 16–17)_

**Goal:** Production-ready, performant, deployed application.

- [ ] Responsive design audit — ensure all portals work on mobile/tablet
- [ ] PWA configuration (service worker, manifest, offline support for driver portal)
- [ ] Performance optimization:
  - Code splitting per route (React.lazy)
  - Image optimization
  - Query caching (React Query / TanStack Query)
- [ ] Error boundary components
- [ ] Loading skeletons for all data-heavy views
- [ ] Dark mode support
- [ ] Accessibility audit (ARIA labels, keyboard navigation, color contrast)
- [ ] Deploy frontend to Vercel or Netlify
- [ ] Configure Supabase production project
- [ ] Set up monitoring and error tracking (Sentry)
- [ ] Documentation: API docs, user guides, contribution guide

**Deliverables:** Deployed, production-ready application

---

## Timeline Summary

| Phase | Duration | Cumulative |
|-------|----------|------------|
| 0 — Foundation | 1 week | Week 1 |
| 1 — Database & Auth | 2 weeks | Week 3 |
| 2 — Generator Portal | 2 weeks | Week 5 |
| 3 — Driver Portal | 2 weeks | Week 7 |
| 4 — Recycler Portal | 2 weeks | Week 9 |
| 5 — Checker / Audit | 2 weeks | Week 11 |
| 6 — Marketplace | 2 weeks | Week 13 |
| 7 — Public Dashboard | 1 week | Week 14 |
| 8 — Admin Panel | 1 week | Week 15 |
| 9 — Polish & Deploy | 2 weeks | Week 17 |

**Total estimated duration: ~17 weeks**