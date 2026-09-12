# Architecture

## Diagram
Next.js (Vercel) → Supabase JS → Supabase
├── Auth (JWT, roles via RLS)
├── Postgres + PostGIS
├── Storage (photos, receipts)
├── Realtime (impact, pickups, routes)
└── Edge Functions
├── verify-photo
├── geofence-check
├── weighbridge-receipt
├── whatsapp-reminder (cron)
├── mint-credit
└── refresh-impact (cron)