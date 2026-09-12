import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, TrendingUp, Award, Building2, Calculator,
  ChevronRight, Recycle, Zap, TreePine, Car,
} from 'lucide-react';
import { mockImpactMetrics, mockLeaderboard } from '@/lib/mock-data';
import { formatWeight, formatCO2e, estimateCO2e, co2eComparisons, WASTE_TYPE_LABELS } from '@/lib/utils';

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 2000, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return <>{val.toLocaleString('en-IN')}{suffix}</>;
}

// ─── Hero counters ────────────────────────────────────────────────────────────
const COUNTERS = [
  { label: 'Waste Diverted',    value: 1843,   suffix: ' t',   icon: <Recycle size={20} />,  color: 'var(--color-success)', sub: 'From landfills this year' },
  { label: 'CO₂e Avoided',     value: 738,    suffix: ' t',   icon: <Leaf size={20} />,      color: 'var(--color-accent)',  sub: 'Carbon emissions prevented' },
  { label: 'Credits Minted',   value: 1247,   suffix: '',     icon: <Award size={20} />,     color: '#a855f7',              sub: 'W2C-verified carbon credits' },
  { label: 'Credits Retired',  value: 891,    suffix: '',     icon: <TrendingUp size={20} />,color: 'var(--color-warning)', sub: 'Permanently offset' },
  { label: 'Orgs Registered',  value: 312,    suffix: '',     icon: <Building2 size={20} />, color: 'var(--color-info)',    sub: 'Hotels, markets & factories' },
];

// ─── Playbook steps ────────────────────────────────────────────────────────────
const PLAYBOOK = [
  { step: '01', title: 'Segregate at Source', desc: 'Separate organic waste (food, garden) from dry waste. Use dedicated green bins.', icon: '♻️' },
  { step: '02', title: 'Log on CarboTrace',   desc: 'Scan your bin QR code, upload an overhead photo, and request a pickup.', icon: '📱' },
  { step: '03', title: 'Verified Collection', desc: 'Driver arrives within 50m geofence, swaps bin, weighs waste — receipt sent via SMS.', icon: '🚛' },
  { step: '04', title: 'Recycler Processing', desc: 'Waste is transformed via pyrolysis or biogas digestion. Lab tests validate yield.', icon: '🏭' },
  { step: '05', title: 'Carbon Credit Minted', desc: 'Auditor reviews all evidence → mints a W2C-YYYY-NNNNNN verified carbon credit.', icon: '✅' },
  { step: '06', title: 'Trade or Retire',     desc: 'Buyers purchase credits on the marketplace. Retire instantly for a climate certificate.', icon: '🌍' },
];

export default function PublicDashboard() {
  const metrics = mockImpactMetrics;
  const [wasteType, setWasteType] = useState('food_wet');
  const [weightKg, setWeightKg] = useState(100);
  const co2e = estimateCO2e(wasteType, weightKg);
  const comparisons = co2eComparisons(co2e);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'Geist Variable, system-ui, sans-serif' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'hsl(222 16% 7% / 0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', padding: '0 2rem', height: 60, gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={16} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text)' }}>CarboTrace</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/login"    className="btn btn-ghost btn-sm" id="nav-login-btn">Sign In</Link>
          <Link to="/register" className="btn btn-accent btn-sm" id="nav-register-btn">Register Org</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: '5rem 2rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Orbs */}
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%',  width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <div className="badge badge-teal" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            🇮🇳 Built for India · HACKOUT '26
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.25rem' }}>
            <span className="text-gradient">Waste → Carbon Value</span><br />
            <span style={{ color: 'var(--color-text)' }}>On a Single Verified Ledger</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 2rem' }}>
            Connect waste generators, logistics, recyclers, auditors and carbon-credit buyers. Every handoff is tamper-proof and traceable.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-accent btn-lg" id="hero-register-btn">
              Register Organisation <ChevronRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg" id="hero-login-btn">
              Demo Portals
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live counters ── */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Platform Impact — Live</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Updated every 5 minutes via Supabase Realtime</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
          {COUNTERS.map((c, i) => (
            <div key={c.label} className="card" style={{ textAlign: 'center', animation: `fade-up 0.5s ${i * 0.1}s ease-out both` }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${c.color}18`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                {c.icon}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }} id={`counter-${c.label.replace(/\s/g, '-').toLowerCase()}`}>
                <AnimatedNumber target={c.value} suffix={c.suffix} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginTop: '0.5rem' }}>{c.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Leaderboard ── */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Award size={20} color="var(--color-warning)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Organisation Leaderboard</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mockLeaderboard.map((entry, i) => (
            <div key={entry.org.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1rem',
                background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : i === 1 ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 'linear-gradient(135deg, #b45309, #92400e)',
                color: 'white',
              }}>
                {entry.rank}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{entry.org.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{entry.org.city} · {entry.org.type.replace('_', ' ')}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.95rem' }}>{formatCO2e(entry.co2e_kg)}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{formatWeight(entry.waste_kg)} diverted</div>
              </div>
              <div className="badge badge-green">{entry.credits} credits</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footprint Calculator ── */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div className="glass-accent" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Calculator size={20} color="var(--color-accent)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Carbon Footprint Calculator</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Waste Type</label>
                <select className="input-base" value={wasteType} onChange={e => setWasteType(e.target.value)} id="calc-waste-type">
                  {Object.entries(WASTE_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg): <strong style={{ color: 'var(--color-text)' }}>{weightKg} kg</strong></label>
                <input type="range" min={10} max={5000} step={10} value={weightKg} onChange={e => setWeightKg(Number(e.target.value))} id="calc-weight-slider"
                  style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-subtle)' }}>
                  <span>10 kg</span><span>5,000 kg</span>
                </div>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Estimated CO₂e Avoided</div>
                <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900 }}>{formatCO2e(co2e)}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                {comparisons.map(c => (
                  <div key={c.label} style={{ background: 'var(--color-surface-1)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-accent)' }}>{c.value.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Playbook ── */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>How the Waste Value Chain Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {PLAYBOOK.map((p, i) => (
            <div key={p.step} className="card" style={{ animation: `fade-up 0.5s ${i * 0.08}s ease-out both` }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{p.icon}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.375rem' }}>STEP {p.step}</div>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{p.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '3rem 2rem 5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Ready to turn your waste into value?
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Join 312+ organisations already tracking their carbon impact on CarboTrace.
          </p>
          <Link to="/register" className="btn btn-accent btn-lg" id="cta-register-btn" style={{ justifyContent: 'center' }}>
            Register Your Organisation <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '1.5rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Leaf size={16} color="var(--color-accent)" />
          <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>CarboTrace</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>
          HACKOUT '26 · Waste-to-Carbon Credit Tracking Platform · India
        </p>
      </footer>
    </div>
  );
}
