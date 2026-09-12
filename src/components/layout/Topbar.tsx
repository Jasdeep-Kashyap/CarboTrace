import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, ChevronDown, Check, Package, Truck, Recycle, ShieldCheck, ShoppingCart, Settings, Database, ExternalLink, X, Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/utils';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { UserRole } from '@/types/database';

interface TopbarProps { onMenuClick: () => void; }

const ROLES_LIST: { role: UserRole; label: string; path: string; icon: React.ReactNode; color: string }[] = [
  { role: 'generator', label: 'Generator (Waste Source)', path: '/generator', icon: <Package size={14} />, color: 'text-[#8FF075]' },
  { role: 'driver',    label: 'Logistics / Driver',       path: '/driver',    icon: <Truck size={14} />,    color: 'text-blue-400' },
  { role: 'recycler',  label: 'Recycler (Pyrolysis Facility)', path: '/recycler', icon: <Recycle size={14} />, color: 'text-cyan-400' },
  { role: 'checker',   label: 'Checker (ISO Auditor Desk)',    path: '/checker',  icon: <ShieldCheck size={14} />, color: 'text-purple-400' },
  { role: 'buyer',     label: 'Buyer (ESG Portfolio)',         path: '/buyer',    icon: <ShoppingCart size={14} />, color: 'text-amber-400' },
  { role: 'admin',     label: 'Protocol Governance / Admin',   path: '/admin',    icon: <Settings size={14} />, color: 'text-red-400' },
];

export function Topbar({ onMenuClick }: TopbarProps) {
  const { profile, login } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const role = profile?.role ?? 'generator';
  const color = ROLE_COLORS[role];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSwitchRole(newRole: UserRole, path: string) {
    login(newRole);
    setDropdownOpen(false);
    navigate(path);
  }

  return (
    <header className="topbar" style={{ position: 'relative' }}>
      <button
        id="topbar-menu-btn"
        onClick={onMenuClick}
        style={{
          background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.6)',
          cursor: 'pointer', padding: '0.25rem', borderRadius: '6px',
          display: 'none',
        }}
      >
        <Menu size={20} />
      </button>

      {/* Clickable Brand Logo -> Home / */}
      <Link
        to="/"
        id="topbar-logo-home"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          padding: '0.25rem 0.5rem',
          borderRadius: '8px',
          transition: 'opacity 0.2s',
        }}
        title="Go to CarboTrace Home Page"
      >
        <div style={{
          width: 28, height: 28, borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(143, 240, 117, 0.2), rgba(59, 130, 246, 0.2))',
          border: '1px solid rgba(143, 240, 117, 0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Leaf size={15} color="#8FF075" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Carbo<span style={{ color: '#8FF075' }}>Trace</span>
        </span>
      </Link>

      {/* Sync pill */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#12151A] border border-white/8 text-[11px] font-mono">
        <span className="w-2 h-2 rounded-full bg-[#8FF075] animate-pulse shadow-[0_0_8px_#8FF075]" />
        <span className="text-white/60">LEDGER SYNCED</span>
      </div>

      {/* Supabase status pill */}
      <button
        type="button"
        onClick={() => setDbModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#12151A] hover:bg-[#161A20] border border-white/8 text-[11px] font-mono cursor-pointer transition-colors"
        title="Supabase Database Status"
      >
        <Database size={12} color={isSupabaseConfigured ? '#8FF075' : '#F99C00'} />
        <span className={isSupabaseConfigured ? 'text-[#8FF075] font-semibold' : 'text-white/70'}>
          {isSupabaseConfigured ? 'SUPABASE LIVE' : 'SUPABASE READY (LOCAL DEMO)'}
        </span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
        {/* Role Badge (Static for non-admin, Administrative Switcher for Admin only) */}
        {role === 'admin' ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12151A] hover:bg-[#161A20] border border-red-500/30 text-xs text-white transition-all shadow-sm cursor-pointer"
              title="Admin: Audit Role Switcher"
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase font-mono text-red-400/80 leading-none">Admin Authority</span>
                <span className="font-semibold text-white capitalize leading-tight">Switch Persona</span>
              </div>
              <ChevronDown size={14} className="text-white/50" />
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: '260px', borderRadius: '14px',
                  background: '#12151A', border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 20px 30px rgba(0, 0, 0, 0.6)',
                  padding: '0.5rem', zIndex: 60,
                }}
              >
                <div style={{ padding: '0.375rem 0.5rem 0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '0.375rem' }}>
                  <p style={{ margin: 0, fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#FB2C36', textTransform: 'uppercase', fontWeight: 600 }}>
                    Admin Persona Delegation
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Authorized supervisory inspection
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {ROLES_LIST.map(r => {
                    const isActive = r.role === role;
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => handleSwitchRole(r.role, r.path)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.45rem 0.625rem', borderRadius: '8px',
                          fontSize: '12px', border: 'none', cursor: 'pointer',
                          textAlign: 'left', width: '100%',
                          background: isActive ? 'rgba(143, 240, 117, 0.12)' : 'transparent',
                          color: isActive ? '#8FF075' : 'rgba(255, 255, 255, 0.8)',
                          fontWeight: isActive ? 600 : 400,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={r.color}>{r.icon}</span>
                          <span>{r.label}</span>
                        </div>
                        {isActive && <Check size={14} color="#8FF075" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12151A] border border-white/10 text-xs text-white">
            <span className="w-2 h-2 rounded-full bg-[#8FF075]" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-mono text-white/40 leading-none">Role</span>
              <span className="font-semibold text-white capitalize leading-tight">{ROLE_LABELS[role]}</span>
            </div>
          </div>
        )}

        {/* Notifications bell */}
        <button
          id="topbar-notifications-btn"
          style={{
            background: '#12151A', border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer',
            padding: '0.45rem', borderRadius: '10px',
            position: 'relative', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseOver={e => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = 'rgba(143, 240, 117, 0.3)'; }}
          onMouseOut={e => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
        >
          <Bell size={17} />
          <span style={{
            position: 'absolute', top: '5px', right: '5px',
            width: '6px', height: '6px', background: '#8FF075',
            borderRadius: '50%', boxShadow: '0 0 6px #8FF075',
          }} />
        </button>

        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(143, 240, 117, 0.2), rgba(59, 130, 246, 0.3))',
          border: '1px solid rgba(143, 240, 117, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.82rem', fontWeight: 700, color: '#8FF075', cursor: 'pointer',
          flexShrink: 0, fontFamily: 'var(--font-mono)',
        }}>
          {profile?.full_name?.charAt(0) ?? 'U'}
        </div>
      </div>

      {/* Supabase Connection Details Modal */}
      {dbModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setDbModalOpen(false)}
        >
          <div
            style={{
              background: '#12151A', border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px', maxWidth: 540, width: '100%',
              padding: '1.75rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} color={isSupabaseConfigured ? '#8FF075' : '#F99C00'} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Supabase Database Integration
                </h3>
              </div>
              <button
                onClick={() => setDbModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: isSupabaseConfigured ? 'rgba(143, 240, 117, 0.08)' : 'rgba(249, 156, 0, 0.08)',
              border: `1px solid ${isSupabaseConfigured ? 'rgba(143, 240, 117, 0.25)' : 'rgba(249, 156, 0, 0.25)'}`,
              borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: isSupabaseConfigured ? '#8FF075' : '#F99C00', textTransform: 'uppercase' }}>
                {isSupabaseConfigured ? 'Status: Connected to Supabase Live Project' : 'Status: Resilient Local Demo Mode Active'}
              </div>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                {isSupabaseConfigured
                  ? 'Your application is querying and synchronizing with live PostgreSQL tables and realtime change streams.'
                  : 'Operating in self-contained offline demo mode with instant data. All 6 dashboards (Generator, Driver, Recycler, Checker, Buyer, Admin) are fully functional.'}
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>
                To Connect Your Live Supabase Project:
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6 }}>
                <li>
                  Open your <code style={{ color: '#8FF075' }}>.env</code> file in the project root.
                </li>
                <li>
                  Provide your Supabase URL and Anon Key:
                  <pre style={{ background: '#0B0D10', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '10px', color: '#00D2EF', margin: '4px 0' }}>
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
                  </pre>
                </li>
                <li>
                  Run the SQL migration script located at:
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8FF075', marginTop: '2px' }}>
                    supabase/migrations/20260912_initial_schema.sql
                  </div>
                </li>
              </ol>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ gap: '6px' }}
              >
                Supabase Dashboard <ExternalLink size={14} />
              </a>
              <button
                onClick={() => setDbModalOpen(false)}
                className="btn btn-primary btn-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
