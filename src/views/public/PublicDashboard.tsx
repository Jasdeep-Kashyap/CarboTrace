import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, TrendingUp, Award, Building2,
  ChevronRight, Recycle, ShieldCheck, ArrowUpRight,
  Package, Truck, Settings, ShoppingCart, AlertTriangle,
  Globe2, BarChart3, ChevronDown,
  MapPin, Camera, Scale, Bell,
} from 'lucide-react';
import {
  INDIA_STATS, PLAYBOOK, FRICTION, REVENUE_LINES,
} from '@/lib/public-constants';
import { ThemeToggle } from '@/components/ThemeToggle';

// ─── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({
  target, duration = 2000, suffix = '', decimals = 0,
}: { target: number; duration?: number; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(parseFloat((target * ease).toFixed(decimals)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, decimals]);
  return <>{val.toLocaleString('en-IN', { minimumFractionDigits: decimals })}{suffix}</>;
}

// ─── SVG Sparkline (hand-rolled, no deps) ─────────────────────────────────────
function Sparkline({
  data, color = 'var(--accent)', height = 28, width = 80,
}: { data: number[]; color?: string; height?: number; width?: number }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} aria-hidden="true" style={{ overflow: 'visible' }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      {/* Last point dot */}
      <circle
        cx={width}
        cy={parseFloat(pts.split(' ').pop()!.split(',')[1])}
        r="2.5"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}


// ─── Corner-tick card wrapper ──────────────────────────────────────────────────
function ConsoleCard({
  children, style, className = '',
}: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={`card corner-ticks ${className}`}
      style={{ position: 'relative', ...style }}
    >
      {children}
    </div>
  );
}

// ─── Micro-label ──────────────────────────────────────────────────────────────
function MicroLabel({ children, color = 'var(--fg-subtle)' }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="micro-label" style={{ color, marginBottom: '0.25rem' }}>{children}</div>
  );
}

// ─── Live counters data ────────────────────────────────────────────────────────
// Sparkline seeds: 7 data points trending up (last = current value proxy)
const COUNTERS = [
  {
    label: 'Waste Diverted', value: 1843, suffix: ' t', icon: <Recycle size={18} />,
    color: 'var(--accent)', sub: '±12 t · from landfills', tag: 'TELEMETRY',
    spark: [1420, 1510, 1580, 1640, 1710, 1780, 1843],
  },
  {
    label: 'CO₂e Avoided', value: 738, suffix: ' t', icon: <Leaf size={18} />,
    color: 'var(--cyan)', sub: '±0.3 t · IPCC 2019', tag: 'VERIFIED',
    spark: [510, 558, 601, 643, 680, 714, 738],
  },
  {
    label: 'Credits Minted', value: 1247, suffix: '', icon: <Award size={18} />,
    color: 'var(--purple)', sub: 'W2C-verified · ISO 14064', tag: 'MINTED',
    spark: [890, 960, 1040, 1110, 1170, 1210, 1247],
  },
  {
    label: 'Credits Retired', value: 891, suffix: '', icon: <TrendingUp size={18} />,
    color: 'var(--blue)', sub: 'permanently offset', tag: 'RETIRED',
    spark: [620, 680, 730, 780, 830, 862, 891],
  },
  {
    label: 'Orgs Registered', value: 312, suffix: '', icon: <Building2 size={18} />,
    color: 'var(--amber)', sub: 'hotels · markets · factories', tag: 'ONBOARDED',
    spark: [240, 256, 268, 280, 294, 304, 312],
  },
];

// ─── Friction icon map ─────────────────────────────────────────────────────────
const FRICTION_ICONS = [
  <MapPin size={16} />,
  <Recycle size={16} />,
  <Camera size={16} />,
  <Scale size={16} />,
  <Bell size={16} />,
];

// ─── Collapsible Friction card ─────────────────────────────────────────────────
function FrictionCard({ item, idx }: { item: typeof FRICTION[number]; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <ConsoleCard
      style={{ animation: `fade-up 0.42s ${idx * 0.06}s ease-out both` }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
          background: 'none', border: 'none', cursor: 'pointer',
          width: '100%', textAlign: 'left', padding: 0,
        }}
      >
        {/* index badge */}
        <div style={{
          flexShrink: 0, width: 36, height: 36, borderRadius: '8px',
          background: 'var(--surface-2)', border: '1px solid var(--border-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--fg-muted)',
        }}>
          {FRICTION_ICONS[idx]}
        </div>
        <div style={{ flex: 1 }}>
          <div className="micro-label" style={{ color: 'var(--fg-subtle)', marginBottom: '0.2rem' }}>
            {item.label} · #{item.index}
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--fg)', lineHeight: 1.35 }}>
            {item.title}
          </div>
        </div>
        <ChevronDown
          size={15}
          color="var(--fg-subtle)"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginTop: 2 }}
        />
      </button>

      {open && (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {/* Issue */}
          <div style={{
            background: 'var(--red-dim)', border: '1px solid rgba(251,44,54,0.22)',
            borderRadius: '8px', padding: '0.75rem',
          }}>
            <MicroLabel color="var(--red)">⚠ ISSUE</MicroLabel>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
              {item.issue}
            </p>
          </div>
          {/* Solution */}
          <div style={{
            background: 'var(--accent-dim)', border: '1px solid rgba(143,240,117,0.22)',
            borderRadius: '8px', padding: '0.75rem',
          }}>
            <MicroLabel color="var(--accent)">✓ SOLUTION</MicroLabel>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
              {item.solution}
            </p>
          </div>
        </div>
      )}
    </ConsoleCard>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function PublicDashboard() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-sans)' }}>

      {/* ══ NAV ══════════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--nav-bg)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 1.75rem', height: 60, gap: '0.75rem',
      }}>
        {/* Logo → home link */}
        <Link
          to="/"
          aria-label="CarboTrace home"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            flex: 1, textDecoration: 'none',
            borderRadius: '8px', padding: '4px 6px', marginLeft: '-6px',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '9px',
            background: 'linear-gradient(135deg, rgba(143,240,117,0.18), rgba(59,130,246,0.18))',
            border: '1px solid rgba(143,240,117,0.4)',
            boxShadow: '0 0 12px rgba(143,240,117,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={16} color="var(--accent)" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--fg)', letterSpacing: '-0.02em' }}>
            Carbo<span style={{ color: 'var(--accent)' }}>Trace</span>
          </span>
        </Link>

        <Link to="/impact" className="btn btn-ghost btn-sm" id="nav-impact-btn" style={{ color: 'var(--accent)', gap: '0.35rem', flexShrink: 0 }}>
          <ShieldCheck size={13} /> Village Impact
        </Link>
        <Link to="/login" className="btn btn-ghost btn-sm" id="nav-login-btn" style={{ flexShrink: 0 }}>Sign In</Link>
        <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn" style={{ flexShrink: 0 }}>Register Org</Link>
        <ThemeToggle />
      </nav>

      {/* ══ WHY INDIA NEEDS THIS ══════════════════════════════════════════════════ */}
      <section style={{ padding: '2.5rem 2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Globe2 size={15} color="var(--amber)" />
          <MicroLabel color="var(--amber)">THE INDIA OPPORTUNITY · CPCB / SWM RULES 2016</MicroLabel>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
          {INDIA_STATS.map((s, i) => (
            <ConsoleCard
              key={s.label}
              style={{ animation: `fade-up 0.4s ${i * 0.07}s ease-out both`, padding: '1rem', textAlign: 'center' }}
            >
              <div className="mono-num" style={{ fontSize: '2rem', fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: '0.375rem' }}>
                {s.value}
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--fg)', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                {s.label}
              </div>
              <div className="micro-label" style={{ color: 'var(--fg-subtle)', fontSize: '9px' }}>{s.sub}</div>
            </ConsoleCard>
          ))}
        </div>
      </section>

      {/* ══ HERO ═════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '3.5rem 2rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }} className="console-grid">
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg))', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(143,240,117,0.12) 0%, transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.2rem 0.75rem', borderRadius: '999px',
            background: 'var(--accent-dim)', border: '1px solid rgba(143,240,117,0.25)',
            color: 'var(--accent)', fontSize: '10px', fontFamily: 'var(--font-mono)',
            marginBottom: '1.5rem',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-ring 1.8s ease-out infinite', display: 'inline-block', position: 'relative' }} />
            WASTE-TO-CARBON VALUE CHAIN PROTOCOL · HACKOUT '26
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', fontWeight: 800, lineHeight: 1.08, marginBottom: '1.1rem', letterSpacing: '-0.03em' }}>
            <span className="text-gradient">From Agricultural &amp; Urban Waste</span><br />
            <span style={{ color: 'var(--fg)' }}>To Verified Carbon Value</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--fg-muted)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 2rem' }}>
            Connect waste generators, logistics carriers, pyrolyzers, auditors, and ESG buyers. Every handoff is cryptographically verifiable and tamper-proof.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" id="hero-register-btn">
              Register Organisation <ChevronRight size={17} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg" id="hero-login-btn">
              Explore Demo Portals
            </Link>
          </div>
        </div>
      </section>

      {/* ══ LIVE LEDGER ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <MicroLabel color="var(--accent)">PLATFORM TELEMETRY · LAST SYNC &lt;30s</MicroLabel>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
          {COUNTERS.map((c, i) => (
            <ConsoleCard
              key={c.label}
              style={{ animation: `fade-up 0.45s ${i * 0.08}s ease-out both`, padding: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: c.color }}>
                  {c.icon}
                  <MicroLabel color={c.color}>{c.tag}</MicroLabel>
                </div>
                <Sparkline data={c.spark} color={c.color} width={60} height={22} />
              </div>
              <div className="mono-num" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', lineHeight: 1 }} id={`counter-${c.label.replace(/\s/g, '-').toLowerCase()}`}>
                <AnimatedNumber target={c.value} suffix={c.suffix} />
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg)', marginTop: '0.3rem' }}>{c.label}</div>
              <div className="micro-label" style={{ color: 'var(--fg-subtle)', fontSize: '9px', marginTop: '0.2rem' }}>{c.sub}</div>
            </ConsoleCard>
          ))}
        </div>

        {/* Village Pilot methodology banner */}
        <div style={{
          marginTop: '1rem', background: 'var(--accent-dim)',
          border: '1px solid rgba(143,240,117,0.22)', borderRadius: '12px',
          padding: '1rem 1.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                Village Pilot — Methodology-Backed Projection
                <span className="badge badge-green" style={{ fontSize: '9px' }}>IPCC 2019 · US EPA WARM v15</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--fg-muted)', marginTop: '2px' }}>
                ~142 rural households. Formulas: IPCC 2019 CH₄ avoidance factors, US EPA WARM v15 landfill baseline, pond leachate prevention.
              </div>
            </div>
          </div>
          <Link to="/impact" className="btn btn-primary btn-sm" id="counters-view-impact-btn" style={{ gap: '0.35rem' }}>
            Explore Model <ChevronRight size={13} />
          </Link>
        </div>
      </section>



      {/* ══ HOW THE CHAIN WORKS ══════════════════════════════════════════════════ */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fg)', margin: '0.375rem 0 0' }}>How the Waste-to-Carbon Chain Works</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.875rem' }}>
          {PLAYBOOK.map((p, i) => (
            <ConsoleCard key={p.step} style={{ animation: `fade-up 0.45s ${i * 0.07}s ease-out both` }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.625rem' }}>{p.icon}</div>
              <MicroLabel color="var(--accent)">STEP {p.step}</MicroLabel>
              <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--fg)', fontSize: '0.92rem' }}>{p.title}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.6 }}>{p.desc}</div>
            </ConsoleCard>
          ))}
        </div>
      </section>

      {/* ══ FRICTION WE SOLVE ════════════════════════════════════════════════════ */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
          <AlertTriangle size={15} color="var(--amber)" />
          <MicroLabel color="var(--amber)">IMPLEMENTATION CHALLENGES · SOLVED</MicroLabel>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.35rem' }}>
          The 5 Frictions We Eliminate
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginBottom: '1.5rem', maxWidth: 540 }}>
          Real operational problems that collapse waste-logistics programs — and exactly how CarboTrace solves each one.
          <span style={{ display: 'block', marginTop: '0.2rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>
            ↓ Tap any card to expand issue + solution
          </span>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.875rem' }}>
          {FRICTION.map((item, i) => (
            <FrictionCard key={item.index} item={item} idx={i} />
          ))}
        </div>
      </section>

      {/* ══ BUSINESS MODEL ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
          <BarChart3 size={15} color="var(--purple)" />
          <MicroLabel color="var(--purple)">REVENUE MODEL · 4 DIVERSIFIED STREAMS</MicroLabel>
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '1.25rem' }}>
          How CarboTrace Earns
        </h2>

        {/* 4 revenue cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem', marginBottom: '1.125rem' }}>
          {REVENUE_LINES.map((r, i) => (
            <ConsoleCard key={r.label} style={{ animation: `fade-up 0.42s ${i * 0.07}s ease-out both` }}>
              <div className="mono-num" style={{ fontSize: '1.5rem', fontWeight: 900, color: r.color, lineHeight: 1, marginBottom: '0.25rem' }}>{r.rate}</div>
              <MicroLabel color={r.color}>{r.rateLabel}</MicroLabel>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--fg)', margin: '0.5rem 0 0.35rem' }}>{r.label}</div>
              <div style={{ fontSize: '0.79rem', color: 'var(--fg-muted)', lineHeight: 1.55 }}>{r.desc}</div>
            </ConsoleCard>
          ))}
        </div>

        {/* P&L worked example */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(172,75,255,0.10), rgba(143,240,117,0.06))',
          border: '1px solid rgba(172,75,255,0.28)',
          borderRadius: '14px', padding: '1.5rem 1.75rem',
          position: 'relative',
        }} className="corner-ticks">
          <MicroLabel color="var(--purple)">P&amp;L READOUT · WORKED EXAMPLE · PER 100 TONNES MANAGED</MicroLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginTop: '0.875rem' }}>
            {[
              { label: 'Marketplace cut (7%)', value: '₹7,000' },
              { label: 'Logistics margin (10%)', value: '₹4,500' },
              { label: 'Carbon credit share (15%)', value: '₹15,000' },
            ].map((item, i) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {i > 0 && <span style={{ color: 'var(--fg-subtle)', fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>+</span>}
                <div>
                  <div className="mono-num" style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--fg)' }}>{item.value}</div>
                  <div style={{ fontSize: '0.69rem', color: 'var(--fg-subtle)' }}>{item.label}</div>
                </div>
              </div>
            ))}
            {/* equals total */}
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <MicroLabel color="var(--fg-subtle)">= GROSS REVENUE</MicroLabel>
              <div className="mono-num" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>₹26,500</div>
              <div style={{ fontSize: '0.69rem', color: 'var(--fg-subtle)' }}>per 100 tonnes diverted</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PORTAL ACCESS ════════════════════════════════════════════════════════ */}
      <section style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <MicroLabel color="var(--fg-subtle)">UNIVERSAL PORTAL ACCESS · 1-CLICK WORKFLOWS</MicroLabel>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--fg)', margin: '0.375rem 0 0' }}>
            Explore All 6 Connected Stakeholder Portals
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1rem' }}>
          {[
            { path: '/generator', icon: <Package size={20} color="var(--accent)" />, color: 'var(--accent)', title: 'Waste Generator Portal', desc: 'Log pickups, scan bin QR codes, upload overhead photos, track bin status.', badge: 'SOURCE PRODUCER' },
            { path: '/driver', icon: <Truck size={20} color="var(--blue)" />, color: 'var(--blue)', title: 'Logistics Driver PWA', desc: 'Route navigation, 50 m geofence detection, weighbridge logging & SMS receipts.', badge: 'LOGISTICS FLEET' },
            { path: '/recycler', icon: <Recycle size={20} color="var(--cyan)" />, color: 'var(--cyan)', title: 'Recycler Kiln Facility', desc: 'Claim batches, monitor pyrolysis & digestion, upload certified lab tests.', badge: 'THERMAL / BIO' },
            { path: '/checker', icon: <ShieldCheck size={20} color="var(--purple)" />, color: 'var(--purple)', title: 'ISO Checker & Auditor', desc: 'Review tamper-evident checklists, inspect weighbridge tickets, mint W2C credits.', badge: 'MRV COMPLIANCE' },
            { path: '/marketplace', icon: <ShoppingCart size={20} color="var(--amber)" />, color: 'var(--amber)', title: 'Carbon Credit Marketplace', desc: 'Filter verified vintage credits, checkout with INR/USD, retire for ESG certs.', badge: 'CORPORATE BUYERS' },
            { path: '/admin', icon: <Settings size={20} color="var(--red)" />, color: 'var(--red)', title: 'Protocol Governance', desc: 'Manage orgs, arbitrate weighbridge disputes, inspect immutable audit logs.', badge: 'PROTOCOL ADMIN' },
          ].map(p => (
            <Link
              key={p.path} to={p.path}
              className="card card-hover corner-ticks"
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem', position: 'relative' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: `color-mix(in srgb, ${p.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid color-mix(in srgb, ${p.color} 30%, transparent)` }}>
                    {p.icon}
                  </div>
                  <span className="micro-label badge" style={{ background: 'var(--surface-2)', color: p.color, border: `1px solid var(--border-md)`, fontSize: '9px' }}>
                    {p.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--fg)', margin: '0 0 0.35rem' }}>{p.title}</h3>
                <p style={{ fontSize: '0.79rem', color: 'var(--fg-muted)', lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: p.color, fontWeight: 700, marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>
                LAUNCH <ArrowUpRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '4rem 2rem 5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.875rem' }}>🌱</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.625rem', color: 'var(--fg)' }}>
            Ready to monetize waste into verified carbon credits?
          </h2>
          <p style={{ color: 'var(--fg-muted)', marginBottom: '1.5rem', lineHeight: 1.65 }}>
            Join 312+ organisations already tracking their circular waste lifecycle and earning carbon credits on CarboTrace.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn" style={{ justifyContent: 'center' }}>
            Register Your Organisation <ChevronRight size={17} />
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════════ */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.75rem 2rem 2.25rem',
        background: 'var(--surface-0)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
            <Leaf size={14} color="var(--accent)" />
            <span style={{ fontWeight: 700, color: 'var(--fg)', fontSize: '0.9rem' }}>
              Carbo<span style={{ color: 'var(--accent)' }}>Trace</span>
            </span>
          </div>
          {/* Tech stack */}
          <p style={{ fontSize: '0.73rem', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>
            Built with{' '}
            <a href="https://react.dev" target="_blank" rel="noreferrer" style={{ color: '#61DAFB', textDecoration: 'none' }}>React</a>
            {' + '}
            <a href="https://typescriptlang.org" target="_blank" rel="noreferrer" style={{ color: '#3178C6', textDecoration: 'none' }}>TypeScript</a>
            {' · '}
            <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" style={{ color: '#38BDF8', textDecoration: 'none' }}>Tailwind CSS</a>
            {' + '}
            <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer" style={{ color: 'var(--fg)', textDecoration: 'none' }}>shadcn/ui</a>
            {' · '}
            <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#3ECF8E', textDecoration: 'none' }}>Supabase</a>
            {' (PostgreSQL + PostGIS, Auth, Storage)'}
            {' · '}
            <a href="https://github.com/Jasdeep-Kashyap" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>GitHub ↗</a>
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', margin: 0 }}>
            ISO 14064 · Waste-to-Carbon Value Chain Tracker · HACKOUT '26
          </p>
        </div>
      </footer>
    </div>
  );
}
