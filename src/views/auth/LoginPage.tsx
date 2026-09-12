import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, ArrowRight, Recycle, Truck, ShieldCheck, ShoppingCart, Package, Settings, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/database';
import { ThemeToggle } from '@/components/ThemeToggle';

const ROLES: { role: UserRole; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  { role: 'generator', label: 'Generator', desc: 'Log waste pickups & track impact', icon: <Package size={18} />, color: 'var(--accent)' },
  { role: 'driver', label: 'Driver', desc: 'Manage collection routes & receipts', icon: <Truck size={18} />, color: 'var(--blue)' },
  { role: 'recycler', label: 'Recycler', desc: 'Process batches & submit for audit', icon: <Recycle size={18} />, color: 'var(--cyan)' },
  { role: 'checker', label: 'Checker', desc: 'Audit batches & mint carbon credits', icon: <ShieldCheck size={18} />, color: 'var(--purple)' },
  { role: 'buyer', label: 'Buyer', desc: 'Browse & purchase carbon credits', icon: <ShoppingCart size={18} />, color: 'var(--amber)' },
  { role: 'admin', label: 'Admin', desc: 'Platform-wide management & oversight', icon: <Settings size={18} />, color: 'var(--red)' },
];

export default function LoginPage() {
  const [selected, setSelected] = useState<UserRole>('generator');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    login(selected);
    const roleRedirects: Record<UserRole, string> = {
      generator: '/generator',
      driver: '/driver',
      recycler: '/recycler',
      checker: '/checker',
      buyer: '/marketplace',
      admin: '/admin',
    };
    navigate(roleRedirects[selected]);
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-sans)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 440px', display: 'flex', flexDirection: 'column',
        padding: '3rem 2.5rem', background: 'var(--surface-0)',
        borderRight: '1px solid var(--border)',
        overflowY: 'auto',
      }}>
        {/* Logo -> Home */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', cursor: 'pointer' }} title="Go to CarboTrace Home">
            <div style={{
              width: 40, height: 40, borderRadius: '12px',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Leaf size={20} color="var(--accent)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--fg)', letterSpacing: '-0.02em' }}>
                  Carbo<span style={{ color: 'var(--accent)' }}>Trace</span>
                </span>
              </div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)', letterSpacing: '0.05em' }}>
                WASTE-TO-CARBON PLATFORM
              </div>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.375rem', color: 'var(--fg)' }}>
          Welcome back
        </h1>
        <p style={{ color: 'var(--fg-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
          Choose a role to explore verified custody records & live dashboards
        </p>

        {/* Email & Password */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Email address</label>
          <input className="input-base" type="email" defaultValue="demo@carbotrace.in" id="login-email" />
        </div>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Password</label>
          <input className="input-base" type="password" defaultValue="••••••••" id="login-password" />
        </div>

        {/* Role picker */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label className="form-label" style={{ marginBottom: '0.625rem', display: 'block' }}>Select Persona Demo Portal</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {ROLES.map(r => {
              const isSelected = selected === r.role;
              return (
                <button
                  key={r.role}
                  id={`role-btn-${r.role}`}
                  onClick={() => setSelected(r.role)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.625rem 0.75rem', borderRadius: '10px',
                    border: `1px solid ${isSelected ? r.color : 'var(--border)'}`,
                    background: isSelected ? `color-mix(in srgb, ${r.color} 15%, transparent)` : 'var(--surface-2)',
                    color: isSelected ? 'var(--fg)' : 'var(--fg-muted)',
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: isSelected ? 600 : 500,
                    boxShadow: isSelected ? `0 0 12px color-mix(in srgb, ${r.color} 25%, transparent)` : 'none',
                    transition: 'all 0.18s',
                  }}
                >
                  <span style={{ color: r.color }}>{r.icon}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{r.label}</span>
                  {isSelected && <Check size={14} color={r.color} />}
                </button>
              );
            })}
          </div>
        </div>

        <button id="login-submit-btn" className="btn btn-primary btn-lg" onClick={handleLogin} style={{ width: '100%', justifyContent: 'center' }}>
          Enter Portal <ArrowRight size={16} />
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--fg-muted)' }}>
          Need an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            Register your organisation
          </Link>
        </p>
      </div>

      {/* Right panel — hero showcase */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '3rem', position: 'relative', overflow: 'hidden', background: 'var(--bg)',
      }} className="console-grid">
        <div style={{ position: 'absolute', top: '15%', left: '20%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(143, 240, 117, 0.08) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', filter: 'blur(70px)' }} />

        <div style={{ position: 'relative', maxWidth: 520, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.25rem 0.875rem', borderRadius: '999px',
            background: 'var(--accent-dim)', border: '1px solid var(--accent)',
            color: 'var(--accent)', fontSize: '11px', fontFamily: 'var(--font-mono)',
            marginBottom: '1.5rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-ring 1.8s ease-out infinite' }} />
            HACKOUT '26
          </div>

          <h2 className="text-gradient" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.15 }}>
            From Feedstock To<br />Auditable Carbon Proof
          </h2>
          <p style={{ color: 'var(--fg-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.25rem' }}>
            A high-assurance MRV protocol tracking the complete transformation cycle from organic agricultural waste to permanently sequestered biochar and minted carbon credits.
          </p>

          {/* Live stats card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { val: '1,843 t', label: 'Waste Diverted', color: 'var(--accent)' },
              { val: '738 t', label: 'CO₂e Avoided', color: 'var(--cyan)' },
              { val: '1,247', label: 'Credits Minted', color: 'var(--purple)' },
            ].map(s => (
              <div key={s.label} className="card card-hover corner-ticks" style={{ padding: '1.15rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--fg-subtle)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
