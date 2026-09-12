import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...vals] = trimmed.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
  console.error('\x1b[31m[Error] Supabase URL or Key missing in .env!\x1b[0m');
  console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
  process.exit(1);
}

console.log(`\x1b[36mConnecting to Supabase:\x1b[0m ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_DATA = {
  organisations: [
    {
      id: '11111111-1111-4111-8111-000000000001',
      name: 'The Leela Palace',
      type: 'hotel',
      address: '23, Old Airport Rd, Kodihalli',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560008',
      gstin: '29AABCT1332L1ZB',
      contact_email: 'eco@leela.in',
      contact_phone: '+91-80-25212345',
      verified: true,
      tier: 'pro',
      total_co2e_kg: 48200,
      total_waste_kg: 121500,
    },
    {
      id: '11111111-1111-4111-8111-000000000002',
      name: 'Bengaluru APMC Market',
      type: 'market',
      address: 'Yeshwanthpur APMC Yard, Tumkur Rd',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560022',
      gstin: '29AADCB1234K1ZC',
      contact_email: 'waste@apmc.karnataka.gov.in',
      contact_phone: '+91-80-23371234',
      verified: true,
      tier: 'enterprise',
      total_co2e_kg: 94600,
      total_waste_kg: 237000,
    },
    {
      id: '11111111-1111-4111-8111-000000000003',
      name: 'Vatika Housing Society',
      type: 'housing_society',
      address: 'Block A, Sector 49, Vatika City',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122018',
      gstin: null,
      contact_email: 'rwa@vatika.in',
      contact_phone: '+91-124-4567890',
      verified: true,
      tier: 'basic',
      total_co2e_kg: 12400,
      total_waste_kg: 31200,
    },
    {
      id: '11111111-1111-4111-8111-000000000004',
      name: 'GreenCycle Industries',
      type: 'recycler',
      address: 'Plot 42, Industrial Area Phase 2',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411019',
      gstin: '27AABCG4567M1ZD',
      contact_email: 'ops@greencycle.in',
      contact_phone: '+91-20-27150000',
      verified: true,
      tier: 'pro',
      total_co2e_kg: 0,
      total_waste_kg: 0,
    },
    {
      id: '11111111-1111-4111-8111-000000000005',
      name: 'Infosys ESG Fund',
      type: 'buyer',
      address: 'Infosys BPM Tower, Electronics City, Hosur Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
      gstin: '29AAACI1681G1ZK',
      contact_email: 'esg@infosys.com',
      contact_phone: '+91-80-28520261',
      verified: true,
      tier: 'enterprise',
      total_co2e_kg: 0,
      total_waste_kg: 0,
    },
    {
      id: '11111111-1111-4111-8111-000000000006',
      name: 'CleanCity Municipal Logistics',
      type: 'logistics',
      address: 'Corporation Yard, Shivaji Nagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560051',
      gstin: '29BBBCM9988P1ZZ',
      contact_email: 'logistics@cleancity.gov.in',
      contact_phone: '+91-80-22221111',
      verified: true,
      tier: 'enterprise',
      total_co2e_kg: 0,
      total_waste_kg: 0,
    },
  ],

  profiles: [
    {
      id: '22222222-2222-4222-8222-000000000001',
      user_id: '33333333-3333-4333-8333-000000000001',
      full_name: 'Priya Sharma',
      email: 'priya@leela.in',
      role: 'generator',
      org_id: '11111111-1111-4111-8111-000000000001',
      phone: '+91-9876543210',
    },
    {
      id: '22222222-2222-4222-8222-000000000002',
      user_id: '33333333-3333-4333-8333-000000000002',
      full_name: 'Ravi Kumar',
      email: 'ravi@logistics.in',
      role: 'driver',
      org_id: '11111111-1111-4111-8111-000000000006',
      phone: '+91-9988776655',
    },
    {
      id: '22222222-2222-4222-8222-000000000003',
      user_id: '33333333-3333-4333-8333-000000000003',
      full_name: 'Anil Mehta',
      email: 'anil@greencycle.in',
      role: 'recycler',
      org_id: '11111111-1111-4111-8111-000000000004',
      phone: '+91-9022334455',
    },
    {
      id: '22222222-2222-4222-8222-000000000004',
      user_id: '33333333-3333-4333-8333-000000000004',
      full_name: 'Dr. Meena Nair',
      email: 'meena@carbon-audit.in',
      role: 'checker',
      org_id: null,
      phone: '+91-9123456789',
    },
    {
      id: '22222222-2222-4222-8222-000000000005',
      user_id: '33333333-3333-4333-8333-000000000005',
      full_name: 'Siddharth Rao',
      email: 'sid.rao@infosys.com',
      role: 'buyer',
      org_id: '11111111-1111-4111-8111-000000000005',
      phone: '+91-9000123456',
    },
    {
      id: '22222222-2222-4222-8222-000000000006',
      user_id: '33333333-3333-4333-8333-000000000006',
      full_name: 'Admin CarboTrace',
      email: 'admin@carbotrace.in',
      role: 'admin',
      org_id: null,
      phone: '+91-9888877777',
    },
  ],

  bins: [
    {
      id: '44444444-4444-4444-8444-000000000001',
      org_id: '11111111-1111-4111-8111-000000000001',
      qr_code: 'BIN-LEELA-MAIN-01',
      location_lat: 12.9582,
      location_lng: 77.6484,
      location_label: 'Main Kitchen Waste Bay',
      capacity_kg: 250,
      status: 'assigned',
    },
    {
      id: '44444444-4444-4444-8444-000000000002',
      org_id: '11111111-1111-4111-8111-000000000001',
      qr_code: 'BIN-LEELA-BANQUET-02',
      location_lat: 12.9585,
      location_lng: 77.6489,
      location_label: 'Banquet & Catering Exit',
      capacity_kg: 300,
      status: 'full',
    },
    {
      id: '44444444-4444-4444-8444-000000000003',
      org_id: '11111111-1111-4111-8111-000000000002',
      qr_code: 'BIN-APMC-VEG-01',
      location_lat: 13.0218,
      location_lng: 77.5495,
      location_label: 'APMC Vegetable Wholesale Section A',
      capacity_kg: 800,
      status: 'clean',
    },
    {
      id: '44444444-4444-4444-8444-000000000004',
      org_id: '11111111-1111-4111-8111-000000000003',
      qr_code: 'BIN-VATIKA-TOWER-A',
      location_lat: 28.4089,
      location_lng: 77.0419,
      location_label: 'Block A Basement Organic Segregation',
      capacity_kg: 150,
      status: 'maintenance',
    },
  ],

  pickup_requests: [
    {
      id: '55555555-5555-4555-8555-000000000001',
      org_id: '11111111-1111-4111-8111-000000000001',
      generator_profile_id: '22222222-2222-4222-8222-000000000001',
      bin_id: '44444444-4444-4444-8444-000000000001',
      waste_type: 'food_wet',
      estimated_weight_kg: 120,
      actual_weight_kg: 118,
      pickup_address: 'The Leela Palace, 23 Old Airport Rd, Bengaluru',
      location_lat: 12.9582,
      location_lng: 77.6484,
      status: 'completed',
      photo_url: '/mock/waste-photo-1.jpg',
      photo_verified: true,
      photo_flag_reason: null,
      tracking_code: 'W2C-2026-001XA2',
      notes: 'Verified moisture < 12%',
    },
    {
      id: '55555555-5555-4555-8555-000000000002',
      org_id: '11111111-1111-4111-8111-000000000001',
      generator_profile_id: '22222222-2222-4222-8222-000000000001',
      bin_id: '44444444-4444-4444-8444-000000000002',
      waste_type: 'food_wet',
      estimated_weight_kg: 95,
      actual_weight_kg: null,
      pickup_address: 'The Leela Palace Kitchen Exit, Bengaluru',
      location_lat: 12.9585,
      location_lng: 77.6489,
      status: 'queued',
      photo_url: '/mock/waste-photo-2.jpg',
      photo_verified: true,
      photo_flag_reason: null,
      tracking_code: 'W2C-2026-002BX7',
      notes: 'Morning kitchen waste ready for pickup',
    },
    {
      id: '55555555-5555-4555-8555-000000000003',
      org_id: '11111111-1111-4111-8111-000000000001',
      generator_profile_id: '22222222-2222-4222-8222-000000000001',
      bin_id: null,
      waste_type: 'garden',
      estimated_weight_kg: 45,
      actual_weight_kg: null,
      pickup_address: 'Leela Garden Section, Bengaluru',
      location_lat: 12.958,
      location_lng: 77.648,
      status: 'photo_pending',
      photo_url: null,
      photo_verified: false,
      photo_flag_reason: null,
      tracking_code: 'W2C-2026-003CY9',
      notes: 'Pruning waste awaiting photo verification',
    },
    {
      id: '55555555-5555-4555-8555-000000000004',
      org_id: '11111111-1111-4111-8111-000000000002',
      generator_profile_id: '22222222-2222-4222-8222-000000000001',
      bin_id: '44444444-4444-4444-8444-000000000003',
      waste_type: 'mixed_organic',
      estimated_weight_kg: 350,
      actual_weight_kg: 342,
      pickup_address: 'APMC Market, Yeshwanthpur, Bengaluru',
      location_lat: 13.0218,
      location_lng: 77.5495,
      status: 'completed',
      photo_url: '/mock/waste-photo-3.jpg',
      photo_verified: true,
      photo_flag_reason: null,
      tracking_code: 'W2C-2026-004DZ1',
      notes: 'Bulk market vegetable rejects',
    },
    {
      id: '55555555-5555-4555-8555-000000000005',
      org_id: '11111111-1111-4111-8111-000000000003',
      generator_profile_id: '22222222-2222-4222-8222-000000000001',
      bin_id: '44444444-4444-4444-8444-000000000004',
      waste_type: 'food_wet',
      estimated_weight_kg: 60,
      actual_weight_kg: null,
      pickup_address: 'Vatika Housing Society, Block A, Gurugram',
      location_lat: 28.4089,
      location_lng: 77.0419,
      status: 'flagged',
      photo_url: '/mock/waste-photo-4.jpg',
      photo_verified: false,
      photo_flag_reason: 'Mixed plastics detected in food waste bin',
      tracking_code: 'W2C-2026-005EW3',
      notes: 'Requires re-sorting before driver dispatch',
    },
  ],

  routes: [
    {
      id: '66666666-6666-4666-8666-000000000001',
      driver_profile_id: '22222222-2222-4222-8222-000000000002',
      route_date: new Date().toISOString().split('T')[0],
      status: 'active',
      started_at: new Date(Date.now() - 7200000).toISOString(),
      completed_at: null,
      total_stops: 3,
      completed_stops: 1,
      total_weight_kg: 118,
    },
    {
      id: '66666666-6666-4666-8666-000000000002',
      driver_profile_id: '22222222-2222-4222-8222-000000000002',
      route_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      status: 'completed',
      started_at: new Date(Date.now() - 93600000).toISOString(),
      completed_at: new Date(Date.now() - 75600000).toISOString(),
      total_stops: 4,
      completed_stops: 4,
      total_weight_kg: 518,
    },
  ],

  route_stops: [
    {
      id: '77777777-7777-4777-8777-000000000001',
      route_id: '66666666-6666-4666-8666-000000000001',
      pickup_request_id: '55555555-5555-4555-8555-000000000001',
      sequence: 1,
      status: 'completed',
      arrived_at: new Date(Date.now() - 5400000).toISOString(),
      departed_at: new Date(Date.now() - 3600000).toISOString(),
      weight_kg: 118,
      receipt_photo_url: '/mock/weigh-receipt-1.jpg',
      sms_sent: true,
      payout_released: true,
    },
    {
      id: '77777777-7777-4777-8777-000000000002',
      route_id: '66666666-6666-4666-8666-000000000001',
      pickup_request_id: '55555555-5555-4555-8555-000000000002',
      sequence: 2,
      status: 'arrived',
      arrived_at: new Date(Date.now() - 1200000).toISOString(),
      departed_at: null,
      weight_kg: null,
      receipt_photo_url: null,
      sms_sent: false,
      payout_released: false,
    },
    {
      id: '77777777-7777-4777-8777-000000000003',
      route_id: '66666666-6666-4666-8666-000000000001',
      pickup_request_id: '55555555-5555-4555-8555-000000000004',
      sequence: 3,
      status: 'pending',
      arrived_at: null,
      departed_at: null,
      weight_kg: null,
      receipt_photo_url: null,
      sms_sent: false,
      payout_released: false,
    },
  ],

  processing_batches: [
    {
      id: '88888888-8888-4888-8888-000000000001',
      recycler_org_id: '11111111-1111-4111-8111-000000000004',
      recycler_profile_id: '22222222-2222-4222-8222-000000000003',
      status: 'processed',
      methodology: 'pyrolysis',
      input_weight_kg: 460,
      confirmed_weight_kg: 455,
      energy_kwh: 920,
      yield_kg: 138,
      lab_report_url: 'https://labs.carbotrace.in/reports/GC-PYR-2026-09A',
      notes: 'High-purity biochar, moisture < 4.2%, fixed carbon 82.4%',
      submitted_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '88888888-8888-4888-8888-000000000002',
      recycler_org_id: '11111111-1111-4111-8111-000000000004',
      recycler_profile_id: '22222222-2222-4222-8222-000000000003',
      status: 'processing',
      methodology: 'anaerobic_digestion',
      input_weight_kg: 342,
      confirmed_weight_kg: 340,
      energy_kwh: null,
      yield_kg: null,
      lab_report_url: null,
      notes: 'Digester temperature steady at 38°C; CH4 methane production active',
      submitted_at: null,
    },
    {
      id: '88888888-8888-4888-8888-000000000003',
      recycler_org_id: '11111111-1111-4111-8111-000000000004',
      recycler_profile_id: '22222222-2222-4222-8222-000000000003',
      status: 'received',
      methodology: 'composting',
      input_weight_kg: 0,
      confirmed_weight_kg: 118,
      energy_kwh: null,
      yield_kg: null,
      lab_report_url: null,
      notes: 'Batch received at kiln weighbridge; awaiting moisture blending',
      submitted_at: null,
    },
  ],

  audit_reviews: [
    {
      id: '99999999-9999-4999-8999-000000000001',
      batch_id: '88888888-8888-4888-8888-000000000001',
      checker_profile_id: '22222222-2222-4222-8222-000000000004',
      status: 'approved',
      checklist: {
        pickup_logs_verified: true,
        geofence_events_valid: true,
        weighbridge_match: true,
        lab_report_present: true,
        methodology_compliant: true,
        yield_plausible: true,
      },
      feedback: 'Tamper-evident hash verified. Biochar yield of 30.3% is within ISO 14064 MRV range.',
      reviewed_at: new Date(Date.now() - 64800000).toISOString(),
    },
    {
      id: '99999999-9999-4999-8999-000000000002',
      batch_id: '88888888-8888-4888-8888-000000000002',
      checker_profile_id: '22222222-2222-4222-8222-000000000004',
      status: 'pending',
      checklist: {},
      feedback: null,
      reviewed_at: null,
    },
  ],

  carbon_credits: [
    {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-000000000001',
      serial_number: 'W2C-2026-000001',
      batch_id: '88888888-8888-4888-8888-000000000001',
      audit_review_id: '99999999-9999-4999-8999-000000000001',
      vintage_year: 2026,
      methodology: 'pyrolysis',
      co2e_kg: 191100,
      price_usd: 18.5,
      status: 'listed',
      owner_org_id: null,
      minted_at: new Date(Date.now() - 64800000).toISOString(),
      listed_at: new Date(Date.now() - 61200000).toISOString(),
      sold_at: null,
      retired_at: null,
      certificate_url: null,
    },
    {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-000000000002',
      serial_number: 'W2C-2026-000002',
      batch_id: '88888888-8888-4888-8888-000000000001',
      audit_review_id: '99999999-9999-4999-8999-000000000001',
      vintage_year: 2026,
      methodology: 'pyrolysis',
      co2e_kg: 50000,
      price_usd: 22.0,
      status: 'retired',
      owner_org_id: '11111111-1111-4111-8111-000000000005',
      minted_at: new Date(Date.now() - 1296000000).toISOString(),
      listed_at: new Date(Date.now() - 1209600000).toISOString(),
      sold_at: new Date(Date.now() - 864000000).toISOString(),
      retired_at: new Date(Date.now() - 864000000).toISOString(),
      certificate_url: 'https://certificates.carbotrace.in/cert-W2C-2026-000002.pdf',
    },
    {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-000000000003',
      serial_number: 'W2C-2026-000003',
      batch_id: '88888888-8888-4888-8888-000000000001',
      audit_review_id: '99999999-9999-4999-8999-000000000001',
      vintage_year: 2026,
      methodology: 'anaerobic_digestion',
      co2e_kg: 75000,
      price_usd: 15.75,
      status: 'listed',
      owner_org_id: null,
      minted_at: new Date(Date.now() - 2160000000).toISOString(),
      listed_at: new Date(Date.now() - 2073600000).toISOString(),
      sold_at: null,
      retired_at: null,
      certificate_url: null,
    },
    {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-000000000004',
      serial_number: 'W2C-2026-000004',
      batch_id: '88888888-8888-4888-8888-000000000001',
      audit_review_id: '99999999-9999-4999-8999-000000000001',
      vintage_year: 2025,
      methodology: 'composting',
      co2e_kg: 30000,
      price_usd: 12.0,
      status: 'sold',
      owner_org_id: '11111111-1111-4111-8111-000000000005',
      minted_at: new Date(Date.now() - 3456000000).toISOString(),
      listed_at: new Date(Date.now() - 3369600000).toISOString(),
      sold_at: new Date(Date.now() - 1036800000).toISOString(),
      retired_at: null,
      certificate_url: null,
    },
  ],

  disputes: [
    {
      id: 'bbbbbbbb-bbbb-4bbb-8bbb-000000000001',
      raised_by_profile_id: '22222222-2222-4222-8222-000000000001',
      pickup_request_id: '55555555-5555-4555-8555-000000000005',
      route_stop_id: null,
      reason: 'Pickup was not completed despite confirmation SMS. Waste still sitting at location.',
      status: 'open',
      resolution: null,
    },
    {
      id: 'bbbbbbbb-bbbb-4bbb-8bbb-000000000002',
      raised_by_profile_id: '22222222-2222-4222-8222-000000000002',
      pickup_request_id: '55555555-5555-4555-8555-000000000004',
      route_stop_id: '77777777-7777-4777-8777-000000000001',
      reason: 'Weight on generator receipt (350 kg) does not match weighbridge reading (342 kg).',
      status: 'under_review',
      resolution: 'Arbitration in progress: reviewing scale tare certificate.',
    },
  ],

  impact_metrics: [
    {
      id: 'cccccccc-cccc-4ccc-8ccc-000000000001',
      total_waste_kg: 1842750,
      total_co2e_kg: 738420,
      credits_minted: 1247,
      credits_retired: 891,
      orgs_registered: 312,
    },
  ],
};

async function seed() {
  console.log('\n\x1b[1m🌱 Starting CarboTrace Mock Data Seeding for Supabase...\x1b[0m\n');

  const tables = [
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
    'impact_metrics',
  ];

  let successCount = 0;
  let totalRecords = 0;

  for (const table of tables) {
    const records = SEED_DATA[table];
    if (!records || records.length === 0) continue;

    process.stdout.write(`Inserting into \x1b[33m${table}\x1b[0m (${records.length} records)... `);

    try {
      const { data, error } = await supabase.from(table).upsert(records, { onConflict: 'id' }).select();

      if (error) {
        console.log(`\x1b[31m[FAILED]\x1b[0m`);
        console.error(`  ↳ ${error.message} (Code: ${error.code})`);
      } else {
        console.log(`\x1b[32m[OK]\x1b[0m (${data ? data.length : records.length} upserted)`);
        successCount++;
        totalRecords += records.length;
      }
    } catch (err) {
      console.log(`\x1b[31m[ERROR]\x1b[0m`);
      console.error(`  ↳ ${err.message}`);
    }
  }

  console.log('\n──────────────────────────────────────────────────');
  console.log(`\x1b[32m✔ Seeding process finished:\x1b[0m ${successCount}/${tables.length} tables seeded successfully (${totalRecords} records).`);
  console.log('──────────────────────────────────────────────────\n');
}

seed();
