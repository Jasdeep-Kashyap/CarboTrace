import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Scale, Zap, Upload, CheckCircle2, Send } from 'lucide-react';
import { mockBatches } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PROCESSING_METHOD_LABELS, formatWeight } from '@/lib/utils';

const METHODS = Object.entries(PROCESSING_METHOD_LABELS).map(([k, v]) => ({ value: k, label: v }));

export default function ProcessingLogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const batch = mockBatches.find(b => b.id === id);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    methodology: batch?.methodology ?? 'pyrolysis',
    energy_kwh: batch?.energy_kwh ?? '',
    yield_kg: batch?.yield_kg ?? '',
    lab_url: batch?.lab_report_url ?? '',
    notes: batch?.notes ?? '',
  });

  if (!batch) return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Batch not found. <Link to="/recycler">← Back</Link></div>;

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => navigate('/recycler'), 1800);
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, background: 'hsl(174 72% 46% / 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={32} color="var(--color-accent)" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Submitted for Audit</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 360 }}>Batch {batch.id.toUpperCase()} has been queued for checker review. You'll be notified of the audit result.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/recycler" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="page-title" style={{ fontSize: '1.2rem', margin: 0 }}>Processing Log</h1>
            <StatusBadge status={batch.status} type="batch" />
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>Batch {batch.id.toUpperCase()}</p>
        </div>
      </div>

      {/* Input summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Input Weight',     value: formatWeight(batch.confirmed_weight_kg ?? batch.input_weight_kg) },
          { label: 'Methodology',      value: PROCESSING_METHOD_LABELS[batch.methodology] },
          { label: 'Submitted',        value: batch.submitted_at ? 'Yes' : 'No' },
        ].map(d => (
          <div key={d.label} className="card" style={{ padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{d.label}</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem' }}>{d.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FlaskConical size={16} color="var(--color-accent)" /> Processing Details
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Processing Methodology</label>
            <select className="input-base" value={form.methodology} onChange={e => set('methodology', e.target.value)} id="methodology-select">
              {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Energy Consumed (kWh)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={14} color="var(--color-warning)" />
                <input className="input-base" type="number" value={form.energy_kwh} onChange={e => set('energy_kwh', e.target.value)} placeholder="e.g. 920" id="energy-input" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Material Yield (kg)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Scale size={14} color="var(--color-text-muted)" />
                <input className="input-base" type="number" value={form.yield_kg} onChange={e => set('yield_kg', e.target.value)} placeholder="e.g. 138" id="yield-input" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lab Report URL</label>
            <input className="input-base" type="url" value={form.lab_url} onChange={e => set('lab_url', e.target.value)} placeholder="https://labs.example.com/report/..." id="lab-url-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="input-base" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Quality notes, observations…" style={{ resize: 'vertical' }} id="notes-textarea" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', gap: '0.75rem' }}>
        <Link to="/recycler" className="btn btn-ghost">Cancel</Link>
        <button className="btn btn-accent" onClick={handleSubmit} id="submit-for-audit-btn">
          <Send size={15} /> Submit for Audit
        </button>
      </div>
    </div>
  );
}
