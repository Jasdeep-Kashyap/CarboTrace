import { Link } from 'react-router-dom';
import { Recycle, Package, FlaskConical, Clock, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockBatches } from '@/lib/mock-data';
import { formatWeight, formatDate, PROCESSING_METHOD_LABELS } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function RecyclerDashboard() {
  const { profile } = useAuth();
  const processed  = mockBatches.filter(b => b.status === 'processed').length;
  const processing = mockBatches.filter(b => b.status === 'processing').length;
  const received   = mockBatches.filter(b => b.status === 'received').length;
  const totalInput = mockBatches.reduce((s, b) => s + b.input_weight_kg + (b.confirmed_weight_kg ?? 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Recycler Dashboard</h1>
        <p className="page-subtitle">Welcome, {profile?.full_name} · GreenCycle Industries</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Processed Batches" value={processed}              icon={<CheckCircle2 size={16} />} trend={2}   sub="Submitted for audit"     accentColor="var(--color-success)" id="stat-processed" />
        <StatCard label="In Processing"      value={processing}            icon={<FlaskConical size={16} />} trend={0}   sub="Active treatment cycles"  accentColor="var(--color-warning)" id="stat-processing" />
        <StatCard label="Received"           value={received}              icon={<Package size={16} />}      trend={1}   sub="Awaiting claim"           accentColor="var(--color-info)"    id="stat-received" />
        <StatCard label="Total Input"        value={formatWeight(totalInput)} icon={<Recycle size={16} />}  trend={12}  sub="Material processed"       accentColor="var(--color-accent)"  id="stat-input" />
      </div>

      {/* Batches table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Processing Batches</h2>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Methodology</th>
                <th>Input</th>
                <th>Yield</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mockBatches.map(batch => (
                <tr key={batch.id} id={`batch-row-${batch.id}`}>
                  <td>
                    <code style={{ fontSize: '0.75rem', background: 'var(--color-surface-2)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: 'var(--color-text-muted)' }}>
                      {batch.id.toUpperCase()}
                    </code>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{PROCESSING_METHOD_LABELS[batch.methodology]}</td>
                  <td style={{ fontSize: '0.85rem' }}>{formatWeight(batch.confirmed_weight_kg ?? batch.input_weight_kg)}</td>
                  <td style={{ fontSize: '0.85rem' }}>{batch.yield_kg ? formatWeight(batch.yield_kg) : <span style={{ color: 'var(--color-text-subtle)' }}>—</span>}</td>
                  <td><StatusBadge status={batch.status} type="batch" /></td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{formatDate(batch.created_at)}</td>
                  <td>
                    <Link to={`/recycler/batch/${batch.id}`} className="btn btn-ghost btn-sm" id={`view-batch-${batch.id}`}>
                      {batch.status === 'received' ? 'Log' : 'View'}
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
