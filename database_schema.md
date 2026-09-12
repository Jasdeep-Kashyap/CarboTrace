# Database Schema

Postgres + PostGIS. All PKs `uuid default gen_random_uuid()`, timestamps `timestamptz default now()`.

## Enums
```sql
user_role: generator|driver|recycler|checker|buyer|admin
org_type: hotel|market|factory|housing_society|restaurant|canteen|recycler|checker|buyer|logistics|municipality
waste_type: food_wet|garden|agricultural|industrial_organic|mixed_organic
bin_status: clean|assigned|full|in_transit|sanitizing|maintenance
pickup_status: draft|photo_pending|photo_verified|queued|assigned|en_route|arrived|weighed|completed|cancelled|flagged
route_status: planned|active|completed|cancelled
batch_status: in_transit|received|processing|processed|rejected
processing_method: pyrolysis|anaerobic_digestion|composting|gasification|hydrothermal
product_type: biochar|biogas|biomethane|clean_fuel|compost|bio_oil
audit_status: pending|in_review|approved|rejected|needs_info
credit_status: minted|listed|sold|retired|cancelled
order_status: pending|paid|fulfilled|cancelled|refunded
notification_channel: whatsapp|sms|email|in_app
notification_type: pickup_reminder|receipt_ready|audit_result|credit_minted|credit_sold|dispute_raised|weekly_footprint