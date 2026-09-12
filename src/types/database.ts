// ─── Database Enums ──────────────────────────────────────────────────────────

export type UserRole = 'generator' | 'driver' | 'recycler' | 'checker' | 'buyer' | 'admin';

export type OrgType =
  | 'hotel' | 'market' | 'factory' | 'housing_society' | 'restaurant'
  | 'canteen' | 'recycler' | 'checker' | 'buyer' | 'logistics' | 'municipality';

export type WasteType =
  | 'food_wet' | 'garden' | 'agricultural' | 'industrial_organic' | 'mixed_organic';

export type BinStatus = 'clean' | 'assigned' | 'full' | 'in_transit' | 'sanitizing' | 'maintenance';

export type PickupStatus =
  | 'draft' | 'photo_pending' | 'photo_verified' | 'queued' | 'assigned'
  | 'en_route' | 'arrived' | 'weighed' | 'completed' | 'cancelled' | 'flagged';

export type RouteStatus = 'planned' | 'active' | 'completed' | 'cancelled';

export type BatchStatus = 'in_transit' | 'received' | 'processing' | 'processed' | 'rejected';

export type ProcessingMethod =
  | 'pyrolysis' | 'anaerobic_digestion' | 'composting' | 'gasification' | 'hydrothermal';

export type ProductType = 'biochar' | 'biogas' | 'biomethane' | 'clean_fuel' | 'compost' | 'bio_oil';

export type AuditStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'needs_info';

export type CreditStatus = 'minted' | 'listed' | 'sold' | 'retired' | 'cancelled';

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded';

// ─── Database Row Types ───────────────────────────────────────────────────────

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  org_id: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organisation {
  id: string;
  name: string;
  type: OrgType;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string | null;
  contact_email: string;
  contact_phone: string;
  logo_url: string | null;
  verified: boolean;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  total_co2e_kg: number;
  total_waste_kg: number;
  created_at: string;
}

export interface WasteTypeRow {
  id: string;
  code: WasteType;
  label: string;
  co2e_factor: number; // kg CO2e per kg waste
  description: string;
}

export interface Bin {
  id: string;
  org_id: string;
  qr_code: string;
  location_lat: number;
  location_lng: number;
  location_label: string;
  capacity_kg: number;
  status: BinStatus;
  last_pickup_at: string | null;
  created_at: string;
}

export interface PickupRequest {
  id: string;
  org_id: string;
  generator_profile_id: string;
  bin_id: string | null;
  waste_type: WasteType;
  estimated_weight_kg: number;
  actual_weight_kg: number | null;
  pickup_address: string;
  location_lat: number;
  location_lng: number;
  status: PickupStatus;
  photo_url: string | null;
  photo_verified: boolean;
  photo_flag_reason: string | null;
  tracking_code: string;
  notes: string | null;
  created_at: string;
  updated_at: string;

  // Joined
  org?: Organisation;
  generator?: Profile;
  bin?: Bin;
}

export interface Route {
  id: string;
  driver_profile_id: string;
  route_date: string;
  status: RouteStatus;
  started_at: string | null;
  completed_at: string | null;
  total_stops: number;
  completed_stops: number;
  total_weight_kg: number;
  created_at: string;

  stops?: RouteStop[];
  driver?: Profile;
}

export interface RouteStop {
  id: string;
  route_id: string;
  pickup_request_id: string;
  sequence: number;
  status: 'pending' | 'arrived' | 'weighed' | 'completed' | 'skipped';
  arrived_at: string | null;
  departed_at: string | null;
  weight_kg: number | null;
  receipt_photo_url: string | null;
  sms_sent: boolean;
  payout_released: boolean;
  created_at: string;

  pickup?: PickupRequest;
}

export interface GeofenceEvent {
  id: string;
  route_stop_id: string;
  driver_profile_id: string;
  event_type: 'arrival' | 'departure';
  lat: number;
  lng: number;
  distance_m: number;
  within_fence: boolean;
  recorded_at: string;
}

export interface WeighbridgeReceipt {
  id: string;
  route_stop_id: string;
  pickup_request_id: string;
  weight_kg: number;
  method: 'scale' | 'weighbridge' | 'estimate';
  photo_url: string | null;
  sms_sent_generator: boolean;
  sms_sent_driver: boolean;
  created_at: string;
}

export interface ProcessingBatch {
  id: string;
  recycler_org_id: string;
  recycler_profile_id: string;
  status: BatchStatus;
  methodology: ProcessingMethod;
  input_weight_kg: number;
  confirmed_weight_kg: number | null;
  energy_kwh: number | null;
  yield_kg: number | null;
  lab_report_url: string | null;
  notes: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;

  pickups?: PickupRequest[];
  recycler?: Profile;
  recycler_org?: Organisation;
}

export interface BatchProduct {
  id: string;
  batch_id: string;
  type: ProductType;
  quantity_kg: number;
  quality_grade: string | null;
  lab_cert_url: string | null;
}

export interface AuditReview {
  id: string;
  batch_id: string;
  checker_profile_id: string;
  status: AuditStatus;
  checklist: Record<string, boolean>;
  feedback: string | null;
  reviewed_at: string | null;
  created_at: string;

  batch?: ProcessingBatch;
  checker?: Profile;
}

export interface CarbonCredit {
  id: string;
  serial_number: string; // W2C-YYYY-NNNNNN
  batch_id: string;
  audit_review_id: string;
  vintage_year: number;
  methodology: ProcessingMethod;
  co2e_kg: number;
  price_usd: number;
  status: CreditStatus;
  owner_org_id: string | null;
  minted_at: string;
  listed_at: string | null;
  sold_at: string | null;
  retired_at: string | null;
  certificate_url: string | null;

  batch?: ProcessingBatch;
}

export interface Order {
  id: string;
  buyer_org_id: string;
  buyer_profile_id: string;
  credit_id: string;
  amount_usd: number;
  payment_ref: string | null;
  status: OrderStatus;
  auto_retire: boolean;
  created_at: string;

  credit?: CarbonCredit;
  buyer?: Profile;
}

export interface ImpactMetrics {
  id: string;
  total_waste_kg: number;
  total_co2e_kg: number;
  credits_minted: number;
  credits_retired: number;
  orgs_registered: number;
  updated_at: string;
}

export interface Notification {
  id: string;
  profile_id: string;
  type: string;
  channel: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface Dispute {
  id: string;
  raised_by_profile_id: string;
  pickup_request_id: string | null;
  route_stop_id: string | null;
  reason: string;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  resolution: string | null;
  created_at: string;
  resolved_at: string | null;
}
