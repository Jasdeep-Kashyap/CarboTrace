import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle2, Clock, Navigation, Scale, AlertCircle } from 'lucide-react';
import { mockRoutes } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatWeight, formatDateTime, WASTE_TYPE_LABELS } from '@/lib/utils';

export default function RoutePage() {
  const { id } = useParams<{ id: string }>();
  const route = mockRoutes.find(r => r.id === id);
  const [stopStates, setStopStates] = useState<Record<string, 'pending' | 'arrived' | 'weighed' | 'completed'>>(
    Object.fromEntries((route?.stops ?? []).map(s => [s.id, s.status as 'pending' | 'arrived' | 'weighed' | 'completed']))
  );
  const [weight, setWeight] = useState<Record<string, string>>({});
  const [geofence, setGeofence] = useState<Record<string, boolean>>({});
  const [selectedStop, setSelectedStop] = useState<string | null>(null);

  if (!route) {
    return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Route not found. <Link to="/driver">← Back</Link></div>;
  }

  function simulateArrival(stopId: string) {
    setGeofence(g => ({ ...g, [stopId]: true }));
    setStopStates(s => ({ ...s, [stopId]: 'arrived' }));
    setSelectedStop(stopId);
  }

  function confirmWeight(stopId: string) {
    if (!weight[stopId]) return;
    setStopStates(s => ({ ...s, [stopId]: 'weighed' }));
  }

  function completeStop(stopId: string) {
    setStopStates(s => ({ ...s, [stopId]: 'completed' }));
    setSelectedStop(null);
  }

  const stops = route.stops ?? [];
  const completed = stops.filter(s => stopStates[s.id] === 'completed').length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/driver" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
        <div style={{ flex: 1 }}>
          <h1 className="page-title">Route — {route.route_date}</h1>
          <p className="page-subtitle">{completed}/{stops.length} stops completed</p>
        </div>
        <StatusBadge status={route.status} type="route" label={route.status.charAt(0).toUpperCase() + route.status.slice(1)} />
      </div>

      {/* Map placeholder */}
      <div className="map-placeholder" style={{ height: 220, marginBottom: '1.5rem' }}>
        <Navigation size={36} color="var(--color-accent)" style={{ opacity: 0.7 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Live Route Map</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>Leaflet.js integration · Shows {stops.length} stops</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>Simulated geofence: {Object.values(geofence).filter(Boolean).length} arrivals logged</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
          <span>Route Progress</span>
          <span>{Math.round((completed / stops.length) * 100)}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--color-surface-2)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(completed / stops.length) * 100}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', borderRadius: '99px', transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* Stops */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {stops.map((stop, i) => {
          const state = stopStates[stop.id];
          const isSelected = selectedStop === stop.id;
          const pickup = stop.pickup;

          return (
            <div key={stop.id} className="card" id={`stop-card-${stop.id}`} style={{ border: isSelected ? '1.5px solid var(--color-accent)' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                {/* Sequence badge */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: state === 'completed' ? 'hsl(142 71% 45% / 0.15)' : state === 'arrived' || state === 'weighed' ? 'hsl(174 72% 46% / 0.15)' : 'var(--color-surface-2)',
                  color: state === 'completed' ? 'var(--color-success)' : state === 'arrived' || state === 'weighed' ? 'var(--color-accent)' : 'var(--color-text-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
                }}>
                  {state === 'completed' ? <CheckCircle2 size={16} /> : i + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{pickup?.pickup_address ?? 'Stop location'}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                    {pickup ? WASTE_TYPE_LABELS[pickup.waste_type] : ''} · ~{formatWeight(pickup?.estimated_weight_kg ?? 0)}
                  </div>
                  {pickup && (
                    <code style={{ fontSize: '0.7rem', color: 'var(--color-accent)', marginTop: '0.25rem', display: 'block' }}>{pickup.tracking_code}</code>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {state === 'pending' && (
                    <button className="btn btn-accent btn-sm" onClick={() => simulateArrival(stop.id)} id={`arrive-btn-${stop.id}`}>
                      <MapPin size={13} /> Arrive
                    </button>
                  )}
                  {state === 'arrived' && (
                    <span className="badge badge-teal"><Clock size={11} /> At Stop</span>
                  )}
                  {state === 'weighed' && (
                    <button className="btn btn-primary btn-sm" onClick={() => completeStop(stop.id)} id={`complete-btn-${stop.id}`}>
                      <CheckCircle2 size={13} /> Complete
                    </button>
                  )}
                  {state === 'completed' && (
                    <span className="badge badge-green"><CheckCircle2 size={11} /> Done</span>
                  )}
                </div>
              </div>

              {/* Geofence confirmation */}
              {geofence[stop.id] && state !== 'completed' && (
                <div style={{ marginTop: '0.75rem', padding: '0.625rem', background: 'hsl(174 72% 46% / 0.08)', border: '1px solid hsl(174 72% 46% / 0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--color-accent)' }}>
                  ✅ Geofence arrival logged (within 50m) · Payout locked
                </div>
              )}

              {/* Weighbridge form */}
              {state === 'arrived' && isSelected && (
                <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.625rem', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Actual Weight (kg)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Scale size={14} color="var(--color-text-muted)" />
                      <input className="input-base" type="number" placeholder="Enter kg" value={weight[stop.id] ?? ''} onChange={e => setWeight(w => ({ ...w, [stop.id]: e.target.value }))} id={`weight-input-${stop.id}`} />
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => confirmWeight(stop.id)} id={`confirm-weight-${stop.id}`}>
                    Confirm & SMS
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
