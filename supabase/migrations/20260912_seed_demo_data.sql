-- =============================================================================
-- CarboTrace Waste-to-Carbon (W2C) Mock Demonstration Seed Data
-- Standardized against ISO 14064-2 MRV Protocol
-- =============================================================================

-- Enable RLS policies for demo access across CarboTrace application tables
DO $$ 
DECLARE 
  t text;
  app_tables text[] := ARRAY[
    'organisations',
    'profiles',
    'bins',
    'pickup_requests',
    'routes',
    'route_stops',
    'processing_batches',
    'audit_reviews',
    'carbon_credits',
    'disputes',
    'impact_metrics'
  ];
BEGIN
  FOREACH t IN ARRAY app_tables LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
      EXECUTE format('DROP POLICY IF EXISTS "Allow public demo access" ON public.%I;', t);
      EXECUTE format('CREATE POLICY "Allow public demo access" ON public.%I FOR ALL TO public USING (true) WITH CHECK (true);', t);
    END IF;
  END LOOP;
END $$;

-- ─── 1. ORGANISATIONS ────────────────────────────────────────────────────────
INSERT INTO organisations (id, name, type, address, city, state, pincode, gstin, contact_email, contact_phone, verified, tier, total_co2e_kg, total_waste_kg, created_at)
VALUES
  ('11111111-1111-4111-8111-000000000001', 'The Leela Palace', 'hotel', '23, Old Airport Rd, Kodihalli', 'Bengaluru', 'Karnataka', '560008', '29AABCT1332L1ZB', 'eco@leela.in', '+91-80-25212345', true, 'pro', 48200, 121500, now() - INTERVAL '60 days'),
  ('11111111-1111-4111-8111-000000000002', 'Bengaluru APMC Market', 'market', 'Yeshwanthpur APMC Yard, Tumkur Rd', 'Bengaluru', 'Karnataka', '560022', '29AADCB1234K1ZC', 'waste@apmc.karnataka.gov.in', '+91-80-23371234', true, 'enterprise', 94600, 237000, now() - INTERVAL '65 days'),
  ('11111111-1111-4111-8111-000000000003', 'Vatika Housing Society', 'housing_society', 'Block A, Sector 49, Vatika City', 'Gurugram', 'Haryana', '122018', NULL, 'rwa@vatika.in', '+91-124-4567890', true, 'basic', 12400, 31200, now() - INTERVAL '45 days'),
  ('11111111-1111-4111-8111-000000000004', 'GreenCycle Industries', 'recycler', 'Plot 42, Industrial Area Phase 2', 'Pune', 'Maharashtra', '411019', '27AABCG4567M1ZD', 'ops@greencycle.in', '+91-20-27150000', true, 'pro', 0, 0, now() - INTERVAL '55 days'),
  ('11111111-1111-4111-8111-000000000005', 'Infosys ESG Fund', 'buyer', 'Infosys BPM Tower, Electronics City, Hosur Road', 'Bengaluru', 'Karnataka', '560100', '29AAACI1681G1ZK', 'esg@infosys.com', '+91-80-28520261', true, 'enterprise', 0, 0, now() - INTERVAL '70 days'),
  ('11111111-1111-4111-8111-000000000006', 'CleanCity Municipal Logistics', 'logistics', 'Corporation Yard, Shivaji Nagar', 'Bengaluru', 'Karnataka', '560051', '29BBBCM9988P1ZZ', 'logistics@cleancity.gov.in', '+91-80-22221111', true, 'enterprise', 0, 0, now() - INTERVAL '50 days')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  pincode = EXCLUDED.pincode,
  gstin = EXCLUDED.gstin,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  verified = EXCLUDED.verified,
  tier = EXCLUDED.tier,
  total_co2e_kg = EXCLUDED.total_co2e_kg,
  total_waste_kg = EXCLUDED.total_waste_kg;

-- ─── 2. USER PROFILES ─────────────────────────────────────────────────────────
INSERT INTO profiles (id, user_id, full_name, email, role, org_id, phone, avatar_url, created_at, updated_at)
VALUES
  ('22222222-2222-4222-8222-000000000001', '33333333-3333-4333-8333-000000000001', 'Priya Sharma', 'priya@leela.in', 'generator', '11111111-1111-4111-8111-000000000001', '+91-9876543210', NULL, now() - INTERVAL '60 days', now()),
  ('22222222-2222-4222-8222-000000000002', '33333333-3333-4333-8333-000000000002', 'Ravi Kumar', 'ravi@logistics.in', 'driver', '11111111-1111-4111-8111-000000000006', '+91-9988776655', NULL, now() - INTERVAL '55 days', now()),
  ('22222222-2222-4222-8222-000000000003', '33333333-3333-4333-8333-000000000003', 'Anil Mehta', 'anil@greencycle.in', 'recycler', '11111111-1111-4111-8111-000000000004', '+91-9022334455', NULL, now() - INTERVAL '50 days', now()),
  ('22222222-2222-4222-8222-000000000004', '33333333-3333-4333-8333-000000000004', 'Dr. Meena Nair', 'meena@carbon-audit.in', 'checker', NULL, '+91-9123456789', NULL, now() - INTERVAL '48 days', now()),
  ('22222222-2222-4222-8222-000000000005', '33333333-3333-4333-8333-000000000005', 'Siddharth Rao', 'sid.rao@infosys.com', 'buyer', '11111111-1111-4111-8111-000000000005', '+91-9000123456', NULL, now() - INTERVAL '70 days', now()),
  ('22222222-2222-4222-8222-000000000006', '33333333-3333-4333-8333-000000000006', 'Admin CarboTrace', 'admin@carbotrace.in', 'admin', NULL, '+91-9888877777', NULL, now() - INTERVAL '90 days', now())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  org_id = EXCLUDED.org_id,
  phone = EXCLUDED.phone,
  updated_at = now();

-- ─── 3. SMART BINS ───────────────────────────────────────────────────────────
INSERT INTO bins (id, org_id, qr_code, location_lat, location_lng, location_label, capacity_kg, status, last_pickup_at, created_at)
VALUES
  ('44444444-4444-4444-8444-000000000001', '11111111-1111-4111-8111-000000000001', 'BIN-LEELA-MAIN-01', 12.958200, 77.648400, 'Main Kitchen Waste Bay', 250, 'assigned', now() - INTERVAL '2 days', now() - INTERVAL '40 days'),
  ('44444444-4444-4444-8444-000000000002', '11111111-1111-4111-8111-000000000001', 'BIN-LEELA-BANQUET-02', 12.958500, 77.648900, 'Banquet & Catering Exit', 300, 'full', now() - INTERVAL '1 day', now() - INTERVAL '40 days'),
  ('44444444-4444-4444-8444-000000000003', '11111111-1111-4111-8111-000000000002', 'BIN-APMC-VEG-01', 13.021800, 77.549500, 'APMC Vegetable Wholesale Section A', 800, 'clean', now() - INTERVAL '12 hours', now() - INTERVAL '50 days'),
  ('44444444-4444-4444-8444-000000000004', '11111111-1111-4111-8111-000000000003', 'BIN-VATIKA-TOWER-A', 28.408900, 77.041900, 'Block A Basement Organic Segregation', 150, 'maintenance', now() - INTERVAL '5 days', now() - INTERVAL '30 days')
ON CONFLICT (id) DO UPDATE SET
  org_id = EXCLUDED.org_id,
  qr_code = EXCLUDED.qr_code,
  location_lat = EXCLUDED.location_lat,
  location_lng = EXCLUDED.location_lng,
  location_label = EXCLUDED.location_label,
  capacity_kg = EXCLUDED.capacity_kg,
  status = EXCLUDED.status;

-- ─── 4. PICKUP REQUESTS ───────────────────────────────────────────────────────
INSERT INTO pickup_requests (id, org_id, generator_profile_id, bin_id, waste_type, estimated_weight_kg, actual_weight_kg, pickup_address, location_lat, location_lng, status, photo_url, photo_verified, photo_flag_reason, tracking_code, notes, created_at, updated_at)
VALUES
  ('55555555-5555-4555-8555-000000000001', '11111111-1111-4111-8111-000000000001', '22222222-2222-4222-8222-000000000001', '44444444-4444-4444-8444-000000000001', 'food_wet', 120, 118, 'The Leela Palace, 23 Old Airport Rd, Bengaluru', 12.958200, 77.648400, 'completed', '/mock/waste-photo-1.jpg', true, NULL, 'W2C-2026-001XA2', 'Verified moisture < 12%', now() - INTERVAL '2 days', now() - INTERVAL '2 days' + INTERVAL '4 hours'),
  ('55555555-5555-4555-8555-000000000002', '11111111-1111-4111-8111-000000000001', '22222222-2222-4222-8222-000000000001', '44444444-4444-4444-8444-000000000002', 'food_wet', 95, NULL, 'The Leela Palace Kitchen Exit, Bengaluru', 12.958500, 77.648900, 'queued', '/mock/waste-photo-2.jpg', true, NULL, 'W2C-2026-002BX7', 'Morning kitchen waste ready for pickup', now() - INTERVAL '6 hours', now() - INTERVAL '5 hours'),
  ('55555555-5555-4555-8555-000000000003', '11111111-1111-4111-8111-000000000001', '22222222-2222-4222-8222-000000000001', NULL, 'garden', 45, NULL, 'Leela Garden Section, Bengaluru', 12.958000, 77.648000, 'photo_pending', NULL, false, NULL, 'W2C-2026-003CY9', 'Pruning waste awaiting photo verification', now() - INTERVAL '3 hours', now() - INTERVAL '3 hours'),
  ('55555555-5555-4555-8555-000000000004', '11111111-1111-4111-8111-000000000002', '22222222-2222-4222-8222-000000000001', '44444444-4444-4444-8444-000000000003', 'mixed_organic', 350, 342, 'APMC Market, Yeshwanthpur, Bengaluru', 13.021800, 77.549500, 'completed', '/mock/waste-photo-3.jpg', true, NULL, 'W2C-2026-004DZ1', 'Bulk market vegetable rejects', now() - INTERVAL '1 day', now() - INTERVAL '1 day' + INTERVAL '6 hours'),
  ('55555555-5555-4555-8555-000000000005', '11111111-1111-4111-8111-000000000003', '22222222-2222-4222-8222-000000000001', '44444444-4444-4444-8444-000000000004', 'food_wet', 60, NULL, 'Vatika Housing Society, Block A, Gurugram', 28.408900, 77.041900, 'flagged', '/mock/waste-photo-4.jpg', false, 'Mixed plastics detected in food waste bin', 'W2C-2026-005EW3', 'Requires re-sorting before driver dispatch', now() - INTERVAL '10 hours', now() - INTERVAL '9 hours')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  actual_weight_kg = EXCLUDED.actual_weight_kg,
  photo_verified = EXCLUDED.photo_verified,
  photo_flag_reason = EXCLUDED.photo_flag_reason,
  updated_at = now();

-- ─── 5. LOGISTICS ROUTES & STOPS ──────────────────────────────────────────────
INSERT INTO routes (id, driver_profile_id, route_date, status, started_at, completed_at, total_stops, completed_stops, total_weight_kg, created_at)
VALUES
  ('66666666-6666-4666-8666-000000000001', '22222222-2222-4222-8222-000000000002', CURRENT_DATE, 'active', now() - INTERVAL '2 hours', NULL, 3, 1, 118, now() - INTERVAL '4 hours'),
  ('66666666-6666-4666-8666-000000000002', '22222222-2222-4222-8222-000000000002', CURRENT_DATE - 1, 'completed', now() - INTERVAL '1 day' - INTERVAL '6 hours', now() - INTERVAL '1 day' - INTERVAL '1 hour', 4, 4, 518, now() - INTERVAL '1 day' - INTERVAL '8 hours')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  completed_stops = EXCLUDED.completed_stops,
  total_weight_kg = EXCLUDED.total_weight_kg;

INSERT INTO route_stops (id, route_id, pickup_request_id, sequence, status, arrived_at, departed_at, weight_kg, receipt_photo_url, sms_sent, payout_released, created_at)
VALUES
  ('77777777-7777-4777-8777-000000000001', '66666666-6666-4666-8666-000000000001', '55555555-5555-4555-8555-000000000001', 1, 'completed', now() - INTERVAL '90 minutes', now() - INTERVAL '60 minutes', 118, '/mock/weigh-receipt-1.jpg', true, true, now() - INTERVAL '4 hours'),
  ('77777777-7777-4777-8777-000000000002', '66666666-6666-4666-8666-000000000001', '55555555-5555-4555-8555-000000000002', 2, 'arrived', now() - INTERVAL '20 minutes', NULL, NULL, NULL, false, false, now() - INTERVAL '4 hours'),
  ('77777777-7777-4777-8777-000000000003', '66666666-6666-4666-8666-000000000001', '55555555-5555-4555-8555-000000000004', 3, 'pending', NULL, NULL, NULL, NULL, false, false, now() - INTERVAL '4 hours')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  arrived_at = EXCLUDED.arrived_at,
  departed_at = EXCLUDED.departed_at,
  weight_kg = EXCLUDED.weight_kg,
  sms_sent = EXCLUDED.sms_sent,
  payout_released = EXCLUDED.payout_released;

-- ─── 6. RECYCLER PROCESSING BATCHES ───────────────────────────────────────────
INSERT INTO processing_batches (id, recycler_org_id, recycler_profile_id, status, methodology, input_weight_kg, confirmed_weight_kg, energy_kwh, yield_kg, lab_report_url, notes, submitted_at, created_at, updated_at)
VALUES
  ('88888888-8888-4888-8888-000000000001', '11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000003', 'processed', 'pyrolysis', 460, 455, 920, 138, 'https://labs.carbotrace.in/reports/GC-PYR-2026-09A', 'High-purity biochar, moisture < 4.2%, fixed carbon 82.4%', now() - INTERVAL '1 day', now() - INTERVAL '3 days', now() - INTERVAL '1 day'),
  ('88888888-8888-4888-8888-000000000002', '11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000003', 'processing', 'anaerobic_digestion', 342, 340, NULL, NULL, NULL, 'Digester temperature steady at 38°C; CH4 methane production active', NULL, now() - INTERVAL '2 days', now() - INTERVAL '4 hours'),
  ('88888888-8888-4888-8888-000000000003', '11111111-1111-4111-8111-000000000004', '22222222-2222-4222-8222-000000000003', 'received', 'composting', 0, 118, NULL, NULL, NULL, 'Batch received at kiln weighbridge; awaiting moisture blending', NULL, now() - INTERVAL '6 hours', now() - INTERVAL '6 hours')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  confirmed_weight_kg = EXCLUDED.confirmed_weight_kg,
  energy_kwh = EXCLUDED.energy_kwh,
  yield_kg = EXCLUDED.yield_kg,
  notes = EXCLUDED.notes,
  updated_at = now();

-- ─── 7. AUDITOR VERIFICATION REVIEWS ──────────────────────────────────────────
INSERT INTO audit_reviews (id, batch_id, checker_profile_id, status, checklist, feedback, reviewed_at, created_at)
VALUES
  ('99999999-9999-4999-8999-000000000001', '88888888-8888-4888-8888-000000000001', '22222222-2222-4222-8222-000000000004', 'approved', '{"pickup_logs_verified": true, "geofence_events_valid": true, "weighbridge_match": true, "lab_report_present": true, "methodology_compliant": true, "yield_plausible": true}'::jsonb, 'Tamper-evident hash verified. Biochar yield of 30.3% is within ISO 14064 MRV range.', now() - INTERVAL '18 hours', now() - INTERVAL '24 hours'),
  ('99999999-9999-4999-8999-000000000002', '88888888-8888-4888-8888-000000000002', '22222222-2222-4222-8222-000000000004', 'pending', '{}'::jsonb, NULL, NULL, now() - INTERVAL '12 hours')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  checklist = EXCLUDED.checklist,
  feedback = EXCLUDED.feedback,
  reviewed_at = EXCLUDED.reviewed_at;

-- ─── 8. CARBON CREDITS ────────────────────────────────────────────────────────
INSERT INTO carbon_credits (id, serial_number, batch_id, audit_review_id, vintage_year, methodology, co2e_kg, price_usd, status, owner_org_id, minted_at, listed_at, sold_at, retired_at, certificate_url)
VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-000000000001', 'W2C-2026-000001', '88888888-8888-4888-8888-000000000001', '99999999-9999-4999-8999-000000000001', 2026, 'pyrolysis', 191100, 18.50, 'listed', NULL, now() - INTERVAL '18 hours', now() - INTERVAL '17 hours', NULL, NULL, NULL),
  ('aaaaaaaa-aaaa-4aaa-8aaa-000000000002', 'W2C-2026-000002', '88888888-8888-4888-8888-000000000001', '99999999-9999-4999-8999-000000000001', 2026, 'pyrolysis', 50000, 22.00, 'retired', '11111111-1111-4111-8111-000000000005', now() - INTERVAL '15 days', now() - INTERVAL '14 days', now() - INTERVAL '10 days', now() - INTERVAL '10 days', 'https://certificates.carbotrace.in/cert-W2C-2026-000002.pdf'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-000000000003', 'W2C-2026-000003', '88888888-8888-4888-8888-000000000001', '99999999-9999-4999-8999-000000000001', 2026, 'anaerobic_digestion', 75000, 15.75, 'listed', NULL, now() - INTERVAL '25 days', now() - INTERVAL '24 days', NULL, NULL, NULL),
  ('aaaaaaaa-aaaa-4aaa-8aaa-000000000004', 'W2C-2026-000004', '88888888-8888-4888-8888-000000000001', '99999999-9999-4999-8999-000000000001', 2025, 'composting', 30000, 12.00, 'sold', '11111111-1111-4111-8111-000000000005', now() - INTERVAL '40 days', now() - INTERVAL '39 days', now() - INTERVAL '12 days', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  price_usd = EXCLUDED.price_usd,
  sold_at = EXCLUDED.sold_at,
  retired_at = EXCLUDED.retired_at,
  certificate_url = EXCLUDED.certificate_url;

-- ─── 9. DISPUTES RESOLUTION ──────────────────────────────────────────────────
INSERT INTO disputes (id, raised_by_profile_id, pickup_request_id, route_stop_id, reason, status, resolution, created_at, resolved_at)
VALUES
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000001', '22222222-2222-4222-8222-000000000001', '55555555-5555-4555-8555-000000000005', NULL, 'Pickup was not completed despite confirmation SMS. Waste still sitting at location.', 'open', NULL, now() - INTERVAL '8 hours', NULL),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000002', '22222222-2222-4222-8222-000000000002', '55555555-5555-4555-8555-000000000004', '77777777-7777-4777-8777-000000000001', 'Weight on generator receipt (350 kg) does not match weighbridge reading (342 kg).', 'under_review', 'Arbitration in progress: reviewing scale tare certificate.', now() - INTERVAL '1 day', NULL)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  resolution = EXCLUDED.resolution,
  resolved_at = EXCLUDED.resolved_at;

-- ─── 10. IMPACT METRICS ───────────────────────────────────────────────────────
INSERT INTO impact_metrics (id, total_waste_kg, total_co2e_kg, credits_minted, credits_retired, orgs_registered, updated_at)
VALUES
  ('cccccccc-cccc-4ccc-8ccc-000000000001', 1842750, 738420, 1247, 891, 312, now())
ON CONFLICT (id) DO UPDATE SET
  total_waste_kg = EXCLUDED.total_waste_kg,
  total_co2e_kg = EXCLUDED.total_co2e_kg,
  credits_minted = EXCLUDED.credits_minted,
  credits_retired = EXCLUDED.credits_retired,
  orgs_registered = EXCLUDED.orgs_registered,
  updated_at = now();
