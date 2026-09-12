import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Plus, CheckCircle2, Scale } from 'lucide-react';
import { mockPickups } from '@/lib/mock-data';
import { formatWeight, formatDateTime, WASTE_TYPE_LABELS } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function ClaimBatchPage() {
  const navigate = useNavigate();
  // Filter for mock pickups that would be delivered to this recycler
  const incoming = mockPickups.filter(p => p.status === 'completed' || p.status === 'weighed');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [created, setCreated] = useState(false);

  const totalInputWeight = Array.from(selected).reduce((sum, id) => {
    const val = parseFloat(weights[id]);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function handleCreateBatch() {
    setCreated(true);
    setTimeout(() => navigate('/recycler'), 1500);
  }

  if (created) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: 'hsl(174 72% 46% / 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={32} color="var(--color-accent)" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Batch Created!</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 360 }}>Your new processing batch has been queued.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/recycler" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
        <div style={{ flex: 1 }}>
          <h1 className="page-title">Claim Deliveries & Create Batch</h1>
          <p className="page-subtitle">Select incoming waste pickups to group into a processing batch.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Pickup List */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Incoming Pickups</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{incoming.length} available</span>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>Tracking</th>
                  <th>Waste Type</th>
                  <th>Driver Est.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {incoming.map(p => {
                  const isSelected = selected.has(p.id);
                  return (
                    <tr key={p.id} style={{ background: isSelected ? 'hsl(174 72% 46% / 0.05)' : undefined }}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(p.id)}
                          style={{ accentColor: 'var(--color-accent)', width: 16, height: 16, cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <code style={{ fontSize: '0.75rem', background: 'var(--color-surface-2)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: 'var(--color-accent)' }}>
                          {p.tracking_code}
                        </code>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{WASTE_TYPE_LABELS[p.waste_type]}</td>
                      <td style={{ fontSize: '0.85rem' }}>{formatWeight(p.actual_weight_kg ?? p.estimated_weight_kg)}</td>
                      <td><StatusBadge status={p.status} type="pickup" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Summary & Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: 80 }}>
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={16} color="var(--color-accent)" /> Selected Items
            </h2>
            
            {selected.size === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Select pickups from the list to add them to this batch.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Array.from(selected).map(id => {
                  const p = incoming.find(x => x.id === id);
                  if (!p) return null;
                  return (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-surface-2)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ flex: 1 }}>
                        <code style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{p.tracking_code}</code>
                        <div style={{ fontSize: '0.75rem' }}>{WASTE_TYPE_LABELS[p.waste_type]}</div>
                      </div>
                      <div style={{ width: 80 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--color-bg)', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                          <Scale size={12} color="var(--color-text-muted)" />
                          <input
                            type="number"
                            value={weights[id] ?? p.actual_weight_kg ?? p.estimated_weight_kg}
                            onChange={e => setWeights({ ...weights, [id]: e.target.value })}
                            style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: '0.75rem', outline: 'none' }}
                            placeholder="kg"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total Confirmed</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-accent)' }}>{formatWeight(totalInputWeight)}</span>
                </div>
                
                <button className="btn btn-accent" onClick={handleCreateBatch} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <Plus size={16} /> Create Batch
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
