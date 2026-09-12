import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Scale, Zap, Upload, CheckCircle2, Send } from 'lucide-react';
import { mockBatches } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PROCESSING_METHOD_LABELS, formatWeight } from '@/lib/utils';
import type { ProcessingMethod } from '@/types/database';

const METHODS = Object.entries(PROCESSING_METHOD_LABELS).map(([k, v]) => ({ value: k, label: String(v) }));

export default function ProcessingLogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const batch = mockBatches.find(b => b.id === id);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<{
    methodology: ProcessingMethod;
    energy_kwh: number | string;
    yield_kg: number | string;
    lab_url: string;
    notes: string;
  }>({
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
    setTimeout(() => navigate('/recycler'), 1500);
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <Link to="/recycler" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          <ArrowLeft size={16} /> Back to Recycler Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Log Processing</h1>
          <StatusBadge status={batch.status} />
        </div>
        <p className="page-subtitle">Record conversion methodology, energy consumption, and yield</p>
      </div>

      {submitted && (
        <div style={{ background: 'hsl(142 71% 45% / 0.15)', border: '1px solid hsl(142 71% 45% / 0.4)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'hsl(142 71% 55%)' }}>
          <CheckCircle2 size={20} />
          <div>
            <div style={{ fontWeight: 600 }}>Processing logged successfully!</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Batch status advanced to processed. Redirecting...</div>
          </div>
        </div>
      )}

      {/* Batch summary card */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Batch ID</div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>{batch.id}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Methodology</div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem', textTransform: 'capitalize' }}>{batch.methodology.replace('_', ' ')}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Input Weight</div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>{formatWeight(batch.confirmed_weight_kg ?? batch.input_weight_kg)}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: '#8FF075' }}>{batch.status}</div>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FlaskConical size={16} color="var(--color-accent)" /> Processing Details
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Processing Methodology</label>
            <select className="input-base" value={form.methodology} onChange={e => set('methodology', e.target.value as ProcessingMethod)} id="methodology-select">
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
