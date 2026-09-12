import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, TrendingUp, Award, Building2, Calculator,
  ChevronRight, Recycle, Zap, ShieldCheck, ArrowUpRight,
  Package, Truck, Settings, ShoppingCart,
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
  { label: 'Waste Diverted', value: 1843, suffix: ' t', icon: <Recycle size={20} />, color: '#8FF075', sub: 'From landfills this year' },
  { label: 'CO₂e Avoided', value: 738, suffix: ' t', icon: <Leaf size={20} />, color: '#00D2EF', sub: 'Carbon emissions prevented' },
  { label: 'Credits Minted', value: 1247, suffix: '', icon: <Award size={20} />, color: '#AC4BFF', sub: 'W2C-verified carbon credits' },
  { label: 'Credits Retired', value: 891, suffix: '', icon: <TrendingUp size={20} />, color: '#3B82F6', sub: 'Permanently offset' },
  { label: 'Orgs Registered', value: 312, suffix: '', icon: <Building2 size={20} />, color: '#F99C00', sub: 'Hotels, markets & factories' },
];

// ─── Playbook steps ────────────────────────────────────────────────────────────
const PLAYBOOK = [
  { step: '01', title: 'Segregate at Source', desc: 'Separate organic waste (food, garden) from dry waste. Use dedicated green bins.', icon: '♻️' },
  { step: '02', title: 'Log on CarboTrace', desc: 'Scan your bin QR code, upload an overhead photo, and request a pickup.', icon: '📱' },
  { step: '03', title: 'Verified Collection', desc: 'Driver arrives within 50m geofence, swaps bin, weighs waste — receipt sent via SMS.', icon: '🚛' },
  { step: '04', title: 'Recycler Processing', desc: 'Waste is transformed via pyrolysis or biogas digestion. Lab tests validate yield.', icon: '🏭' },
  { step: '05', title: 'Carbon Credit Minted', desc: 'Auditor reviews all evidence → mints a W2C-YYYY-NNNNNN verified carbon credit.', icon: '✅' },
  { step: '06', title: 'Trade or Retire', desc: 'Buyers purchase credits on the marketplace. Retire instantly for a climate certificate.', icon: '🌍' },
];

export default function PublicDashboard() {
  const metrics = mockImpactMetrics;
  const [wasteType, setWasteType] = useState('food_wet');
  const [weightKg, setWeightKg] = useState(100);
  const co2e = estimateCO2e(wasteType, weightKg);
  const comparisons = co2eComparisons(co2e);

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D10', color: '#E2E8F0', fontFamily: 'var(--font-sans)' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(11, 13, 16, 0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex', alignItems: 'center', padding: '0 2rem', height: 64, gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(143, 240, 117, 0.2), rgba(59, 130, 246, 0.2))',
            border: '1px solid rgba(143, 240, 117, 0.4)',
            boxShadow: '0 0 15px rgba(143, 240, 117, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={18} color="#8FF075" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Carbo<span style={{ color: '#8FF075' }}>Trace</span>
            </span>
            <span style={{
              fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '1px 5px',
              borderRadius: '4px', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)'
            }}>MRV v2.4</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#12151A] border border-white/8 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#8FF075] animate-pulse shadow-[0_0_8px_#8FF075]" />
            <span className="text-white/60">LEDGER SYNCED</span>
          </div>
          <Link to="/impact" className="btn btn-ghost btn-sm" id="nav-impact-btn" style={{ color: '#8FF075', gap: '0.375rem' }}><ShieldCheck size={14} /> Village Impact (Mock)</Link>
          <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login-btn">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">Register Org</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: '6rem 2rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Glow Orbs */}
        <div style={{ position: 'absolute', top: '-15%', left: '15%', width: 550, height: 550, borderRadius: '50%', background: 'radial-gradient(circle, rgba(143, 240, 117, 0.15) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '25%', right: '15%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.25rem 0.875rem', borderRadius: '999px',
            background: 'rgba(143, 240, 117, 0.1)', border: '1px solid rgba(143, 240, 117, 0.25)',
            color: '#8FF075', fontSize: '11px', fontFamily: 'var(--font-mono)',
            marginBottom: '1.5rem',
          }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FF075] animate-ping" />
            WASTE-TO-CARBON VALUE CHAIN PROTOCOL · HACKOUT "26
          </div>
          <h1 style={{ fontSize: 'clamp(2.3rem, 5.5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            <span className="text-gradient">From Agricultural & Urban Waste</span><br />
            <span style={{ color: '#FFFFFF' }}>To Verified Carbon Value</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 2.25rem' }}>
            Connect waste generators, logistics carriers, pyrolyzers, auditors, and ESG carbon buyers. Every handoff is cryptographically verifiable and tamper-proof.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg shadow-lg shadow-[#8FF075]/20" id="hero-register-btn">
              Register Organisation <ChevronRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg" id="hero-login-btn">
              Explore Demo Portals
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live counters ── */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF' }}>Platform Impact — Live Ledger</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
            Real-time telemetry from connected collection hubs & processing kilns
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          {COUNTERS.map((c, i) => (
            <div key={c.label} className="card card-hover" style={{ textAlign: 'center', animation: `fade-up 0.5s ${i * 0.1}s ease-out both` }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${c.color}18`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', border: `1px solid ${c.color}33` }}>
                {c.icon}
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1, fontFamily: 'var(--font-mono)' }} id={`counter-${c.label.replace(/\s/g, '-').toLowerCase()}`}>
                <AnimatedNumber target={c.value} suffix={c.suffix} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.5rem' }}>{c.label}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', marginTop: '0.25rem' }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Impact Banner ── */}
        <div style={{
          marginTop: '1.5rem', background: 'linear-gradient(135deg, rgba(143, 240, 117, 0.08), rgba(0, 210, 239, 0.05))',
          border: '1px solid rgba(143, 240, 117, 0.25)', borderRadius: '14px', padding: '1.25rem 1.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(143, 240, 117, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8FF075', flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Village Pilot Impact & Empirical Source Methodologies</span>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '1px 5px', borderRadius: '4px', background: 'rgba(249, 156, 0, 0.15)', color: '#F99C00', border: '1px solid rgba(249, 156, 0, 0.3)' }}>
                  MOCK SIMULATION
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                Simulated village-scale telemetry (~142 rural households). Inspect authentic IPCC 2019 formulas, US EPA WARM factors, and pond leachate prevention.
              </div>
            </div>
          </div>
          <Link to="/impact" className="btn btn-primary btn-sm" style={{ gap: '0.375rem' }} id="counters-view-impact-btn">
            Explore Village Model <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Leaderboard ── */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Award size={20} color="#F99C00" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Organisation Impact Leaderboard</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mockLeaderboard.map((entry, i) => (
            <div key={entry.org.id} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.95rem', fontFamily: 'var(--font-mono)',
                background: i === 0 ? 'linear-gradient(135deg, #FDE047, #F99C00)' : i === 1 ? 'linear-gradient(135deg, #E2E8F0, #94A3B8)' : 'linear-gradient(135deg, #FDBA74, #EA580C)',
                color: '#0B0D10',
              }}>
                {entry.rank}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#FFFFFF' }}>{entry.org.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>{entry.org.city} · {entry.org.type.replace('_', ' ')}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, color: '#8FF075', fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>{formatCO2e(entry.co2e_kg)}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)' }}>{formatWeight(entry.waste_kg)} diverted</div>
              </div>
              <div className="badge badge-green">{entry.credits} credits</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footprint Calculator ── */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div className="glass-accent" style={{ borderRadius: '1.25rem', padding: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Calculator size={20} color="#8FF075" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Carbon Footprint & Yield Estimator</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Waste Feedstock Classification</label>
                <select className="input-base" value={wasteType} onChange={e => setWasteType(e.target.value)} id="calc-waste-type">
                  {Object.entries(WASTE_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{String(v)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Mass Input: <strong style={{ color: '#8FF075', fontFamily: 'var(--font-mono)' }}>{weightKg.toLocaleString()} kg</strong></label>
                <input type="range" min={10} max={5000} step={10} value={weightKg} onChange={e => setWeightKg(Number(e.target.value))} id="calc-weight-slider"
                  style={{ width: '100%', accentColor: '#8FF075' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>
                  <span>10 kg</span><span>5,000 kg</span>
                </div>
              </div>
            </div>

            <div>
              <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                  Estimated Net CO₂e Avoided
                </div>
                <div className="text-gradient" style={{ fontSize: '2.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{formatCO2e(co2e)}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                {comparisons.map(c => (
                  <div key={c.label} style={{ background: '#12151A', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#8FF075', fontFamily: 'var(--font-mono)' }}>{c.value.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.2rem' }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Playbook ── */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center', color: '#FFFFFF' }}>How the Waste-to-Carbon Chain Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {PLAYBOOK.map((p, i) => (
            <div key={p.step} className="card card-hover" style={{ animation: `fade-up 0.5s ${i * 0.08}s ease-out both` }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{p.icon}</div>
              <div style={{ fontSize: '0.72rem', color: '#8FF075', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.375rem', fontFamily: 'var(--font-mono)' }}>STEP {p.step}</div>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#FFFFFF' }}>{p.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Direct Access to All Portals ── */}
      <section style={{ padding: '3rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(143, 240, 117, 0.1)', border: '1px solid rgba(143, 240, 117, 0.25)', color: '#8FF075', fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
            UNIVERSAL PORTAL ACCESS · 1-CLICK WORKFLOWS
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Explore All 6 Connected Stakeholder Portals
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', margin: '0.35rem 0 0' }}>
            Jump directly into any workflow — every dashboard is unlocked and accessible
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[
            {
              role: 'Generator',
              path: '/generator',
              icon: <Package size={22} color="#8FF075" />,
              color: '#8FF075',
              title: 'Waste Generator Portal',
              desc: 'Log pickups, scan bin QR codes, upload overhead verification photos, and track bin status.',
              badge: 'Source Producer',
            },
            {
              role: 'Driver',
              path: '/driver',
              icon: <Truck size={22} color="#3B82F6" />,
              color: '#3B82F6',
              title: 'Logistics Driver PWA',
              desc: 'Route navigation, 50m geofence arrival detection, scale weighbridge logging & instant SMS receipts.',
              badge: 'Logistics Fleet',
            },
            {
              role: 'Recycler',
              path: '/recycler',
              icon: <Recycle size={22} color="#00D2EF" />,
              color: '#00D2EF',
              title: 'Recycler Kiln Facility',
              desc: 'Claim incoming batches, monitor high-temp pyrolysis & digestion, upload certified lab tests.',
              badge: 'Thermal / Bio Plant',
            },
            {
              role: 'Checker',
              path: '/checker',
              icon: <ShieldCheck size={22} color="#AC4BFF" />,
              color: '#AC4BFF',
              title: 'ISO Checker & Auditor Desk',
              desc: 'Review tamper-evident audit checklists, inspect weighbridge tickets, and mint verified W2C credits.',
              badge: 'MRV Compliance',
            },
            {
              role: 'Buyer',
              path: '/marketplace',
              icon: <ShoppingCart size={22} color="#F99C00" />,
              color: '#F99C00',
              title: 'Carbon Credit Marketplace',
              desc: 'Filter verified vintage credits by methodology, checkout with INR/USD, and retire for ESG certificates.',
              badge: 'Corporate Buyers',
            },
            {
              role: 'Admin',
              path: '/admin',
              icon: <Settings size={22} color="#EF4444" />,
              color: '#EF4444',
              title: 'Protocol Governance Admin',
              desc: 'Manage registered organisations, arbitrate weighbridge disputes, and inspect immutable audit logs.',
              badge: 'Protocol Admin',
            },
          ].map(portal => (
            <Link
              key={portal.path}
              to={portal.path}
              className="card card-hover"
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', borderRadius: '16px', position: 'relative' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${portal.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${portal.color}30` }}>
                    {portal.icon}
                  </div>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: portal.color, border: '1px solid rgba(255,255,255,0.1)' }}>
                    {portal.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.4rem' }}>
                  {portal.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5, margin: 0 }}>
                  {portal.desc}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: portal.color, fontWeight: 600, marginTop: '1.25rem', fontFamily: 'var(--font-mono)' }}>
                Launch Dashboard <ArrowUpRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '4rem 2rem 6rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFFFFF' }}>
            Ready to monetize waste into verified carbon credits?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Join 312+ organisations already tracking their circular waste lifecycle and earning carbon credits on CarboTrace.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn" style={{ justifyContent: 'center' }}>
            Register Your Organisation <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.75rem 2rem', textAlign: 'center', background: '#0B0D10' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Leaf size={16} color="#8FF075" />
          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>Carbo<span style={{ color: '#8FF075' }}>Trace</span></span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', margin: 0 }}>
          MRV Protocol v2.4 · Waste-to-Carbon Value Chain Tracker · ISO 14064 Compliant
        </p>
      </footer>
    </div>
  );
}
