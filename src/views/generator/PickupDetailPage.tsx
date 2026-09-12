import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Truck, Scale, AlertTriangle, Camera, Upload } from 'lucide-react';
import { mockPickups } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatWeight, formatDateTime, WASTE_TYPE_LABELS, estimateCO2e, formatCO2e } from '@/lib/utils';

const STATUS_TIMELINE: { status: string; label: string }[] = [
  { status: 'draft',          label: 'Created' },
  { status: 'photo_pending',  label: 'Photo Uploaded' },
  { status: 'photo_verified', label: 'Photo Verified' },
  { status: 'queued',         label: 'Queued for Pickup' },
  { status: 'en_route',       label: 'Driver En Route' },
  { status: 'arrived',        label: 'Driver Arrived' },
  { status: 'weighed',        label: 'Weight Confirmed' },
  { status: 'completed',      label: 'Completed' },
];

const STATUS_ORDER = STATUS_TIMELINE.map(s => s.status);

export default function PickupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const pickup = mockPickups.find(p => p.id === id);

  if (!pickup) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}>
        <p>Pickup not found.</p>
        <Link to="/generator" className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }}>← Back</Link>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(pickup.status);
  const co2e = estimateCO2e(pickup.waste_type, pickup.actual_weight_kg ?? pickup.estimated_weight_kg);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/generator" className="btn btn-ghost btn-sm" id="back-to-dashboard">
          <ArrowLeft size={15} />
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="page-title" style={{ fontSize: '1.2rem', margin: 0 }}>Pickup Detail</h1>
            <StatusBadge status={pickup.status} type="pickup" />
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            <code style={{ color: 'var(--color-accent)', fontSize: '0.8rem' }}>{pickup.tracking_code}</code>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Waste Type',      value: WASTE_TYPE_LABELS[pickup.waste_type] },
          { label: 'Estimated Weight', value: formatWeight(pickup.estimated_weight_kg) },
          { label: 'Actual Weight',   value: pickup.actual_weight_kg ? formatWeight(pickup.actual_weight_kg) : 'Pending' },
          { label: 'CO₂e Avoided',   value: formatCO2e(co2e) },
        ].map(d => (
          <div key={d.label} className="card" style={{ padding: '0.875rem 1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{d.label}</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.25rem' }}>{d.value}</div>
          </div>
        ))}
      </div>

      {/* Flagged alert */}
      {pickup.status === 'flagged' && (
        <div style={{ background: 'hsl(4 86% 58% / 0.1)', border: '1px solid hsl(4 86% 58% / 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={16} color="var(--color-danger)" />
            <strong style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>Photo Flagged</strong>
          </div>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{pickup.photo_flag_reason}</p>
          <label htmlFor="re-upload" className="btn btn-sm btn-ghost" style={{ display: 'inline-flex', cursor: 'pointer' }}>
            <Upload size={14} /> Re-upload Photo
          </label>
          <input id="re-upload" type="file" accept="image/*" style={{ display: 'none' }} />
        </div>
      )}

      {/* Status timeline */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem' }}>Status Timeline</h2>
        <div className="timeline">
          {STATUS_TIMELINE.map((s, i) => {
            const done   = i < currentIdx || (pickup.status === 'completed' && i === currentIdx);
            const active = i === currentIdx && pickup.status !== 'completed' && pickup.status !== 'flagged';
            return (
              <div key={s.status} className="timeline-item">
                <div className={`timeline-dot ${done ? 'done' : active ? 'active' : ''}`}>
                  {done ? <CheckCircle2 size={14} /> : active ? <Clock size={14} /> : <span style={{ fontSize: '0.65rem', color: 'var(--color-text-subtle)' }}>{i + 1}</span>}
                </div>
                <div style={{ paddingTop: '4px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: done || active ? 600 : 400, color: done ? 'var(--color-success)' : active ? 'var(--color-accent)' : 'var(--color-text-subtle)' }}>
                    {s.label}
                  </div>
                  {active && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>In progress…</div>}
                  {done && i === 0 && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{formatDateTime(pickup.created_at)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Address */}
      <div className="card">
        <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Truck size={15} color="var(--color-accent)" /> Pickup Location
        </h2>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{pickup.pickup_address}</p>
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
          Coords: {pickup.location_lat.toFixed(6)}, {pickup.location_lng.toFixed(6)}
        </div>
      </div>
    </div>
  );
}
