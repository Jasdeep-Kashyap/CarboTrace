import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Tailwind class merger ────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Weight ───────────────────────────────────────────────────────────────────
export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`;
  return `${kg.toLocaleString('en-IN')} kg`;
}

// ─── CO₂e ─────────────────────────────────────────────────────────────────────
export function formatCO2e(kg: number): string {
  if (kg >= 1_000_000) return `${(kg / 1_000_000).toFixed(2)} Mt CO₂e`;
  if (kg >= 1000)      return `${(kg / 1000).toFixed(2)} t CO₂e`;
  return `${kg.toLocaleString('en-IN')} kg CO₂e`;
}

// ─── Currency ─────────────────────────────────────────────────────────────────
export function formatCurrency(usd: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(usd);
}

export function formatINR(inr: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inr);
}

// ─── Date/time ────────────────────────────────────────────────────────────────
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── Credit serial ────────────────────────────────────────────────────────────
export function formatSerial(serial: string): string {
  return serial; // W2C-YYYY-NNNNNN already formatted
}

// ─── Percentage ───────────────────────────────────────────────────────────────
export function formatPercent(val: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((val / total) * 100)}%`;
}

// ─── Tracking code ────────────────────────────────────────────────────────────
export function generateTrackingCode(): string {
  const prefix = 'W2C';
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${year}-${rand}`;
}

// ─── CO₂e estimation ─────────────────────────────────────────────────────────
export const CO2E_FACTORS: Record<string, number> = {
  food_wet:           0.42,
  garden:             0.35,
  agricultural:       0.31,
  industrial_organic: 0.55,
  mixed_organic:      0.40,
};

export function estimateCO2e(wasteType: string, weightKg: number): number {
  const factor = CO2E_FACTORS[wasteType] ?? 0.40;
  return Math.round(weightKg * factor * 100) / 100;
}

// ─── Comparisons for footprint calculator ────────────────────────────────────
export function co2eComparisons(co2eKg: number) {
  return [
    { label: 'Car trips avoided', value: Math.round(co2eKg / 0.21), unit: 'km trips' },
    { label: 'Flight hours offset', value: Math.round(co2eKg / 90), unit: 'flight hours' },
    { label: 'Trees equivalent', value: Math.round(co2eKg / 21), unit: 'trees/year' },
    { label: 'LED bulbs powered', value: Math.round(co2eKg / 0.005), unit: 'hours' },
  ];
}

// ─── Status colors ─────────────────────────────────────────────────────────
export function pickupStatusColor(status: string): string {
  const map: Record<string, string> = {
    draft:          'gray',
    photo_pending:  'amber',
    photo_verified: 'teal',
    queued:         'blue',
    assigned:       'blue',
    en_route:       'teal',
    arrived:        'teal',
    weighed:        'green',
    completed:      'green',
    cancelled:      'red',
    flagged:        'red',
  };
  return map[status] ?? 'gray';
}

export function auditStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending:    'amber',
    in_review:  'blue',
    approved:   'green',
    rejected:   'red',
    needs_info: 'amber',
  };
  return map[status] ?? 'gray';
}

export function creditStatusColor(status: string): string {
  const map: Record<string, string> = {
    minted:    'teal',
    listed:    'blue',
    sold:      'purple',
    retired:   'green',
    cancelled: 'red',
  };
  return map[status] ?? 'gray';
}

// ─── Waste type labels ────────────────────────────────────────────────────────
export const WASTE_TYPE_LABELS: Record<string, string> = {
  food_wet:           'Food Waste (Wet)',
  garden:             'Garden / Green Waste',
  agricultural:       'Agricultural Waste',
  industrial_organic: 'Industrial Organic',
  mixed_organic:      'Mixed Organic',
};

export const PROCESSING_METHOD_LABELS: Record<string, string> = {
  pyrolysis:           'Pyrolysis',
  anaerobic_digestion: 'Anaerobic Digestion',
  composting:          'Composting',
  gasification:        'Gasification',
  hydrothermal:        'Hydrothermal',
};

export const ORG_TYPE_LABELS: Record<string, string> = {
  hotel:           'Hotel',
  market:          'Market',
  factory:         'Factory',
  housing_society: 'Housing Society',
  restaurant:      'Restaurant',
  canteen:         'Canteen',
  recycler:        'Recycler',
  checker:         'Checker / Auditor',
  buyer:           'Buyer',
  logistics:       'Logistics',
  municipality:    'Municipality',
};

// ─── Role display ─────────────────────────────────────────────────────────────
export const ROLE_LABELS: Record<string, string> = {
  generator: 'Generator',
  driver:    'Driver',
  recycler:  'Recycler',
  checker:   'Checker',
  buyer:     'Buyer',
  admin:     'Admin',
};

export const ROLE_COLORS: Record<string, string> = {
  generator: 'green',
  driver:    'blue',
  recycler:  'teal',
  checker:   'purple',
  buyer:     'amber',
  admin:     'red',
};
