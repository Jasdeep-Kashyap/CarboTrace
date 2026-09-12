# CarboTrace (Waste-to-Carbon Tracker) - Claude Context & Instructions

You are an expert full-stack developer assisting in the development of **CarboTrace**, an end-to-end Waste-to-Carbon (W2C) credit tracking application. Your goal is to help implement, refine, and architect this system based on the provided specifications.

---

## 1. Project Overview & Architecture
CarboTrace tracks the complete lifecycle of organic and recyclable waste from source collection to final processing/recycling, ultimately minting verified carbon credits (`W2C-YYYY-NNNNNN`) for marketplace trading and retirement.

- **Frontend:** React + Vite + TypeScript (Note: Previous docs referenced Next.js App Router; current project setup uses Vite + React with path alias `@/*` -> `./src/*`)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Backend / Database:** Supabase
  - PostgreSQL + PostGIS extension (geofencing for driver pickup arrival within 50m)
  - Supabase Auth (JWT with role-based Row Level Security)
  - Supabase Storage (waste overhead photos, weighbridge receipts, lab certificates)
  - Supabase Realtime (live updates for impact metrics, routes, pickups, and credits)
- **APIs / Serverless:** Supabase Edge Functions (Deno/TypeScript) & PostgreSQL RPCs
- **Package Manager:** `pnpm`

---

## 2. Directory Structure
```text
CarboTrace/
├── src/
│   ├── app/ or views/       # Application views/routes
│   │   ├── (public)/        # Public dashboard, leaderboard, footprint calculator
│   │   ├── (auth)/          # Login, onboarding, role selection
│   │   ├── generator/       # Waste supplier portal (log pickup, scan bin, upload photo)
│   │   ├── driver/          # Driver mobile web app (route map, 50m geofence, weighbridge)
│   │   ├── recycler/        # Recycler portal (claim batch, processing logs, lab tests)
│   │   ├── checker/         # Auditor/Checker portal (audit queue, mint/reject credit)
│   │   └── marketplace/     # Buyer portal (credit store, checkout, auto-retire)
│   ├── components/          # shadcn/ui + custom modular components
│   ├── lib/                 # Supabase client, utils, zod schemas
│   ├── hooks/               # useGeofence, usePickup, useRealtime, etc.
│   └── types/               # Generated database types & domain models
├── supabase/
│   ├── migrations/          # SQL migrations (PostGIS, schema, RLS policies)
│   ├── functions/           # Supabase Edge Functions
│   │   ├── verify-photo/
│   │   ├── geofence-check/
│   │   ├── weighbridge-receipt/
│   │   ├── whatsapp-reminder/
│   │   ├── mint-credit/
│   │   └── refresh-impact/
│   └── seed.sql             # Test seed data
├── CLAUDE.md                # Claude context & instructions
├── memory.md                # Project memory & status tracking
└── README.md
```

---

## 3. User Roles & End-to-End Flows

1. **Generator (Waste Producer):**
   - Login → `/generator` → "New Pickup" → Scan bin QR code → Enter waste type & estimated weight → **Upload overhead photo** → Verification check → Queued for pickup → WhatsApp confirmation alert.
   - *Edge cases:* Photo flagged for contamination/blurriness → re-upload prompt; weight dispute → raise dispute ticket.

2. **Driver (Collection Logistics):**
   - Login → `/driver` → Route map view → **Start Route** → Navigate to stop.
   - *Arrival:* 50m geofence event triggers arrival log & locks payout.
   - *Pickup:* Bin-swap → measure weight → generate weighbridge receipt & SMS both parties.
   - *Departure:* Departure logged → stop completed → payout released → proceed to next stop or End Route.

3. **Recycler (Processing Facility):**
   - Login → `/recycler` → Claim incoming batch → Confirm weight on arrival.
   - Log processing cycle (methodology, energy consumption, material yield).
   - Attach batch products & upload lab test report URL/doc → Submit batch for audit.

4. **Checker (Auditor / Verifier):**
   - Login → `/checker` → Review audit queue.
   - Inspect pickup logs, driver geofence records, weighbridge tickets, recycling yields, and lab tests.
   - **Approve:** Triggers `mint-credit` Edge Function to mint carbon credit with serial number format `W2C-YYYY-NNNNNN`.
   - **Reject / Request Info:** Mark as `needs_info` with audit feedback.

5. **Buyer (Carbon Marketplace):**
   - Login → `/marketplace` → Filter credits (vintage year, methodology, price per tCO₂e).
   - Checkout & payment → Auto-retire credit option → Download verified certificate PDF → Live public counter & leaderboard updates.

6. **Public Visitor:**
   - Visit `/` (No login required) → Live counters (total waste diverted, CO₂e avoided, credits minted/retired) → Org Leaderboard → Interactive Footprint Calculator → Waste Reduction Playbook → CTA to register org.

7. **Admin:**
   - `/admin` → Manage registered organizations, dispute resolution, fee structures, tiers, and immutable audit logs.

---

## 4. API & Backend Specifications

### Standard Response Envelope
```json
// Success
{ "ok": true, "data": { ... }, "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 } }

// Error
{
  "ok": false,
  "error": {
    "code": "GEOFENCE_VIOLATION",
    "message": "Driver is 182m from the pickup site (max 50m).",
    "details": { "distance_m": 182, "required_m": 50 }
  }
}
```

### PostgreSQL / PostGIS RPC Functions
- `is_within_geofence(stop_id uuid, lat float, lng float) → bool`: 50-meter proximity validation.
- `refresh_impact_metrics()`: Aggregate platform totals for public metrics.
- `get_org_footprint(org_id uuid, from_date date, to_date date)`: Aggregated footprint table.
- `get_leaderboard(limit_val int)`: Rank organizations by total CO₂e mitigated.
- `queue_next_route(route_date date) → uuid`: Batch verified pickups into an optimized driver route.

### Supabase Edge Functions (`https://<project>.supabase.co/functions/v1/`)
| Function | Auth Role | Payload | Side Effects / Action |
|---|---|---|---|
| `POST /verify-photo` | generator | `{ pickup_request_id, photo_url }` | AI/manual inspection flag, updates `photo_verified` |
| `POST /geofence-check` | driver | `{ route_stop_id, lat, lng, event_type }` | Records `geofence_events`, unlocks arrival/payout |
| `POST /weighbridge-receipt` | driver | `{ pickup_request_id, weight_kg, method, photo_url? }` | Stores receipt record, sends SMS confirmation |
| `POST /whatsapp-reminder` | service (cron) | — | Dispatches pickup reminder alerts via WhatsApp |
| `POST /mint-credit` | checker | `{ audit_review_id }` | Generates serial `W2C-YYYY-NNNNNN`, mints credit |
| `POST /refresh-impact` | service (cron) | — | Recalculates platform impact metrics rollup |

### Realtime Channels
- `impact_metrics` (public)
- `pickup_requests` (org scoped)
- `route_stops` (driver / route scoped)
- `carbon_credits` (`status=minted`)

---

## 5. Development Guidelines & Constraints
1. **Validation:** Every form and incoming API payload must be strictly validated with **Zod**.
2. **Security:** Implement comprehensive **Row Level Security (RLS)** in PostgreSQL for tenant isolation.
3. **UI / Styling:** Build clean, modular components using **Tailwind CSS** and **shadcn/ui** primitives.
4. **Error Handling:** Standardize errors using project error codes (`AUTH_REQUIRED`, `FORBIDDEN`, `GEOFENCE_MISS`, `PHOTO_REJECTED`, `WEIGHT_DISPUTE`, `AUDIT_INCOMPLETE`, `CREDIT_ALREADY_RETIRED`).
5. **Immediate Focus Areas:**
   - Complete `database_schema.md` with complete SQL table definitions, relations, and RLS policies.
   - Outline the phased implementation roadmap in `Roadmap.md`.
