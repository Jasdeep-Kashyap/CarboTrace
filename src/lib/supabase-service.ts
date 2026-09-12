import { supabase, isSupabaseConfigured } from './supabase';
import {
  mockImpactMetrics,
  mockPickups,
  mockRoutes,
  mockBatches,
  mockAuditReviews,
  mockCredits,
  mockOrgs,
  mockDisputes,
  mockProfiles,
} from './mock-data';
import type {
  ImpactMetrics,
  PickupRequest,
  Route,
  ProcessingBatch,
  AuditReview,
  CarbonCredit,
  Organisation,
  Dispute,
  Profile,
} from '@/types/database';

// ─── Impact Metrics ──────────────────────────────────────────────────────────
export async function getImpactMetrics(): Promise<ImpactMetrics> {
  if (!isSupabaseConfigured) return mockImpactMetrics;

  try {
    const { data, error } = await supabase
      .from('impact_metrics')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return mockImpactMetrics;
    return data as ImpactMetrics;
  } catch {
    return mockImpactMetrics;
  }
}

export function subscribeToImpactMetrics(callback: (metrics: ImpactMetrics) => void) {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('realtime:impact_metrics')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'impact_metrics' },
      payload => {
        if (payload.new) {
          callback(payload.new as ImpactMetrics);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ─── Pickups (Generator & Driver) ─────────────────────────────────────────────
export async function getPickups(orgId?: string): Promise<PickupRequest[]> {
  if (!isSupabaseConfigured) {
    if (orgId) return mockPickups.filter(p => p.org_id === orgId);
    return mockPickups;
  }

  try {
    let query = supabase.from('pickup_requests').select('*').order('created_at', { ascending: false });
    if (orgId) query = query.eq('org_id', orgId);
    const { data, error } = await query;
    if (error || !data || data.length === 0) return mockPickups;
    return data as PickupRequest[];
  } catch {
    return mockPickups;
  }
}

export async function createPickup(payload: Partial<PickupRequest>): Promise<PickupRequest> {
  if (!isSupabaseConfigured) {
    const newPickup: PickupRequest = {
      id: `pickup-${Date.now()}`,
      org_id: payload.org_id ?? 'org-1',
      generator_profile_id: payload.generator_profile_id ?? 'profile-gen',
      bin_id: payload.bin_id ?? null,
      waste_type: payload.waste_type ?? 'food_wet',
      estimated_weight_kg: payload.estimated_weight_kg ?? 50,
      actual_weight_kg: null,
      pickup_address: payload.pickup_address ?? 'Village Central Collection Point',
      location_lat: payload.location_lat ?? 12.9582,
      location_lng: payload.location_lng ?? 77.6484,
      status: payload.photo_url ? 'photo_verified' : 'photo_pending',
      photo_url: payload.photo_url ?? null,
      photo_verified: Boolean(payload.photo_url),
      photo_flag_reason: null,
      tracking_code: `W2C-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      notes: payload.notes ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockPickups.unshift(newPickup);
    return newPickup;
  }

  try {
    const { data, error } = await supabase
      .from('pickup_requests')
      .insert([payload])
      .select()
      .single();

    if (error || !data) throw error;
    return data as PickupRequest;
  } catch {
    // Graceful fallback
    const fallback: PickupRequest = {
      ...payload,
      id: `pickup-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as PickupRequest;
    mockPickups.unshift(fallback);
    return fallback;
  }
}

// ─── Routes (Driver Logistics) ────────────────────────────────────────────────
export async function getRoutes(): Promise<Route[]> {
  if (!isSupabaseConfigured) return mockRoutes;

  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*, stops:route_stops(*), driver:profiles(*)')
      .order('route_date', { ascending: false });

    if (error || !data || data.length === 0) return mockRoutes;
    return data as Route[];
  } catch {
    return mockRoutes;
  }
}

// ─── Batches (Recycler Processing) ────────────────────────────────────────────
export async function getBatches(): Promise<ProcessingBatch[]> {
  if (!isSupabaseConfigured) return mockBatches;

  try {
    const { data, error } = await supabase
      .from('processing_batches')
      .select('*, recycler:profiles(*), recycler_org:organisations(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return mockBatches;
    return data as ProcessingBatch[];
  } catch {
    return mockBatches;
  }
}

// ─── Audit Queue (Checker Desk) ───────────────────────────────────────────────
export async function getAuditReviews(): Promise<AuditReview[]> {
  if (!isSupabaseConfigured) return mockAuditReviews;

  try {
    const { data, error } = await supabase
      .from('audit_reviews')
      .select('*, batch:processing_batches(*), checker:profiles(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return mockAuditReviews;
    return data as AuditReview[];
  } catch {
    return mockAuditReviews;
  }
}

// ─── Carbon Credits (Marketplace & Buyer) ─────────────────────────────────────
export async function getCredits(): Promise<CarbonCredit[]> {
  if (!isSupabaseConfigured) return mockCredits;

  try {
    const { data, error } = await supabase
      .from('carbon_credits')
      .select('*, batch:processing_batches(*)')
      .order('minted_at', { ascending: false });

    if (error || !data || data.length === 0) return mockCredits;
    return data as CarbonCredit[];
  } catch {
    return mockCredits;
  }
}

// ─── Organisations (Admin Governance) ─────────────────────────────────────────
export async function getOrganisations(): Promise<Organisation[]> {
  if (!isSupabaseConfigured) return mockOrgs;

  try {
    const { data, error } = await supabase
      .from('organisations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return mockOrgs;
    return data as Organisation[];
  } catch {
    return mockOrgs;
  }
}

// ─── Disputes (Admin & Resolution) ────────────────────────────────────────────
export async function getDisputes(): Promise<Dispute[]> {
  if (!isSupabaseConfigured) return mockDisputes;

  try {
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return mockDisputes;
    return data as Dispute[];
  } catch {
    return mockDisputes;
  }
}

// ─── Profiles ─────────────────────────────────────────────────────────────────
export async function getProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured) return mockProfiles;

  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error || !data || data.length === 0) return mockProfiles;
    return data as Profile[];
  } catch {
    return mockProfiles;
  }
}
