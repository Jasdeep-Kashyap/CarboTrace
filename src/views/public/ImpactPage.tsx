import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, Award, Recycle, Zap, ShieldCheck, ArrowLeft, ExternalLink,
  Info, CheckCircle2, ChevronRight, FileText, Droplets, Flame,
  Building, Truck, Sparkles, Sliders, Printer, Share2, Layers, BookOpen, AlertCircle
} from 'lucide-react';
import {
  PLATFORM_IMPACT_DATA,
  SOURCE_CITATIONS,
  WASTE_STREAM_BREAKDOWN,
  PROCESSING_METHODS_IMPACT,
  REGIONAL_IMPACTS,
  computeEquivalencies,
  type TimeframeScope,
  type SourceCitation,
} from '@/lib/impact-data';
import { estimateCO2e, WASTE_TYPE_LABELS } from '@/lib/utils';

// ─── Animated Number Counter ──────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1600, suffix = '', decimals = 0 }: {
  target: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(target * ease);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  const display = decimals > 0
    ? val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(val).toLocaleString('en-IN');

  return <>{display}{suffix}</>;
}

export default function ImpactPage() {
  const [scope, setScope] = useState<TimeframeScope>('all');
  const [activeCitation, setActiveCitation] = useState<SourceCitation | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Simulator State (calibrated for village scale)
  const [simWasteType, setSimWasteType] = useState('food_wet');
  const [simWeightTons, setSimWeightTons] = useState(2.5);

  const scopeData = PLATFORM_IMPACT_DATA[scope];
  const equivalencies = computeEquivalencies(scopeData.totalCO2eAvoidedKg);

  // Computed for simulator
  const simCo2eAvoidedKg = estimateCO2e(simWasteType, simWeightTons * 1000);
  const simMethaneKg = Math.round(simWeightTons * 1000 * 0.0143);
  const simLeachateLitres = Math.round(simWeightTons * 250);
  const simCreditsProjected = Math.floor(simCo2eAvoidedKg / 1000);

  function handleCopyShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D10', color: '#E2E8F0', fontFamily: 'var(--font-sans)' }}>

      {/* ── Top Navigation Bar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(11, 13, 16, 0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: 64, gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-mono"
            id="impact-back-home-btn"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>

          <div style={{ height: 18, width: 1, background: 'rgba(255,255,255,0.1)' }} />

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(143, 240, 117, 0.25), rgba(59, 130, 246, 0.25))',
              border: '1px solid rgba(143, 240, 117, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Leaf size={16} color="#8FF075" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Carbo<span style={{ color: '#8FF075' }}>Trace</span>
            </span>
            <span style={{
              fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '1px 5px',
              borderRadius: '4px', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)'
            }}>VILLAGE PILOT</span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => window.print()}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12151A] hover:bg-[#161A20] border border-white/10 text-xs text-white/80 transition-colors"
            title="Print or Export Impact Dossier"
          >
            <Printer size={14} />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={handleCopyShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12151A] hover:bg-[#161A20] border border-white/10 text-xs text-white/80 transition-colors"
          >
            <Share2 size={14} />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <Link to="/marketplace" className="btn btn-primary btn-sm">
            View Marketplace
          </Link>
        </div>
      </nav>

      {/* ── Hero Header ── */}
      <header style={{
        padding: '3.5rem 2rem 2.5rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ position: 'absolute', top: '-20%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(143, 240, 117, 0.12) 0%, transparent 60%)', filter: 'blur(90px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', right: '15%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 210, 239, 0.10) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 880, margin: '0 auto', position: 'relative' }}>

          {/* ── Prominent Mock Data & Village Pilot Notice ── */}
          <div style={{
            background: 'rgba(249, 156, 0, 0.08)',
            border: '1px solid rgba(249, 156, 0, 0.3)',
            borderRadius: '12px', padding: '0.875rem 1.25rem',
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            marginBottom: '1.75rem', textAlign: 'left',
          }}>
            <AlertCircle size={20} color="#F99C00" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#F99C00', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                DEMO / SIMULATION NOTICE: ILLUSTRATIVE MOCK NUMBERS
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5, marginTop: '2px' }}>
                The metrics displayed on this page are <strong>mock illustrative numbers</strong> calibrated for a small rural village pilot model (~142 farming households and dairy co-op). <strong>They are not actual field measurements</strong>. The underlying carbon calculation formulas and citations (IPCC 2019 Refinement, US EPA WARM v16, ISO 14064-2, and CPCB) are authentic scientific standards.
              </div>
            </div>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
            padding: '0.35rem 1rem', borderRadius: '999px',
            background: 'rgba(143, 240, 117, 0.08)', border: '1px solid rgba(143, 240, 117, 0.25)',
            color: '#8FF075', fontSize: '11px', fontFamily: 'var(--font-mono)',
            marginBottom: '1.25rem',
          }}>
            <ShieldCheck size={14} />
            RURAL VILLAGE PILOT IMPACT · SCIENTIFIC METHODOLOGY SOURCES
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            <span className="text-gradient">Village-Scale Ecological & Community Impact</span><br />
            <span style={{ color: '#FFFFFF' }}>Simulated with Verified Empirical Methodologies</span>
          </h1>

          <p style={{ fontSize: '1.02rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.7, maxWidth: 680, margin: '0 auto 2rem' }}>
            Simulating how a rural village cluster converts crop stubble, kitchen scraps, and cow dung into biochar soil sinks and clean biogas. Every metric formula is rooted in standardized models: <strong>IPCC 2019 Vol 5</strong>, <strong>US EPA WARM v16</strong>, <strong>ISO 14064-2</strong>, and <strong>CPCB 2024</strong>.
          </p>

          {/* Timeframe Scope Switcher */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', padding: '0.25rem',
            background: '#12151A', border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px', gap: '0.25rem',
          }}>
            {[
              { key: 'all', label: 'All-Time Cumulative (Mock)' },
              { key: 'fy26', label: 'FY 2025–26 YTD (Mock)' },
              { key: '90d', label: 'Last 90 Days (Mock)' },
            ].map(tab => {
              const active = scope === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setScope(tab.key as TimeframeScope)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '12px',
                    fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: active ? '#8FF075' : 'transparent',
                    color: active ? '#0B0D10' : 'rgba(255, 255, 255, 0.7)',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.45)' }}>
            {scopeData.periodDescription}
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* ── Section 1: Executive KPI Grid with Source Drawer Triggers ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Village Pilot Simulated Achievements
                </h2>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: '4px', background: 'rgba(249, 156, 0, 0.15)', color: '#F99C00', border: '1px solid rgba(249, 156, 0, 0.3)' }}>
                  MOCK DATA
                </span>
              </div>
              <p style={{ margin: '0.25rem 0 0', color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                Demonstration values for rural village clusters. Click "Source & Method" on any tile to inspect authentic IPCC / ISO formulas.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#12151A] border border-white/8 text-[11px] font-mono text-white/70">
              <span className="w-2 h-2 rounded-full bg-[#8FF075] animate-pulse" />
              <span>{scopeData.verifiedPickupsCount.toLocaleString()} MOCK WEIGHBRIDGE LOGS</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {scopeData.metrics.map(metric => {
              const citation = SOURCE_CITATIONS[metric.citationId];
              return (
                <div
                  key={metric.id}
                  className="card card-hover"
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    padding: '1.5rem', borderRadius: '16px', position: 'relative', overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, right: 0, width: 90, height: 90,
                    background: `radial-gradient(circle, ${metric.color}15 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }} />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{
                        fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600,
                        padding: '2px 8px', borderRadius: '6px',
                        background: `${metric.color}15`, color: metric.color,
                        border: `1px solid ${metric.color}30`
                      }}>
                        {metric.badge}
                      </span>
                      <span style={{ fontSize: '11px', color: '#8FF075', fontFamily: 'var(--font-mono)' }}>
                        {metric.delta}
                      </span>
                    </div>

                    <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                      {metric.formattedDisplay}
                    </div>

                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.35rem' }}>
                      {metric.title}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5, margin: '0.65rem 0 1rem' }}>
                      {metric.description}
                    </p>
                  </div>

                  <div style={{
                    paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>
                      Source: {citation?.shortName ?? 'Verified MRV'}
                    </span>
                    <button
                      onClick={() => setActiveCitation(citation)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px', padding: '3px 8px', color: '#8FF075', fontSize: '11px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                        fontFamily: 'var(--font-mono)'
                      }}
                      title="Inspect Citation & Formula"
                    >
                      <Info size={12} /> Source & Method
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Real-World Societal & Environmental Equivalencies ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="glass-accent" style={{ borderRadius: '20px', padding: '2.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: '-10%', right: '-5%', width: 350, height: 350,
              background: 'radial-gradient(circle, rgba(143, 240, 117, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8FF075', fontSize: '11px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  <Sparkles size={14} /> Tangible Real-World Equivalence
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#FFFFFF', margin: '0.25rem 0 0' }}>
                  What {scopeData.totalCO2eAvoidedKg >= 1000 ? `${(scopeData.totalCO2eAvoidedKg / 1000).toFixed(1)} tCO₂e` : `${scopeData.totalCO2eAvoidedKg} kg CO₂e`} Avoided Actually Means
                </h3>
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.5)' }}>
                Factor Model: US EPA Greenhouse Gas Equivalencies (2024)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {equivalencies.map((eq, i) => (
                <div
                  key={eq.label}
                  style={{
                    background: '#12151A', border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px', padding: '1.15rem', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{eq.icon}</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#8FF075', fontFamily: 'var(--font-mono)', lineHeight: 1.2 }}>
                      {eq.formatted}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.35rem' }}>
                      {eq.label}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: '0.75rem', fontFamily: 'var(--font-mono)', borderTop: '1px dashed rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem' }}>
                    {eq.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: The Verified Value Chain Protocol (How We Guarantee Impact) ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF' }}>
              How CarboTrace Guarantees Zero-Drift MRV
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', maxWidth: 620, margin: '0.35rem auto 0' }}>
              From bin scan to carbon credit issuance, every metric is bound to cryptographically verifiable physical proof.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              {
                step: '01',
                title: 'Photo Verification & Segregation',
                desc: 'Overhead camera scan validates purity. Contamination (<3% inert threshold) flags rejection before collection.',
                icon: <Leaf size={22} color="#8FF075" />,
                auditProof: 'Computer Vision + Timestamped EXIF',
              },
              {
                step: '02',
                title: '50m Driver Geofencing & Weighbridge',
                desc: 'Logistics routes trigger automatic arrival only within 50m radius of registered bin GPS. Real calibrated scales log gross weight.',
                icon: <Truck size={22} color="#3B82F6" />,
                auditProof: 'PostGIS ST_DWithin + SMS SMS-Receipt',
              },
              {
                step: '03',
                title: 'Pyrolysis & Bio-methanation',
                desc: 'Waste is converted under controlled thermal or enzymatic cycles. Energy input and biochar/gas yields are metered continuously.',
                icon: <Flame size={22} color="#00D2EF" />,
                auditProof: 'Lab GC-MS Test + Recycler Logs',
              },
              {
                step: '04',
                title: 'Independent Auditor Minting',
                desc: 'Auditor approves complete chain of custody before minting W2C-YYYY-NNNNNN credits with indelible serial numbers.',
                icon: <ShieldCheck size={22} color="#AC4BFF" />,
                auditProof: 'ISO 14064-2 Compliance Signature',
              },
            ].map(item => (
              <div key={item.step} className="card" style={{ padding: '1.5rem', borderRadius: '14px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#8FF075', fontWeight: 700 }}>
                    STAGE {item.step}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.55, marginBottom: '1rem' }}>
                  {item.desc}
                </p>
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#8FF075', background: 'rgba(143, 240, 117, 0.08)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(143, 240, 117, 0.2)' }}>
                  ✓ {item.auditProof}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Deep-Dive Impact Dimensions (Streams & Methodologies) ── */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>

          {/* Waste Stream Partitioning */}
          <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Recycle size={18} color="#8FF075" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Diversion by Waste Stream Classification
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)', marginBottom: '1.25rem' }}>
              Standardised under CPCB Municipal Solid Waste Categories
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {WASTE_STREAM_BREAKDOWN.map(item => (
                <div key={item.type} style={{ background: '#12151A', padding: '0.875rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#FFFFFF' }}>{item.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>{item.sharePercent}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div style={{ width: `${item.sharePercent}%`, height: '100%', background: item.color, borderRadius: '3px' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)' }}>
                    <span>{(item.divertedKg / 1000).toFixed(1)} t diverted</span>
                    <span>{(item.co2eAvoidedKg / 1000).toFixed(1)} tCO₂e avoided</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#8FF075', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                    ↳ Destination: {item.primaryDestination}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Methodologies Comparison */}
          <div className="card" style={{ padding: '1.75rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Layers size={18} color="#00D2EF" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Processing Technology & Carbon Permanence
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)', marginBottom: '1.25rem' }}>
              Governed by Puro.earth, EBC and EPA WARM Standard Guidelines
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {PROCESSING_METHODS_IMPACT.map(method => {
                const citation = SOURCE_CITATIONS[method.citationId];
                return (
                  <div key={method.key} style={{ background: '#12151A', padding: '0.875rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>{method.name}</span>
                      <span style={{ fontSize: '11px', color: '#00D2EF', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{method.divertedTons} t treated</span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', margin: '0.35rem 0' }}>
                      <strong>Product:</strong> {method.yieldProduct} ({method.yieldOutput})
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.5)' }}>
                      <div>Factor: <span style={{ color: '#8FF075' }}>{method.co2eRemovalFactor}</span></div>
                      <div>Permanence: <span style={{ color: '#E2E8F0' }}>{method.carbonSinkPermanence}</span></div>
                    </div>

                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setActiveCitation(citation)}
                        style={{
                          background: 'none', border: 'none', color: '#00D2EF', fontSize: '10px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px',
                          fontFamily: 'var(--font-mono)', padding: 0
                        }}
                      >
                        Ref: {citation?.shortName} →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Section 5: Regional Footprint (Landfills Alleviated) ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <Building size={20} color="#F99C00" />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Regional Hubs & Dumpsite Relief
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)', margin: 0 }}>
                Empirical landfill diversion and leachate mitigation in major metropolitan clusters
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {REGIONAL_IMPACTS.map(reg => (
              <div key={reg.region} className="card card-hover" style={{ padding: '1.25rem', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#F99C00', fontWeight: 700 }}>
                    {reg.state.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '11px', color: '#8FF075', fontFamily: 'var(--font-mono)' }}>
                    {reg.partnerOrgs} Orgs
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {reg.region}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                  <div>
                    Waste Diverted: <strong style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{reg.wasteDivertedTons} t</strong>
                  </div>
                  <div>
                    CO₂e Avoided: <strong style={{ color: '#8FF075', fontFamily: 'var(--font-mono)' }}>{reg.co2eAvoidedTons} tCO₂e</strong>
                  </div>
                  <div>
                    Leachate Prevented: <strong style={{ color: '#00D2EF', fontFamily: 'var(--font-mono)' }}>{reg.leachatePreventedLitres.toLocaleString()} L</strong>
                  </div>
                </div>

                <div style={{
                  marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)'
                }}>
                  Relieving: <span style={{ color: '#FFFFFF' }}>{reg.alleviatedLandfill}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 6: Interactive Partner Impact Simulator ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="glass-accent" style={{ borderRadius: '20px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
              <Sliders size={20} color="#8FF075" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                Interactive Village Difference Calculator (Simulator)
              </h2>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.88rem', margin: '0 0 2rem' }}>
              Simulate the verified monthly environmental difference and carbon credit yield your village, school, farming cluster, or Gram Panchayat would achieve (mock simulation based on real IPCC factors).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              {/* Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Waste Feedstock Type</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>IPCC Vol 5 Table 5.2</span>
                  </label>
                  <select
                    className="input-base"
                    value={simWasteType}
                    onChange={e => setSimWasteType(e.target.value)}
                    id="sim-waste-type"
                  >
                    {Object.entries(WASTE_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{String(v)}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Monthly Village / Farm Output: <strong style={{ color: '#8FF075', fontFamily: 'var(--font-mono)' }}>{simWeightTons} Metric Tons</strong></span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{(simWeightTons * 1000).toLocaleString()} kg</span>
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={simWeightTons}
                    onChange={e => setSimWeightTons(Number(e.target.value))}
                    id="sim-weight-slider"
                    style={{ width: '100%', accentColor: '#8FF075' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)' }}>
                    <span>0.1 t (100 kg - Small Farm)</span>
                    <span>10 t (10,000 kg - Full Village Ward)</span>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', background: '#12151A', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  ⚠️ <em>Note: Simulated output. Mathematical factors are derived from US EPA WARM v16 & IPCC 2019 standards for tropical rural waste management.</em>
                </div>
              </div>

              {/* Output Readout */}
              <div style={{ background: '#0F1217', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Projected Net Avoided Emissions
                  </div>
                  <div className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1.15 }}>
                    {(simCo2eAvoidedKg / 1000).toFixed(2)} <span style={{ fontSize: '1.4rem' }}>tCO₂e / mo</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ background: '#161A20', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>Methane Prevented</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F99C00', fontFamily: 'var(--font-mono)' }}>
                      {simMethaneKg.toLocaleString()} kg CH₄
                    </div>
                  </div>

                  <div style={{ background: '#161A20', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>Leachate Intercepted</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00D2EF', fontFamily: 'var(--font-mono)' }}>
                      {simLeachateLitres.toLocaleString()} L
                    </div>
                  </div>

                  <div style={{ background: '#161A20', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>Cars Displaced</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#8FF075', fontFamily: 'var(--font-mono)' }}>
                      {Math.round(simCo2eAvoidedKg / 0.21 / 1000).toLocaleString()}k km
                    </div>
                  </div>

                  <div style={{ background: '#161A20', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>W2C Credits Minted</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#AC4BFF', fontFamily: 'var(--font-mono)' }}>
                      {simCreditsProjected} Credits / mo
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                  <Link to="/register" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Enroll Your Organization to Start Earning <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 7: Comprehensive Methodologies & Citation Bibliography Table ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
            <BookOpen size={20} color="#8FF075" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Methodology & Standards Bibliography
            </h2>
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', margin: '0 0 1.5rem' }}>
            Official regulatory, academic, and empirical standards used across CarboTrace MRV protocols.
          </p>

          <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left', background: '#0F1217' }}>
              <thead>
                <tr style={{ background: '#161A20', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '0.85rem 1rem', color: '#FFFFFF', fontWeight: 700 }}>Standard / Framework</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#FFFFFF', fontWeight: 700 }}>Issuing Body</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#FFFFFF', fontWeight: 700 }}>Governing Formula / Baseline</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#FFFFFF', fontWeight: 700 }}>Verification Mechanism</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#FFFFFF', fontWeight: 700, textAlign: 'right' }}>Official Ref</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(SOURCE_CITATIONS).map(citation => (
                  <tr key={citation.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{citation.shortName}</div>
                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#8FF075', marginTop: '2px' }}>
                        {citation.standardCode} ({citation.year})
                      </div>
                    </td>
                    <td style={{ padding: '1rem', verticalAlign: 'top', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {citation.issuingBody}
                    </td>
                    <td style={{ padding: '1rem', verticalAlign: 'top', maxWidth: 300 }}>
                      <code style={{ fontSize: '11px', color: '#00D2EF', background: 'rgba(0, 210, 239, 0.08)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px' }}>
                        {citation.formula}
                      </code>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.4 }}>
                        {citation.methodologySummary}
                      </p>
                    </td>
                    <td style={{ padding: '1rem', verticalAlign: 'top', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      {citation.verificationMethod}
                    </td>
                    <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'right' }}>
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          color: '#8FF075', textDecoration: 'none', fontSize: '11px',
                          fontFamily: 'var(--font-mono)', background: 'rgba(143, 240, 117, 0.08)',
                          padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(143, 240, 117, 0.2)'
                        }}
                      >
                        Docs <ExternalLink size={11} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Call to Action Banner ── */}
        <section style={{
          borderRadius: '20px', padding: '3.5rem 2rem', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(143, 240, 117, 0.12), rgba(59, 130, 246, 0.12))',
          border: '1px solid rgba(143, 240, 117, 0.3)', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ maxWidth: 580, margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
              Turn Organic Waste into Verified Value
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Whether you are a hotel generating 500 kg daily, an APMC market handling tons of organic surplus, or an ESG carbon buyer looking for high-permanence biochar removals — our protocol guarantees complete auditability.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg shadow-lg shadow-[#8FF075]/25">
                Register Your Organisation <ChevronRight size={18} />
              </Link>
              <Link to="/marketplace" className="btn btn-ghost btn-lg">
                Explore Marketplace Credits
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Source Citation Modal ── */}
      {activeCitation && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setActiveCitation(null)}
        >
          <div
            style={{
              background: '#12151A', border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px', maxWidth: 600, width: '100%',
              padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{
                fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700,
                color: '#8FF075', background: 'rgba(143, 240, 117, 0.1)',
                padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(143, 240, 117, 0.25)'
              }}>
                {activeCitation.standardCode} ({activeCitation.year})
              </span>
              <button
                onClick={() => setActiveCitation(null)}
                style={{
                  background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer', fontSize: '18px', padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>
              {activeCitation.fullName}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#00D2EF', fontFamily: 'var(--font-mono)', marginBottom: '1.25rem' }}>
              Issuing Body: {activeCitation.issuingBody}
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>
                Mathematical Formula / Baseline
              </div>
              <pre style={{
                background: '#0B0D10', border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.75rem', borderRadius: '8px', color: '#8FF075', fontSize: '11px',
                fontFamily: 'var(--font-mono)', overflowX: 'auto'
              }}>
                {activeCitation.formula}
              </pre>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>
                Methodology Summary
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: 0 }}>
                {activeCitation.methodologySummary}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>
                Verification Protocol
              </div>
              <p style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6, margin: 0 }}>
                {activeCitation.verificationMethod}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a
                href={activeCitation.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ gap: '6px' }}
              >
                Official Publication <ExternalLink size={14} />
              </a>
              <button
                onClick={() => setActiveCitation(null)}
                className="btn btn-primary btn-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '2rem', textAlign: 'center', background: '#0B0D10' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Leaf size={16} color="#8FF075" />
          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>Carbo<span style={{ color: '#8FF075' }}>Trace</span></span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', margin: 0 }}>
          MRV Protocol v2.4 · ISO 14064-2 Compliant · Verified Waste-to-Carbon Value Chain Protocol
        </p>
      </footer>

    </div>
  );
}
