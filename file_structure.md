├── src/
│ ├── app/ # Next.js App Router routes
│ │ ├── (public)/ # Public dashboard, leaderboard
│ │ ├── (auth)/ # Login, onboarding
│ │ ├── generator/ # Supplier portal
│ │ ├── driver/ # Driver mobile web app
│ │ ├── recycler/ # Recycler portal
│ │ ├── checker/ # Auditor portal
│ │ └── marketplace/ # Buyer portal
│ ├── components/ # shadcn/ui + custom
│ ├── lib/ # supabase client, utils, zod schemas
│ ├── hooks/ # useGeofence, usePickup, etc.
│ └── types/ # generated DB types
├── supabase/
│ ├── migrations/ # SQL migrations (schema)
│ ├── functions/ # Edge Functions
│ └── seed.sql
├── docs/ # PRD, ARCHITECTURE, SCHEMA, etc.
├── public/
├── CLAUDE.md
└── README.md