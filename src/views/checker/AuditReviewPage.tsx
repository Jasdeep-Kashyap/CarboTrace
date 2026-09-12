import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, MessageSquare, Award, Check, X } from 'lucide-react';
import { mockAuditReviews, mockBatches, mockPickups } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatWeight, formatDateTime, PROCESSING_METHOD_LABELS, estimateCO2e, formatCO2e } from '@/lib/utils';

const CHECKLIST_ITEMS: { key: string; label: string }[] = [
  { key: 'pickup_logs_verified',   label: 'Pickup logs verified (weights match)' },
  { key: 'geofence_events_valid',  label: 'Driver geofence events present' },
  { key: 'weighbridge_match',      label: 'Weighbridge receipt matches generator log' },
  { key: 'lab_report_present',     label: 'Lab report / certificate uploaded' },
  { key: 'methodology_compliant',  label: 'Processing methodology compliant' },
  { key: 'yield_plausible',        label: 'Yield % is within expected range' },
];

export default function AuditReviewPage() {
  const { id } = useParams<{ id: string }>();
  const review = mockAuditReviews.find(r => r.id === id);
  const [checklist, setChecklist] = useState<Record<string, boolean>>(review?.checklist ?? {});
  const [feedback, setFeedback]   = useState(review?.feedback ?? '');
  const [decision, setDecision]   = useState<'approved' | 'rejected' | 'needs_info' | null>(
    review?.status === 'approved' ? 'approved' : review?.status === 'rejected' ? 'rejected' : null
  );
  const [creditSerial, setCreditSerial] = useState<string | null>(
    review?.status === 'approved' ? 'W2C-2026-000001' : null
  );

  if (!review) return <div style={{ padding: '2rem' }}>Review not found. <Link to="/checker/queue">← Back</Link></div>;

  const batch = review.batch ?? mockBatches.find(b => b.id === review.batch_id);
  const allChecked = CHECKLIST_ITEMS.every(item => checklist[item.key]);
  const co2e = batch ? estimateCO2e(batch.methodology, batch.yield_kg ?? batch.confirmed_weight_kg ?? batch.input_weight_kg) : 0;

  function handleApprove() {
    const serial = `W2C-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    setCreditSerial(serial);
    setDecision('approved');
  }

  function handleReject(type: 'rejected' | 'needs_info') { setDecision(type); }

  function toggle(key: string) { setChecklist(c => ({ ...c, [key]: !c[key] })); }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/checker/queue" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="page-title" style={{ fontSize: '1.2rem', margin: 0 }}>Audit Review</h1>
            <StatusBadge status={review.status} type="audit" />
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>Batch {review.batch_id.toUpperCase()}</p>
        </div>
      </div>

      {/* Credit minted banner */}
      {decision === 'approved' && creditSerial && (
        <div style={{ background: 'hsl(142 71% 45% / 0.1)', border: '1px solid hsl(142 71% 45% / 0.3)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'hsl(142 71% 45% / 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} color="var(--color-success)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-success)' }}>Carbon Credit Minted!</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Serial: <code style={{ color: 'var(--color-accent)', fontSize: '0.9rem', fontWeight: 700 }}>{creditSerial}</code> · {formatCO2e(co2e)} verified
            </div>
          </div>
        </div>
      )}

      {/* Batch summary */}
      {batch && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Input Weight',  value: formatWeight(batch.confirmed_weight_kg ?? batch.input_weight_kg) },
            { label: 'Methodology',   value: PROCESSING_METHOD_LABELS[batch.methodology] },
            { label: 'Yield',         value: batch.yield_kg ? formatWeight(batch.yield_kg) : '—' },
            { label: 'CO₂e',          value: formatCO2e(co2e) },
          ].map(d => (
            <div key={d.label} className="card" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{d.label}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.2rem' }}>{d.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Checklist */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Audit Checklist</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {CHECKLIST_ITEMS.map(item => (
            <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: checklist[item.key] ? 'hsl(142 71% 45% / 0.05)' : 'transparent', transition: 'background 0.2s' }} id={`checklist-${item.key}`}>
              <div style={{
                width: 20, height: 20, borderRadius: '5px', flexShrink: 0,
                border: `2px solid ${checklist[item.key] ? 'var(--color-success)' : 'var(--color-border)'}`,
                background: checklist[item.key] ? 'var(--color-success)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s',
              }} onClick={() => decision === null && toggle(item.key)}>
                {checklist[item.key] && <Check size={12} color="white" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: '0.875rem', color: checklist[item.key] ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Evidence links */}
      {batch?.lab_report_url && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>Evidence Documents</h2>
          <a href={batch.lab_report_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
            📄 Lab Report / Certificate →
          </a>
          {batch.notes && <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{batch.notes}</p>}
        </div>
      )}

      {/* Feedback */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label className="form-label">Audit Feedback / Notes</label>
        <textarea className="input-base" rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Document your findings, observations, or reasons for rejection…" style={{ resize: 'vertical' }} id="audit-feedback" disabled={decision !== null} />
      </div>

      {/* Action buttons */}
      {decision === null && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-accent"
            onClick={handleApprove}
            disabled={!allChecked}
            id="approve-btn"
            style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}
          >
            <CheckCircle2 size={16} /> Approve & Mint Credit
          </button>
          <button className="btn btn-ghost" onClick={() => handleReject('needs_info')} id="needs-info-btn">
            <MessageSquare size={15} /> Needs Info
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleReject('rejected')} id="reject-btn">
            <XCircle size={15} /> Reject
          </button>
        </div>
      )}
      {!allChecked && decision === null && (
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)', marginTop: '0.5rem' }}>
          Complete all checklist items before approving.
        </p>
      )}
      {decision === 'rejected' && (
        <div className="badge badge-red" style={{ marginTop: '1rem' }}>❌ Batch Rejected — Feedback sent to recycler</div>
      )}
      {decision === 'needs_info' && (
        <div className="badge badge-amber" style={{ marginTop: '1rem' }}>⏳ Needs Info — Batch returned to recycler</div>
      )}
    </div>
  );
}
