import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, ArrowRight, Recycle, Truck, ShieldCheck, ShoppingCart, Package, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/database';

const ROLES: { role: UserRole; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  { role: 'generator', label: 'Generator',    desc: 'Log waste pickups & track impact',         icon: <Package size={20} />,     color: 'var(--color-success)' },
  { role: 'driver',    label: 'Driver',        desc: 'Manage collection routes & receipts',       icon: <Truck size={20} />,       color: 'var(--color-info)' },
  { role: 'recycler',  label: 'Recycler',      desc: 'Process batches & submit for audit',       icon: <Recycle size={20} />,     color: 'var(--color-accent)' },
  { role: 'checker',   label: 'Checker',       desc: 'Audit batches & mint carbon credits',      icon: <ShieldCheck size={20} />, color: '#a855f7' },
  { role: 'buyer',     label: 'Buyer',         desc: 'Browse & purchase carbon credits',         icon: <ShoppingCart size={20} />,color: 'var(--color-warning)' },
  { role: 'admin',     label: 'Admin',         desc: 'Platform-wide management & oversight',     icon: <Settings size={20} />,    color: 'var(--color-danger)' },
];

export default function LoginPage() {
  const [selected, setSelected] = useState<UserRole>('generator');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    login(selected);
    const roleRedirects: Record<UserRole, string> = {
      generator: '/generator',
      driver:    '/driver',
      recycler:  '/recycler',
      checker:   '/checker',
      buyer:     '/marketplace',
      admin:     '/admin',
    };
    navigate(roleRedirects[selected]);
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--color-bg)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 420px', display: 'flex', flexDirection: 'column',
        padding: '2.5rem', background: 'var(--color-surface-0)',
        borderRight: '1px solid var(--color-border)',
        overflow: 'auto',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '3rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)' }}>CarboTrace</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Waste-to-Carbon Platform</div>
          </div>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
          Welcome back
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Select your role to enter the demo portal
        </p>

        {/* Email (visual only) */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Email address</label>
          <input className="input-base" type="email" defaultValue="demo@carbotrace.in" id="login-email" />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Password</label>
          <input className="input-base" type="password" defaultValue="••••••••" id="login-password" />
        </div>

        {/* Role picker */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Demo Portal</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {ROLES.map(r => (
              <button
                key={r.role}
                id={`role-btn-${r.role}`}
                onClick={() => setSelected(r.role)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${selected === r.role ? r.color : 'var(--color-border)'}`,
                  background: selected === r.role ? `${r.color}12` : 'var(--color-surface-1)',
                  color: selected === r.role ? r.color : 'var(--color-text-muted)',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
                  transition: 'all 0.18s',
                }}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <button id="login-submit-btn" className="btn btn-accent btn-lg" onClick={handleLogin} style={{ width: '100%', justifyContent: 'center' }}>
          Enter Portal <ArrowRight size={16} />
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>
            Register your organisation
          </Link>
        </p>
      </div>

      {/* Right panel — hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
            Turn Waste Into<br />Verified Carbon Value
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            An end-to-end platform connecting waste generators, logistics, recyclers, auditors and carbon-credit buyers on a single auditable ledger.
          </p>

          {/* Live stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { val: '1,842 t', label: 'Waste Diverted' },
              { val: '738 t',   label: 'CO₂e Avoided' },
              { val: '1,247',   label: 'Credits Minted' },
            ].map(s => (
              <div key={s.label} className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-accent)' }}>{s.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
