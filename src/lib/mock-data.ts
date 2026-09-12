import type {
  Profile, Organisation, PickupRequest, Route, RouteStop,
  ProcessingBatch, AuditReview, CarbonCredit, ImpactMetrics, Dispute,
} from '@/types/database';

// ─── Impact Metrics (live counters) ──────────────────────────────────────────
export const mockImpactMetrics: ImpactMetrics = {
  id: 'impact-1',
  total_waste_kg:  1_842_750,
  total_co2e_kg:   738_420,
  credits_minted:  1247,
  credits_retired: 891,
  orgs_registered: 312,
  updated_at: new Date().toISOString(),
};

// ─── Organisations ────────────────────────────────────────────────────────────
export const mockOrgs: Organisation[] = [
  {
    id: 'org-1', name: 'The Leela Palace', type: 'hotel',
    address: '23, Old Airport Rd', city: 'Bengaluru', state: 'Karnataka', pincode: '560008',
    gstin: '29AABCT1332L1ZB', contact_email: 'eco@leela.in', contact_phone: '+91-80-25212345',
    logo_url: null, verified: true, tier: 'pro', total_co2e_kg: 48200, total_waste_kg: 121500,
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'org-2', name: 'Bengaluru APMC Market', type: 'market',
    address: 'Yeshwanthpur APMC Yard', city: 'Bengaluru', state: 'Karnataka', pincode: '560022',
    gstin: '29AADCB1234K1ZC', contact_email: 'waste@apmc.karnataka.gov.in', contact_phone: '+91-80-23371234',
    logo_url: null, verified: true, tier: 'enterprise', total_co2e_kg: 94600, total_waste_kg: 237000,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'org-3', name: 'Vatika Housing Society', type: 'housing_society',
    address: 'Block A, Vatika City', city: 'Gurugram', state: 'Haryana', pincode: '122018',
    gstin: null, contact_email: 'rwa@vatika.in', contact_phone: '+91-124-4567890',
    logo_url: null, verified: true, tier: 'basic', total_co2e_kg: 12400, total_waste_kg: 31200,
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'org-recycler', name: 'GreenCycle Industries', type: 'recycler',
    address: 'Plot 42, Industrial Area Phase 2', city: 'Pune', state: 'Maharashtra', pincode: '411019',
    gstin: '27AABCG4567M1ZD', contact_email: 'ops@greencycle.in', contact_phone: '+91-20-27150000',
    logo_url: null, verified: true, tier: 'pro', total_co2e_kg: 0, total_waste_kg: 0,
    created_at: '2026-01-20T08:00:00Z',
  },
  {
    id: 'org-buyer', name: 'Infosys ESG Fund', type: 'buyer',
    address: 'Infosys BPM Tower, Hosur Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560100',
    gstin: '29AAACI1681G1ZK', contact_email: 'esg@infosys.com', contact_phone: '+91-80-28520261',
    logo_url: null, verified: true, tier: 'enterprise', total_co2e_kg: 0, total_waste_kg: 0,
    created_at: '2026-01-08T08:00:00Z',
  },
];

// ─── Profiles ─────────────────────────────────────────────────────────────────
export const mockProfiles: Profile[] = [
  { id: 'profile-gen',     user_id: 'user-gen',     full_name: 'Priya Sharma',    email: 'priya@leela.in',          role: 'generator', org_id: 'org-1',       phone: '+91-9876543210', avatar_url: null, created_at: '2026-01-15T09:00:00Z', updated_at: '2026-01-15T09:00:00Z' },
  { id: 'profile-driver',  user_id: 'user-driver',  full_name: 'Ravi Kumar',      email: 'ravi@logistics.in',       role: 'driver',    org_id: null,          phone: '+91-9988776655', avatar_url: null, created_at: '2026-01-12T09:00:00Z', updated_at: '2026-01-12T09:00:00Z' },
  { id: 'profile-rec',     user_id: 'user-rec',     full_name: 'Anil Mehta',      email: 'anil@greencycle.in',      role: 'recycler',  org_id: 'org-recycler', phone: '+91-9022334455', avatar_url: null, created_at: '2026-01-20T09:00:00Z', updated_at: '2026-01-20T09:00:00Z' },
  { id: 'profile-checker', user_id: 'user-checker', full_name: 'Dr. Meena Nair',  email: 'meena@carbon-audit.in',  role: 'checker',   org_id: null,          phone: '+91-9123456789', avatar_url: null, created_at: '2026-01-18T09:00:00Z', updated_at: '2026-01-18T09:00:00Z' },
  { id: 'profile-buyer',   user_id: 'user-buyer',   full_name: 'Siddharth Rao',   email: 'sid.rao@infosys.com',     role: 'buyer',     org_id: 'org-buyer',   phone: '+91-9000123456', avatar_url: null, created_at: '2026-01-08T09:00:00Z', updated_at: '2026-01-08T09:00:00Z' },
  { id: 'profile-admin',   user_id: 'user-admin',   full_name: 'Admin CarboTrace', email: 'admin@carbotrace.in',   role: 'admin',     org_id: null,          phone: null,             avatar_url: null, created_at: '2026-01-01T09:00:00Z', updated_at: '2026-01-01T09:00:00Z' },
];

// ─── Pickup Requests ──────────────────────────────────────────────────────────
export const mockPickups: PickupRequest[] = [
  {
    id: 'pickup-1', org_id: 'org-1', generator_profile_id: 'profile-gen', bin_id: 'bin-1',
    waste_type: 'food_wet', estimated_weight_kg: 120, actual_weight_kg: 118,
    pickup_address: 'The Leela Palace, 23 Old Airport Rd, Bengaluru',
    location_lat: 12.9582, location_lng: 77.6484,
    status: 'completed', photo_url: '/mock/waste-photo-1.jpg', photo_verified: true,
    photo_flag_reason: null, tracking_code: 'W2C-2026-001XA2', notes: null,
    created_at: '2026-09-10T07:30:00Z', updated_at: '2026-09-10T14:20:00Z',
  },
  {
    id: 'pickup-2', org_id: 'org-1', generator_profile_id: 'profile-gen', bin_id: 'bin-2',
    waste_type: 'food_wet', estimated_weight_kg: 95, actual_weight_kg: null,
    pickup_address: 'The Leela Palace Kitchen Exit, Bengaluru',
    location_lat: 12.9585, location_lng: 77.6489,
    status: 'queued', photo_url: '/mock/waste-photo-2.jpg', photo_verified: true,
    photo_flag_reason: null, tracking_code: 'W2C-2026-002BX7', notes: 'Morning kitchen waste',
    created_at: '2026-09-12T06:45:00Z', updated_at: '2026-09-12T07:10:00Z',
  },
  {
    id: 'pickup-3', org_id: 'org-1', generator_profile_id: 'profile-gen', bin_id: null,
    waste_type: 'garden', estimated_weight_kg: 45, actual_weight_kg: null,
    pickup_address: 'Leela Garden Section, Bengaluru',
    location_lat: 12.9580, location_lng: 77.6480,
    status: 'photo_pending', photo_url: null, photo_verified: false,
    photo_flag_reason: null, tracking_code: 'W2C-2026-003CY9', notes: 'Pruning waste',
    created_at: '2026-09-12T08:00:00Z', updated_at: '2026-09-12T08:00:00Z',
  },
  {
    id: 'pickup-4', org_id: 'org-2', generator_profile_id: 'profile-gen', bin_id: 'bin-3',
    waste_type: 'mixed_organic', estimated_weight_kg: 350, actual_weight_kg: 342,
    pickup_address: 'APMC Market, Yeshwanthpur, Bengaluru',
    location_lat: 13.0218, location_lng: 77.5495,
    status: 'completed', photo_url: '/mock/waste-photo-3.jpg', photo_verified: true,
    photo_flag_reason: null, tracking_code: 'W2C-2026-004DZ1', notes: null,
    created_at: '2026-09-11T05:00:00Z', updated_at: '2026-09-11T12:00:00Z',
  },
  {
    id: 'pickup-5', org_id: 'org-3', generator_profile_id: 'profile-gen', bin_id: 'bin-4',
    waste_type: 'food_wet', estimated_weight_kg: 60, actual_weight_kg: null,
    pickup_address: 'Vatika Housing Society, Block A, Gurugram',
    location_lat: 28.4089, location_lng: 77.0419,
    status: 'flagged', photo_url: '/mock/waste-photo-4.jpg', photo_verified: false,
    photo_flag_reason: 'Mixed plastics detected in food waste bin', tracking_code: 'W2C-2026-005EW3', notes: null,
    created_at: '2026-09-12T09:00:00Z', updated_at: '2026-09-12T09:30:00Z',
  },
];

// ─── Route Stops ──────────────────────────────────────────────────────────────
export const mockRouteStops: RouteStop[] = [
  { id: 'stop-1', route_id: 'route-1', pickup_request_id: 'pickup-1', sequence: 1, status: 'completed', arrived_at: '2026-09-12T09:15:00Z', departed_at: '2026-09-12T09:42:00Z', weight_kg: 118, receipt_photo_url: null, sms_sent: true, payout_released: true, created_at: '2026-09-12T08:00:00Z', pickup: mockPickups[0] },
  { id: 'stop-2', route_id: 'route-1', pickup_request_id: 'pickup-2', sequence: 2, status: 'arrived',   arrived_at: '2026-09-12T10:05:00Z', departed_at: null, weight_kg: null, receipt_photo_url: null, sms_sent: false, payout_released: false, created_at: '2026-09-12T08:00:00Z', pickup: mockPickups[1] },
  { id: 'stop-3', route_id: 'route-1', pickup_request_id: 'pickup-4', sequence: 3, status: 'pending',   arrived_at: null, departed_at: null, weight_kg: null, receipt_photo_url: null, sms_sent: false, payout_released: false, created_at: '2026-09-12T08:00:00Z', pickup: mockPickups[3] },
];

// ─── Routes ───────────────────────────────────────────────────────────────────
export const mockRoutes: Route[] = [
  {
    id: 'route-1', driver_profile_id: 'profile-driver',
    route_date: '2026-09-12', status: 'active',
    started_at: '2026-09-12T08:55:00Z', completed_at: null,
    total_stops: 3, completed_stops: 1, total_weight_kg: 118,
    created_at: '2026-09-12T07:00:00Z',
    stops: mockRouteStops,
    driver: mockProfiles[1],
  },
  {
    id: 'route-2', driver_profile_id: 'profile-driver',
    route_date: '2026-09-11', status: 'completed',
    started_at: '2026-09-11T08:00:00Z', completed_at: '2026-09-11T13:30:00Z',
    total_stops: 4, completed_stops: 4, total_weight_kg: 518,
    created_at: '2026-09-11T07:00:00Z',
    stops: [],
    driver: mockProfiles[1],
  },
];

// ─── Processing Batches ───────────────────────────────────────────────────────
export const mockBatches: ProcessingBatch[] = [
  {
    id: 'batch-1', recycler_org_id: 'org-recycler', recycler_profile_id: 'profile-rec',
    status: 'processed', methodology: 'pyrolysis',
    input_weight_kg: 460, confirmed_weight_kg: 455,
    energy_kwh: 920, yield_kg: 138,
    lab_report_url: 'https://labs.example.com/report/batch-1',
    notes: 'Excellent quality biochar, moisture < 5%', submitted_at: '2026-09-11T16:00:00Z',
    created_at: '2026-09-10T14:00:00Z', updated_at: '2026-09-11T16:00:00Z',
    recycler: mockProfiles[2], recycler_org: mockOrgs[3],
  },
  {
    id: 'batch-2', recycler_org_id: 'org-recycler', recycler_profile_id: 'profile-rec',
    status: 'processing', methodology: 'anaerobic_digestion',
    input_weight_kg: 342, confirmed_weight_kg: 340,
    energy_kwh: null, yield_kg: null,
    lab_report_url: null,
    notes: 'Digestion cycle in progress — 18 days remaining', submitted_at: null,
    created_at: '2026-09-11T15:00:00Z', updated_at: '2026-09-12T08:00:00Z',
    recycler: mockProfiles[2], recycler_org: mockOrgs[3],
  },
  {
    id: 'batch-3', recycler_org_id: 'org-recycler', recycler_profile_id: 'profile-rec',
    status: 'received', methodology: 'composting',
    input_weight_kg: 0, confirmed_weight_kg: 118,
    energy_kwh: null, yield_kg: null,
    lab_report_url: null,
    notes: null, submitted_at: null,
    created_at: '2026-09-12T10:30:00Z', updated_at: '2026-09-12T10:30:00Z',
    recycler: mockProfiles[2], recycler_org: mockOrgs[3],
  },
];

// ─── Audit Reviews ────────────────────────────────────────────────────────────
export const mockAuditReviews: AuditReview[] = [
  {
    id: 'audit-1', batch_id: 'batch-1', checker_profile_id: 'profile-checker',
    status: 'approved',
    checklist: {
      pickup_logs_verified: true, geofence_events_valid: true, weighbridge_match: true,
      lab_report_present: true, methodology_compliant: true, yield_plausible: true,
    },
    feedback: 'All documentation verified. Biochar yield at 30% of input weight is within expected range for pyrolysis.',
    reviewed_at: '2026-09-12T11:00:00Z', created_at: '2026-09-12T09:00:00Z',
    batch: mockBatches[0], checker: mockProfiles[3],
  },
  {
    id: 'audit-2', batch_id: 'batch-2', checker_profile_id: 'profile-checker',
    status: 'pending',
    checklist: {},
    feedback: null, reviewed_at: null, created_at: '2026-09-12T10:00:00Z',
    batch: mockBatches[1], checker: mockProfiles[3],
  },
];

// ─── Carbon Credits ───────────────────────────────────────────────────────────
export const mockCredits: CarbonCredit[] = [
  {
    id: 'credit-1', serial_number: 'W2C-2026-000001', batch_id: 'batch-1',
    audit_review_id: 'audit-1', vintage_year: 2026, methodology: 'pyrolysis',
    co2e_kg: 191_100, price_usd: 18.50, status: 'listed',
    owner_org_id: null, minted_at: '2026-09-12T11:05:00Z', listed_at: '2026-09-12T11:10:00Z',
    sold_at: null, retired_at: null, certificate_url: null, batch: mockBatches[0],
  },
  {
    id: 'credit-2', serial_number: 'W2C-2026-000002', batch_id: 'batch-1',
    audit_review_id: 'audit-1', vintage_year: 2026, methodology: 'pyrolysis',
    co2e_kg: 50_000, price_usd: 22.00, status: 'retired',
    owner_org_id: 'org-buyer', minted_at: '2026-09-05T10:00:00Z', listed_at: '2026-09-05T10:05:00Z',
    sold_at: '2026-09-08T14:00:00Z', retired_at: '2026-09-08T14:01:00Z',
    certificate_url: '/mock/certificate-1.pdf', batch: mockBatches[0],
  },
  {
    id: 'credit-3', serial_number: 'W2C-2026-000003', batch_id: 'batch-1',
    audit_review_id: 'audit-1', vintage_year: 2026, methodology: 'anaerobic_digestion',
    co2e_kg: 75_000, price_usd: 15.75, status: 'listed',
    owner_org_id: null, minted_at: '2026-08-20T09:00:00Z', listed_at: '2026-08-20T09:05:00Z',
    sold_at: null, retired_at: null, certificate_url: null, batch: mockBatches[0],
  },
  {
    id: 'credit-4', serial_number: 'W2C-2026-000004', batch_id: 'batch-1',
    audit_review_id: 'audit-1', vintage_year: 2025, methodology: 'composting',
    co2e_kg: 30_000, price_usd: 12.00, status: 'sold',
    owner_org_id: 'org-buyer', minted_at: '2026-07-15T08:00:00Z', listed_at: '2026-07-15T08:05:00Z',
    sold_at: '2026-09-01T12:00:00Z', retired_at: null, certificate_url: null, batch: mockBatches[0],
  },
];

// ─── Disputes ─────────────────────────────────────────────────────────────────
export const mockDisputes: Dispute[] = [
  {
    id: 'dispute-1', raised_by_profile_id: 'profile-gen', pickup_request_id: 'pickup-5', route_stop_id: null,
    reason: 'Pickup was not completed despite confirmation SMS. Waste still sitting at location.',
    status: 'open', resolution: null,
    created_at: '2026-09-12T10:00:00Z', resolved_at: null,
  },
  {
    id: 'dispute-2', raised_by_profile_id: 'profile-driver', pickup_request_id: 'pickup-4', route_stop_id: 'stop-1',
    reason: 'Weight on generator receipt (350 kg) does not match weighbridge reading (342 kg).',
    status: 'under_review', resolution: null,
    created_at: '2026-09-11T13:00:00Z', resolved_at: null,
  },
];

// ─── Leaderboard (derived from orgs) ──────────────────────────────────────────
export const mockLeaderboard = [
  { rank: 1, org: mockOrgs[1], co2e_kg: 94_600, waste_kg: 237_000, credits: 8 },
  { rank: 2, org: mockOrgs[0], co2e_kg: 48_200, waste_kg: 121_500, credits: 5 },
  { rank: 3, org: mockOrgs[2], co2e_kg: 12_400, waste_kg: 31_200,  credits: 2 },
];
