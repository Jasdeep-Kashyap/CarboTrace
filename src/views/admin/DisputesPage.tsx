import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { mockDisputes } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';

export default function DisputesPage() {
  const [states, setStates] = useState<Record<string, string>>(
    Object.fromEntries(mockDisputes.map(d => [d.id, d.status]))
  );

  function resolve(id: string) { setStates(s => ({ ...s, [id]: 'resolved' })); }
  function dismiss(id: string) { setStates(s => ({ ...s, [id]: 'dismissed' })); }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/admin" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
        <div>
          <h1 className="page-title">Dispute Resolution</h1>
          <p className="page-subtitle">{mockDisputes.length} disputes · {Object.values(states).filter(s => s === 'open').length} open</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {mockDisputes.map(dispute => {
          const status = states[dispute.id];
          const resolved = status === 'resolved' || status === 'dismissed';
          return (
            <div key={dispute.id} className="card" id={`dispute-card-${dispute.id}`} style={{ borderLeft: `3px solid ${resolved ? 'var(--color-success)' : status === 'under_review' ? 'var(--color-warning)' : 'var(--color-danger)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                  <AlertTriangle size={16} color={resolved ? 'var(--color-success)' : 'var(--color-warning)'} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{dispute.reason}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      Raised {formatDateTime(dispute.created_at)}
                      {dispute.pickup_request_id && ` · Pickup ${dispute.pickup_request_id}`}
                    </div>
                  </div>
                </div>
                <span className={`badge ${resolved ? 'badge-green' : status === 'under_review' ? 'badge-amber' : 'badge-red'}`} style={{ flexShrink: 0 }}>
                  {status.replace('_', ' ')}
                </span>
              </div>

              {!resolved && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => resolve(dispute.id)} id={`resolve-dispute-${dispute.id}`}>
                    <CheckCircle2 size={13} /> Resolve
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => dismiss(dispute.id)} id={`dismiss-dispute-${dispute.id}`}>
                    Dismiss
                  </button>
                </div>
              )}
              {resolved && (
                <span style={{ fontSize: '0.78rem', color: 'var(--color-success)' }}>
                  ✓ {status === 'resolved' ? 'Resolved by admin' : 'Dismissed'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
