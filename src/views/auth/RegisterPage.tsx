import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft, Building2, Package, Truck, Recycle, ShieldCheck, ShoppingCart } from 'lucide-react';

const ROLES = [
  { role: 'generator', label: 'Generator / Waste Producer', icon: <Package size={24} />, color: 'var(--color-success)', desc: 'Hotels, restaurants, markets, housing societies. Log waste, get pickups, track your carbon footprint.' },
  { role: 'driver',    label: 'Collection Driver',          icon: <Truck size={24} />,   color: 'var(--color-info)',    desc: 'Logistics partner. Manage routes, confirm pickups, issue weighbridge receipts.' },
  { role: 'recycler',  label: 'Recycler / Processor',       icon: <Recycle size={24} />, color: 'var(--color-accent)',  desc: 'Biochar kilns, biogas plants. Claim batches, log processing methods, submit for audit.' },
  { role: 'checker',   label: 'Auditor / Checker',          icon: <ShieldCheck size={24} />, color: '#a855f7',          desc: 'Independent verifier. Review audit queues, verify documentation, mint carbon credits.' },
  { role: 'buyer',     label: 'Carbon Credit Buyer',        icon: <ShoppingCart size={24} />, color: 'var(--color-warning)', desc: 'Corporate ESG teams. Browse, purchase and retire verified W2C carbon credits.' },
];

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '2rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Back link */}
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to login
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={20} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-text)' }}>CarboTrace</span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Register your organisation</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Choose your role to get started on the platform.</p>

        {/* Role cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
          {ROLES.map(r => (
            <div key={r.role} className="card card-hover" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }} id={`register-role-${r.role}`}>
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: `${r.color}18`, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {r.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{r.label}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{r.desc}</div>
              </div>
              <div style={{ color: 'var(--color-text-subtle)', fontSize: '1.25rem', alignSelf: 'center' }}>›</div>
            </div>
          ))}
        </div>

        {/* Org form preview */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Building2 size={16} color="var(--color-accent)" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Organisation Details</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Organisation Name', placeholder: 'The Leela Palace', id: 'reg-org-name' },
              { label: 'City', placeholder: 'Bengaluru', id: 'reg-org-city' },
              { label: 'Contact Email', placeholder: 'eco@example.com', id: 'reg-org-email' },
              { label: 'Phone', placeholder: '+91 98765 43210', id: 'reg-org-phone' },
            ].map(f => (
              <div className="form-group" key={f.id}>
                <label className="form-label">{f.label}</label>
                <input className="input-base" placeholder={f.placeholder} id={f.id} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }} id="register-submit-btn">
              Continue to Onboarding
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
