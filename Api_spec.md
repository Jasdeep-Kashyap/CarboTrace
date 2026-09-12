# API Spec

Client → DB via Supabase JS (RLS-enforced). Cross-cutting via RPC + Edge Functions.

## RPCs
| Fn | Purpose |
|----|---------|
| `is_within_geofence(stop,lat,lng) → bool` | 50 m check |
| `refresh_impact_metrics()` | Recalculate public counters |
| `get_org_footprint(org,from,to)` | Org footprint table |
| `get_leaderboard(limit)` | Top orgs by CO₂e |
| `queue_next_route(date) → uuid` | Batch verified pickups into route |

## Edge Functions
Base: `https://<proj>.supabase.co/functions/v1`

| Route | Auth | Body | Side effects |
|-------|------|------|--------------|
| POST `/verify-photo` | generator | `{pickup_request_id, photo_url}` | sets `photo_verified`, `photo_flag_reason ` |
| POST `/geofence-check` | driver | `{route_stop_id, lat, lng, event_type}` | inserts `geofence_events`, sets verified/payout |
| POST `/weighbridge-receipt` | driver | `{pickup_request_id, weight_kg, method, photo_url?}` | inserts receipt, SMS both parties |
| POST `/whatsapp-reminder` | service (cron) | — | sends WhatsApp, parses replies |
| POST `/mint-credit` | checker | `{audit_review_id}` | inserts `carbon_credits`, refresh impact |
| POST `/refresh-impact` | service | — | rollup |

## Realtime Subs
`impact_metrics` (public) · `pickup_requests` (org) · `route_stops` (route) · `carbon_credits` (status=minted).

## Error Codes
`AUTH_REQUIRED` · `FORBIDDEN` · `GEOFENCE_MISS` · `PHOTO_REJECTED` · `WEIGHT_DISPUTE` · `AUDIT_INCOMPLETE` · `CREDIT_ALREADY_RETIRED`