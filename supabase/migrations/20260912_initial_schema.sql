-- =============================================================================
-- CarboTrace Waste-to-Carbon (W2C) Database Schema
-- Standardized against ISO 14064-2 MRV Protocol
-- =============================================================================

-- Enable PostGIS extension for 50m geofence checks
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. ENUMS ─────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('generator', 'driver', 'recycler', 'checker', 'buyer', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE org_type AS ENUM ('hotel', 'market', 'factory', 'housing_society', 'restaurant', 'canteen', 'recycler', 'checker', 'buyer', 'logistics', 'municipality');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE waste_type AS ENUM ('food_wet', 'garden', 'agricultural', 'industrial_organic', 'mixed_organic');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE bin_status AS ENUM ('clean', 'assigned', 'full', 'in_transit', 'sanitizing', 'maintenance');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE pickup_status AS ENUM ('draft', 'photo_pending', 'photo_verified', 'queued', 'assigned', 'en_route', 'arrived', 'weighed', 'completed', 'cancelled', 'flagged');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE route_status AS ENUM ('planned', 'active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE batch_status AS ENUM ('in_transit', 'received', 'processing', 'processed', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE processing_method AS ENUM ('pyrolysis', 'anaerobic_digestion', 'composting', 'gasification', 'hydrothermal');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE audit_status AS ENUM ('pending', 'in_review', 'approved', 'rejected', 'needs_info');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE credit_status AS ENUM ('minted', 'listed', 'sold', 'retired', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─── 2. TABLES ────────────────────────────────────────────────────────────────

-- Organisations
CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type org_type NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  gstin TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  logo_url TEXT,
  verified BOOLEAN DEFAULT false,
  tier TEXT DEFAULT 'basic',
  total_co2e_kg NUMERIC DEFAULT 0,
  total_waste_kg NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL,
  org_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Smart Bins
CREATE TABLE IF NOT EXISTS bins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  qr_code TEXT UNIQUE NOT NULL,
  location_lat NUMERIC(9,6) NOT NULL,
  location_lng NUMERIC(9,6) NOT NULL,
  location_label TEXT NOT NULL,
  capacity_kg NUMERIC NOT NULL,
  status bin_status DEFAULT 'clean',
  last_pickup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pickup Requests
CREATE TABLE IF NOT EXISTS pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  generator_profile_id UUID NOT NULL REFERENCES profiles(id),
  bin_id UUID REFERENCES bins(id),
  waste_type waste_type NOT NULL,
  estimated_weight_kg NUMERIC NOT NULL,
  actual_weight_kg NUMERIC,
  pickup_address TEXT NOT NULL,
  location_lat NUMERIC(9,6) NOT NULL,
  location_lng NUMERIC(9,6) NOT NULL,
  status pickup_status DEFAULT 'queued',
  photo_url TEXT,
  photo_verified BOOLEAN DEFAULT false,
  photo_flag_reason TEXT,
  tracking_code TEXT UNIQUE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Driver Logistics Routes
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_profile_id UUID NOT NULL REFERENCES profiles(id),
  route_date DATE NOT NULL,
  status route_status DEFAULT 'planned',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_stops INT DEFAULT 0,
  completed_stops INT DEFAULT 0,
  total_weight_kg NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Route Stops
CREATE TABLE IF NOT EXISTS route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  pickup_request_id UUID NOT NULL REFERENCES pickup_requests(id),
  sequence INT NOT NULL,
  status TEXT DEFAULT 'pending',
  arrived_at TIMESTAMPTZ,
  departed_at TIMESTAMPTZ,
  weight_kg NUMERIC,
  receipt_photo_url TEXT,
  sms_sent BOOLEAN DEFAULT false,
  payout_released BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Recycler Processing Batches
CREATE TABLE IF NOT EXISTS processing_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recycler_org_id UUID NOT NULL REFERENCES organisations(id),
  recycler_profile_id UUID NOT NULL REFERENCES profiles(id),
  status batch_status DEFAULT 'received',
  methodology processing_method NOT NULL,
  input_weight_kg NUMERIC NOT NULL,
  confirmed_weight_kg NUMERIC,
  energy_kwh NUMERIC,
  yield_kg NUMERIC,
  lab_report_url TEXT,
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auditor Verification Queue
CREATE TABLE IF NOT EXISTS audit_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES processing_batches(id),
  checker_profile_id UUID NOT NULL REFERENCES profiles(id),
  status audit_status DEFAULT 'pending',
  checklist JSONB DEFAULT '{}'::jsonb,
  feedback TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Carbon Credits Ledger
CREATE TABLE IF NOT EXISTS carbon_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number TEXT UNIQUE NOT NULL,
  batch_id UUID NOT NULL REFERENCES processing_batches(id),
  audit_review_id UUID REFERENCES audit_reviews(id),
  vintage_year INT NOT NULL,
  methodology processing_method NOT NULL,
  co2e_kg NUMERIC NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  status credit_status DEFAULT 'minted',
  owner_org_id UUID REFERENCES organisations(id),
  minted_at TIMESTAMPTZ DEFAULT now(),
  listed_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  retired_at TIMESTAMPTZ,
  certificate_url TEXT
);

-- Platform Telemetry & Live Counters
CREATE TABLE IF NOT EXISTS impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_waste_kg NUMERIC NOT NULL DEFAULT 0,
  total_co2e_kg NUMERIC NOT NULL DEFAULT 0,
  credits_minted INT NOT NULL DEFAULT 0,
  credits_retired INT NOT NULL DEFAULT 0,
  orgs_registered INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Disputes Resolution
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raised_by_profile_id UUID NOT NULL REFERENCES profiles(id),
  pickup_request_id UUID REFERENCES pickup_requests(id),
  route_stop_id UUID REFERENCES route_stops(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- ─── 3. SEED INITIAL IMPACT METRICS ───────────────────────────────────────────
INSERT INTO impact_metrics (total_waste_kg, total_co2e_kg, credits_minted, credits_retired, orgs_registered)
VALUES (38500, 15400, 26, 18, 14)
ON CONFLICT DO NOTHING;
