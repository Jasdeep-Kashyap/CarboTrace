import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle2, Download, RotateCcw } from 'lucide-react';
import { mockCredits } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatCO2e, formatCurrency, formatDate, PROCESSING_METHOD_LABELS } from '@/lib/utils';

export default function CreditDetailPage() {
  const { id } = useParams<{ id: string }>();
  const credit = mockCredits.find(c => c.id === id);
  const [purchased, setPurchased] = useState(false);
  const [autoRetire, setAutoRetire] = useState(true);

  if (!credit) return <div style={{ padding: '2rem' }}>Credit not found. <Link to="/marketplace">← Back</Link></div>;

  function handleBuy() { setPurchased(true); }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/marketplace" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="page-title" style={{ fontSize: '1.1rem', margin: 0 }}>Credit Detail</h1>
            <StatusBadge status={credit.status} type="credit" />
          </div>
          <code style={{ fontSize: '0.85rem', color: 'var(--color-accent)', marginTop: '0.25rem', display: 'block' }}>{credit.serial_number}</code>
        </div>
      </div>

      {purchased && (
        <div style={{ background: 'hsl(142 71% 45% / 0.1)', border: '1px solid hsl(142 71% 45% / 0.3)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <CheckCircle2 size={32} color="var(--color-success)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-success)' }}>Purchase Complete!</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {autoRetire ? 'Credit auto-retired. Certificate ready to download.' : 'Credit transferred to your account.'}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: '0.75rem' }} id="download-cert-btn">
            <Download size={14} /> Download Certificate PDF
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'CO₂e Certified',  value: formatCO2e(credit.co2e_kg) },
          { label: 'Methodology',     value: PROCESSING_METHOD_LABELS[credit.methodology] },
          { label: 'Vintage Year',    value: String(credit.vintage_year) },
          { label: 'Minted',          value: formatDate(credit.minted_at) },
        ].map(d => (
          <div key={d.label} className="card" style={{ padding: '0.875rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{d.label}</div>
            <div style={{ fontWeight: 700, marginTop: '0.25rem' }}>{d.value}</div>
          </div>
        ))}
      </div>

      {/* Provenance trail */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Provenance Trail</h2>
        {[
          { label: 'Generator', desc: 'Bengaluru APMC Market · 460 kg food waste', icon: '🏪', done: true },
          { label: 'Driver',    desc: 'Ravi Kumar · Geofence verified · 455 kg weighed', icon: '🚛', done: true },
          { label: 'Recycler',  desc: 'GreenCycle Industries · Pyrolysis · 138 kg biochar', icon: '♻️', done: true },
          { label: 'Auditor',   desc: 'Dr. Meena Nair · All checks passed · Credit minted', icon: '✅', done: true },
        ].map(step => (
          <div key={step.label} style={{ display: 'flex', gap: '0.75rem', padding: '0.625rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '1.25rem' }}>{step.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{step.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{step.desc}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              {step.done && <span className="badge badge-green"><CheckCircle2 size={10} /> Verified</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Checkout */}
      {credit.status === 'listed' && !purchased && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{formatCurrency(credit.price_usd)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>per tCO₂e</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Total: <strong style={{ color: 'var(--color-text)' }}>{formatCurrency(credit.price_usd * (credit.co2e_kg / 1000))}</strong>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.875rem' }} id="auto-retire-label">
            <input type="checkbox" checked={autoRetire} onChange={e => setAutoRetire(e.target.checked)} id="auto-retire-checkbox" style={{ accentColor: 'var(--color-accent)', width: 16, height: 16 }} />
            <RotateCcw size={14} color="var(--color-accent)" />
            Auto-retire after purchase (generates certificate immediately)
          </label>

          <button className="btn btn-accent" onClick={handleBuy} style={{ width: '100%', justifyContent: 'center' }} id="buy-now-btn">
            <ShoppingCart size={16} /> Purchase Credit
          </button>
        </div>
      )}
    </div>
  );
}
