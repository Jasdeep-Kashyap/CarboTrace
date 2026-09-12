import { Link } from 'react-router-dom';
import { Plus, Package, CheckCircle2, Clock, AlertTriangle, Leaf, Camera } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockPickups } from '@/lib/mock-data';
import { formatWeight, formatCO2e, formatDateTime, estimateCO2e, WASTE_TYPE_LABELS } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function GeneratorDashboard() {
  const { profile } = useAuth();

  const myPickups = mockPickups;
  const completed = myPickups.filter(p => p.status === 'completed').length;
  const pending   = myPickups.filter(p => ['queued', 'photo_pending', 'photo_verified', 'assigned', 'en_route', 'arrived', 'weighed'].includes(p.status)).length;
  const flagged   = myPickups.filter(p => p.status === 'flagged').length;
  const totalWaste = myPickups.reduce((s, p) => s + (p.actual_weight_kg ?? p.estimated_weight_kg), 0);
  const totalCO2e  = estimateCO2e('food_wet', totalWaste);

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Generator Dashboard</h1>
          <p className="page-subtitle">Welcome back, {profile?.full_name} · {profile?.org_id ? 'Organisation logged in' : ''}</p>
        </div>
        <Link to="/generator/new" className="btn btn-accent" id="new-pickup-btn">
          <Plus size={16} /> New Pickup
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Total Pickups"    value={myPickups.length} icon={<Package size={16} />}      trend={5}    sub="+2 this week"        accentColor="var(--color-accent)"  id="stat-total-pickups" />
        <StatCard label="Completed"        value={completed}        icon={<CheckCircle2 size={16} />}  trend={3}    sub="Successfully collected" accentColor="var(--color-success)" id="stat-completed" />
        <StatCard label="Pending"          value={pending}          icon={<Clock size={16} />}         trend={0}    sub="Awaiting pickup"       accentColor="var(--color-info)"    id="stat-pending" />
        <StatCard label="Waste Diverted"   value={formatWeight(totalWaste)} icon={<Leaf size={16} />} trend={8}    sub={formatCO2e(totalCO2e) + ' CO₂e saved'} accentColor="var(--color-primary)" id="stat-waste" />
      </div>

      {/* Flagged alert */}
      {flagged > 0 && (
        <div style={{ background: 'hsl(4 86% 58% / 0.1)', border: '1px solid hsl(4 86% 58% / 0.3)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={18} color="var(--color-danger)" />
          <div>
            <strong style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{flagged} pickup(s) flagged</strong>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Photo contamination detected. Please re-upload an overhead photo.</p>
          </div>
          <Link to={`/generator/${mockPickups.find(p => p.status === 'flagged')?.id}`} className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }}>
            Fix Now
          </Link>
        </div>
      )}

      {/* Pickup list */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>My Pickup Requests</h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{myPickups.length} total</span>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Tracking Code</th>
                <th>Waste Type</th>
                <th>Weight</th>
                <th>Status</th>
                <th>Photo</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myPickups.map(p => (
                <tr key={p.id} id={`pickup-row-${p.id}`}>
                  <td>
                    <code style={{ fontSize: '0.78rem', background: 'var(--color-surface-2)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--color-accent)' }}>
                      {p.tracking_code}
                    </code>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{WASTE_TYPE_LABELS[p.waste_type]}</td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {p.actual_weight_kg ? formatWeight(p.actual_weight_kg) : `~${formatWeight(p.estimated_weight_kg)}`}
                    {!p.actual_weight_kg && <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', marginLeft: '0.25rem' }}>est.</span>}
                  </td>
                  <td><StatusBadge status={p.status} type="pickup" /></td>
                  <td>
                    {p.photo_verified ? (
                      <span className="badge badge-green"><CheckCircle2 size={11} /> Verified</span>
                    ) : p.photo_url ? (
                      <span className="badge badge-amber"><Clock size={11} /> Pending</span>
                    ) : (
                      <span className="badge badge-gray"><Camera size={11} /> Required</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{formatDateTime(p.created_at)}</td>
                  <td>
                    <Link to={`/generator/${p.id}`} className="btn btn-ghost btn-sm" id={`view-pickup-${p.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
