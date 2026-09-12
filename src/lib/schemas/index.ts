import { z } from 'zod';

// ─── Database Enums ──────────────────────────────────────────────────────────

export const UserRoleSchema = z.enum(['generator', 'driver', 'recycler', 'checker', 'buyer', 'admin']);
export const OrgTypeSchema = z.enum([
  'hotel', 'market', 'factory', 'housing_society', 'restaurant',
  'canteen', 'recycler', 'checker', 'buyer', 'logistics', 'municipality'
]);
export const WasteTypeSchema = z.enum([
  'food_wet', 'garden', 'agricultural', 'industrial_organic', 'mixed_organic'
]);
export const BinStatusSchema = z.enum([
  'clean', 'assigned', 'full', 'in_transit', 'sanitizing', 'maintenance'
]);
export const PickupStatusSchema = z.enum([
  'draft', 'photo_pending', 'photo_verified', 'queued', 'assigned',
  'en_route', 'arrived', 'weighed', 'completed', 'cancelled', 'flagged'
]);
export const RouteStatusSchema = z.enum(['planned', 'active', 'completed', 'cancelled']);
export const BatchStatusSchema = z.enum(['in_transit', 'received', 'processing', 'processed', 'rejected']);
export const ProcessingMethodSchema = z.enum([
  'pyrolysis', 'anaerobic_digestion', 'composting', 'gasification', 'hydrothermal'
]);
export const ProductTypeSchema = z.enum(['biochar', 'biogas', 'biomethane', 'clean_fuel', 'compost', 'bio_oil']);
export const AuditStatusSchema = z.enum(['pending', 'in_review', 'approved', 'rejected', 'needs_info']);
export const CreditStatusSchema = z.enum(['minted', 'listed', 'sold', 'retired', 'cancelled']);
export const OrderStatusSchema = z.enum(['pending', 'paid', 'fulfilled', 'cancelled', 'refunded']);

// ─── Database Row Schemas ───────────────────────────────────────────────────────

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  full_name: z.string().min(1),
  email: z.string().email(),
  role: UserRoleSchema,
  org_id: z.string().uuid().nullable(),
  phone: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const OrganisationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: OrgTypeSchema,
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  gstin: z.string().nullable(),
  contact_email: z.string().email(),
  contact_phone: z.string().min(1),
  logo_url: z.string().url().nullable(),
  verified: z.boolean(),
  tier: z.enum(['free', 'basic', 'pro', 'enterprise']),
  total_co2e_kg: z.number().min(0),
  total_waste_kg: z.number().min(0),
  created_at: z.string().datetime(),
});

export const WasteTypeRowSchema = z.object({
  id: z.string().uuid(),
  code: WasteTypeSchema,
  label: z.string().min(1),
  co2e_factor: z.number().positive(),
  description: z.string(),
});

export const BinSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  qr_code: z.string().min(1),
  location_lat: z.number(),
  location_lng: z.number(),
  location_label: z.string().min(1),
  capacity_kg: z.number().positive(),
  status: BinStatusSchema,
  last_pickup_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export const PickupRequestSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  generator_profile_id: z.string().uuid(),
  bin_id: z.string().uuid().nullable(),
  waste_type: WasteTypeSchema,
  estimated_weight_kg: z.number().positive(),
  actual_weight_kg: z.number().positive().nullable(),
  pickup_address: z.string().min(1),
  location_lat: z.number(),
  location_lng: z.number(),
  status: PickupStatusSchema,
  photo_url: z.string().url().nullable(),
  photo_verified: z.boolean(),
  photo_flag_reason: z.string().nullable(),
  tracking_code: z.string().min(1),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const RouteSchema = z.object({
  id: z.string().uuid(),
  driver_profile_id: z.string().uuid(),
  route_date: z.string(),
  status: RouteStatusSchema,
  started_at: z.string().datetime().nullable(),
  completed_at: z.string().datetime().nullable(),
  total_stops: z.number().int().min(0),
  completed_stops: z.number().int().min(0),
  total_weight_kg: z.number().min(0),
  created_at: z.string().datetime(),
});

export const RouteStopSchema = z.object({
  id: z.string().uuid(),
  route_id: z.string().uuid(),
  pickup_request_id: z.string().uuid(),
  sequence: z.number().int().positive(),
  status: z.enum(['pending', 'arrived', 'weighed', 'completed', 'skipped']),
  arrived_at: z.string().datetime().nullable(),
  departed_at: z.string().datetime().nullable(),
  weight_kg: z.number().positive().nullable(),
  receipt_photo_url: z.string().url().nullable(),
  sms_sent: z.boolean(),
  payout_released: z.boolean(),
  created_at: z.string().datetime(),
});

export const GeofenceEventSchema = z.object({
  id: z.string().uuid(),
  route_stop_id: z.string().uuid(),
  driver_profile_id: z.string().uuid(),
  event_type: z.enum(['arrival', 'departure']),
  lat: z.number(),
  lng: z.number(),
  distance_m: z.number(),
  within_fence: z.boolean(),
  recorded_at: z.string().datetime(),
});

export const WeighbridgeReceiptSchema = z.object({
  id: z.string().uuid(),
  route_stop_id: z.string().uuid(),
  pickup_request_id: z.string().uuid(),
  weight_kg: z.number().positive(),
  method: z.enum(['scale', 'weighbridge', 'estimate']),
  photo_url: z.string().url().nullable(),
  sms_sent_generator: z.boolean(),
  sms_sent_driver: z.boolean(),
  created_at: z.string().datetime(),
});

export const ProcessingBatchSchema = z.object({
  id: z.string().uuid(),
  recycler_org_id: z.string().uuid(),
  recycler_profile_id: z.string().uuid(),
  status: BatchStatusSchema,
  methodology: ProcessingMethodSchema,
  input_weight_kg: z.number().positive(),
  confirmed_weight_kg: z.number().positive().nullable(),
  energy_kwh: z.number().nonnegative().nullable(),
  yield_kg: z.number().nonnegative().nullable(),
  lab_report_url: z.string().url().nullable(),
  notes: z.string().nullable(),
  submitted_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const BatchProductSchema = z.object({
  id: z.string().uuid(),
  batch_id: z.string().uuid(),
  type: ProductTypeSchema,
  quantity_kg: z.number().positive(),
  quality_grade: z.string().nullable(),
  lab_cert_url: z.string().url().nullable(),
});

export const AuditReviewSchema = z.object({
  id: z.string().uuid(),
  batch_id: z.string().uuid(),
  checker_profile_id: z.string().uuid(),
  status: AuditStatusSchema,
  checklist: z.record(z.boolean()),
  feedback: z.string().nullable(),
  reviewed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export const CarbonCreditSchema = z.object({
  id: z.string().uuid(),
  serial_number: z.string().min(1),
  batch_id: z.string().uuid(),
  audit_review_id: z.string().uuid(),
  vintage_year: z.number().int(),
  methodology: ProcessingMethodSchema,
  co2e_kg: z.number().positive(),
  price_usd: z.number().positive(),
  status: CreditStatusSchema,
  owner_org_id: z.string().uuid().nullable(),
  minted_at: z.string().datetime(),
  listed_at: z.string().datetime().nullable(),
  sold_at: z.string().datetime().nullable(),
  retired_at: z.string().datetime().nullable(),
  certificate_url: z.string().url().nullable(),
});

export const OrderSchema = z.object({
  id: z.string().uuid(),
  buyer_org_id: z.string().uuid(),
  buyer_profile_id: z.string().uuid(),
  credit_id: z.string().uuid(),
  amount_usd: z.number().positive(),
  payment_ref: z.string().nullable(),
  status: OrderStatusSchema,
  auto_retire: z.boolean(),
  created_at: z.string().datetime(),
});

export const ImpactMetricsSchema = z.object({
  id: z.string().uuid(),
  total_waste_kg: z.number().min(0),
  total_co2e_kg: z.number().min(0),
  credits_minted: z.number().int().min(0),
  credits_retired: z.number().int().min(0),
  orgs_registered: z.number().int().min(0),
  updated_at: z.string().datetime(),
});

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  type: z.string().min(1),
  channel: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  read: z.boolean(),
  created_at: z.string().datetime(),
});

export const DisputeSchema = z.object({
  id: z.string().uuid(),
  raised_by_profile_id: z.string().uuid(),
  pickup_request_id: z.string().uuid().nullable(),
  route_stop_id: z.string().uuid().nullable(),
  reason: z.string().min(1),
  status: z.enum(['open', 'under_review', 'resolved', 'dismissed']),
  resolution: z.string().nullable(),
  created_at: z.string().datetime(),
  resolved_at: z.string().datetime().nullable(),
});
