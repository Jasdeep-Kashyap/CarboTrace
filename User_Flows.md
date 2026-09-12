# User Flows
use userflow for better web page structure understanding
## Generator
Login → `/generator` → New Pickup → scan bin QR → waste type + weight → **upload overhead photo** → verify → queued → WhatsApp confirmation.
Edge: photo flagged → re-upload; weight dispute → raise.

## Driver
Login → `/driver` → route map → **Start Route** → arrive at stop (50 m geofence logs arrival, locks payout) → bin-swap → weigh → receipt SMS → departure (payout released) → End Route.

## Recycler
Login → claim batch → confirm weight on arrival → log processing (method, energy, yield) → add products (lab test URL) → submit for audit.

## Checker
Login → audit queue → open review (logs, lab, safety) → **Approve** → `mint-credit` mints serial `W2C-YYYY-NNNNNN`. Or **Reject** → needs_info.

## Buyer
Login → `/marketplace` → filter (vintage, methodology, price) → checkout → pay → auto-retire → certificate PDF → public dashboard updates live.

## Public
Visit `/` (no login) → live counters → leaderboard → footprint calculator → reduction playbook → CTA "Register org".

## Admin
`/admin` → orgs, disputes, fees, audit log → resolve disputes → manage tiers → export log.