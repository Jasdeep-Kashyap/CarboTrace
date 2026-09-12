import { Link } from 'react-router-dom';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockAuditReviews, mockBatches } from '@/lib/mock-data';
import { formatDate, formatDateTime, PROCESSING_METHOD_LABELS } from '@/lib/utils';

export default function AuditQueuePage() {
  const reviews = mockAuditReviews;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/checker" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
        <div>
          <h1 className="page-title">Audit Queue</h1>
          <p className="page-subtitle">{reviews.filter(r => r.status === 'pending').length} pending · {reviews.length} total</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {reviews.map(review => {
          const batch = review.batch ?? mockBatches.find(b => b.id === review.batch_id);
          const isPending = review.status === 'pending';
          return (
            <div key={review.id} className="card card-hover" id={`queue-item-${review.id}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                background: isPending ? 'hsl(38 95% 54% / 0.15)' : 'hsl(142 71% 45% / 0.15)',
                color: isPending ? 'var(--color-warning)' : 'var(--color-success)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ClipboardList size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Batch {review.batch_id.toUpperCase()}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                  {batch ? PROCESSING_METHOD_LABELS[batch.methodology] : '—'} · Submitted {review.reviewed_at ? formatDate(review.reviewed_at) : formatDate(review.created_at)}
                </div>
              </div>
              <StatusBadge status={review.status} type="audit" />
              <Link to={`/checker/audit/${review.id}`} className={`btn btn-sm ${isPending ? 'btn-accent' : 'btn-ghost'}`} id={`queue-review-btn-${review.id}`}>
                {isPending ? 'Review →' : 'View'}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
