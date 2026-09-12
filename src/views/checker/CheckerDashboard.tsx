import { Link } from 'react-router-dom';
import { ShieldCheck, ClipboardList, Award, Clock } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockAuditReviews, mockBatches } from '@/lib/mock-data';
import { formatDate, PROCESSING_METHOD_LABELS } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function CheckerDashboard() {
  const { profile } = useAuth();
  const pending  = mockAuditReviews.filter(a => a.status === 'pending' || a.status === 'in_review').length;
  const approved = mockAuditReviews.filter(a => a.status === 'approved').length;
  const rejected = mockAuditReviews.filter(a => a.status === 'rejected' || a.status === 'needs_info').length;
  const minted   = approved; // 1 credit per approved batch

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Checker Dashboard</h1>
          <p className="page-subtitle">Welcome, {profile?.full_name} · Carbon Auditor</p>
        </div>
        <Link to="/checker/queue" className="btn btn-accent" id="open-queue-btn">
          <ClipboardList size={16} /> Audit Queue ({pending})
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard label="Pending Reviews"  value={pending}  icon={<Clock size={16} />}       trend={0}  sub="Awaiting your review"  accentColor="var(--color-warning)" id="stat-pending" />
        <StatCard label="Approved"         value={approved} icon={<ShieldCheck size={16} />}  trend={2}  sub="Batches verified"       accentColor="var(--color-success)" id="stat-approved" />
        <StatCard label="Rejected / Info"  value={rejected} icon={<ClipboardList size={16} />} trend={0} sub="Sent back for info"     accentColor="var(--color-danger)"  id="stat-rejected" />
        <StatCard label="Credits Minted"   value={minted}   icon={<Award size={16} />}        trend={2}  sub="W2C serials generated"  accentColor="var(--color-accent)"  id="stat-minted" />
      </div>

      {/* Recent reviews */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Recent Audit Reviews</h2>
          <Link to="/checker/queue" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Batch</th>
                <th>Methodology</th>
                <th>Status</th>
                <th>Reviewed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mockAuditReviews.map(review => {
                const batch = review.batch ?? mockBatches.find(b => b.id === review.batch_id);
                return (
                  <tr key={review.id} id={`review-row-${review.id}`}>
                    <td>
                      <code style={{ fontSize: '0.75rem', background: 'var(--color-surface-2)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: 'var(--color-text-muted)' }}>
                        {review.batch_id.toUpperCase()}
                      </code>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{batch ? PROCESSING_METHOD_LABELS[batch.methodology] : '—'}</td>
                    <td><StatusBadge status={review.status} type="audit" /></td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{review.reviewed_at ? formatDate(review.reviewed_at) : '—'}</td>
                    <td>
                      <Link to={`/checker/audit/${review.id}`} className="btn btn-ghost btn-sm" id={`review-btn-${review.id}`}>
                        {review.status === 'pending' ? 'Review' : 'View'}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
