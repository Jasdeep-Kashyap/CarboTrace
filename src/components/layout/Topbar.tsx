import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, ChevronDown, Check, Package, Truck, Recycle, ShieldCheck, ShoppingCart, Settings, Database, ExternalLink, X, Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/utils';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { UserRole } from '@/types/database';
import { ThemeToggle } from '@/components/ThemeToggle';

interface TopbarProps { onMenuClick: () => void; }

const ROLES_LIST: { role: UserRole; label: string; path: string; icon: React.ReactNode; color: string }[] = [
  { role: 'generator', label: 'Generator (Waste Source)', path: '/generator', icon: <Package size={14} />, color: 'text-[var(--accent)]' },
  { role: 'driver', label: 'Logistics / Driver', path: '/driver', icon: <Truck size={14} />, color: 'text-[var(--blue)]' },
  { role: 'recycler', label: 'Recycler (Pyrolysis Facility)', path: '/recycler', icon: <Recycle size={14} />, color: 'text-[var(--cyan)]' },
  { role: 'checker', label: 'Checker (ISO Auditor Desk)', path: '/checker', icon: <ShieldCheck size={14} />, color: 'text-[var(--purple)]' },
  { role: 'buyer', label: 'Buyer (ESG Portfolio)', path: '/buyer', icon: <ShoppingCart size={14} />, color: 'text-[var(--amber)]' },
  { role: 'admin', label: 'Protocol Governance / Admin', path: '/admin', icon: <Settings size={14} />, color: 'text-[var(--red)]' },
];

export function Topbar({ onMenuClick }: TopbarProps) {
  const { profile, login } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const role = profile?.role ?? 'generator';

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
          background: 'transparent', border: 'none', color: 'var(--fg-muted)',
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
          background: 'var(--accent-dim)',
          border: '1px solid rgba(143, 240, 117, 0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Leaf size={15} color="var(--accent)" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--fg)', letterSpacing: '-0.02em' }}>
          Carbo<span style={{ color: 'var(--accent)' }}>Trace</span>
        </span>
      </Link>

      {/* Sync pill */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border-md)] text-[11px] font-mono">
        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" />
        <span className="text-[var(--fg-muted)]">LEDGER SYNCED</span>
      </div>


      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
        {/* Role Badge (Static for non-admin, Administrative Switcher for Admin only) */}
        {role === 'admin' ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] border border-[var(--border)] text-[var(--fg)] text-xs transition-all shadow-sm cursor-pointer"
              title="Admin: Audit Role Switcher"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--red)]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase font-mono text-[var(--red)] leading-none">Admin Authority</span>
                <span className="font-semibold text-[var(--fg)] capitalize leading-tight">Switch Persona</span>
              </div>
              <ChevronDown size={14} className="text-[var(--fg-subtle)]" />
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: '260px', borderRadius: '14px',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  boxShadow: 'var(--card-shadow)',
                  padding: '0.5rem', zIndex: 60,
                }}
              >
                <div style={{ padding: '0.375rem 0.5rem 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.375rem' }}>
                  <p style={{ margin: 0, fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--red)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Admin Persona Delegation
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--fg-muted)' }}>
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
                          background: isActive ? 'var(--accent-dim)' : 'transparent',
                          color: isActive ? 'var(--accent)' : 'var(--fg-muted)',
                          fontWeight: isActive ? 600 : 400,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--surface-3)'; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={r.color}>{r.icon}</span>
                          <span>{r.label}</span>
                        </div>
                        {isActive && <Check size={14} color="var(--accent)" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--fg)] text-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-mono text-[var(--fg-subtle)] leading-none">Role</span>
              <span className="font-semibold text-[var(--fg)] capitalize leading-tight">{ROLE_LABELS[role]}</span>
            </div>
          </div>
        )}

        <ThemeToggle />

        {/* Notifications bell */}
        <button
          id="topbar-notifications-btn"
          style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            color: 'var(--fg-muted)', cursor: 'pointer',
            padding: '0.45rem', borderRadius: '10px',
            position: 'relative', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseOver={e => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--border-md)'; }}
          onMouseOut={e => { e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <Bell size={17} />
          <span style={{
            position: 'absolute', top: '5px', right: '5px',
            width: '6px', height: '6px', background: 'var(--accent)',
            borderRadius: '50%', boxShadow: '0 0 6px var(--accent)',
          }} />
        </button>

        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '10px',
          background: 'var(--accent-dim)',
          border: '1px solid rgba(143, 240, 117, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent)', cursor: 'pointer',
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
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              borderRadius: '16px', maxWidth: 540, width: '100%',
              padding: '1.75rem', boxShadow: 'var(--card-shadow)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} color={isSupabaseConfigured ? 'var(--accent)' : 'var(--amber)'} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>
                  Supabase Database Integration
                </h3>
              </div>
              <button
                onClick={() => setDbModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--fg-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: isSupabaseConfigured ? 'var(--accent-dim)' : 'var(--amber-dim)',
              border: `1px solid ${isSupabaseConfigured ? 'rgba(143, 240, 117, 0.25)' : 'rgba(249, 156, 0, 0.25)'}`,
              borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: isSupabaseConfigured ? 'var(--accent)' : 'var(--amber)', textTransform: 'uppercase' }}>
                {isSupabaseConfigured ? 'Status: Connected to Supabase Live Project' : 'Status: Resilient Local Demo Mode Active'}
              </div>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
                {isSupabaseConfigured
                  ? 'Your application is querying and synchronizing with live PostgreSQL tables and realtime change streams.'
                  : 'Operating in self-contained offline demo mode with instant data. All 6 dashboards (Generator, Driver, Recycler, Checker, Buyer, Admin) are fully functional.'}
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>
                To Connect Your Live Supabase Project:
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
                <li>
                  Open your <code style={{ color: 'var(--accent)' }}>.env</code> file in the project root.
                </li>
                <li>
                  Provide your Supabase URL and Anon Key:
                  <pre style={{ background: 'var(--surface-2)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '10px', color: 'var(--cyan)', margin: '4px 0' }}>
                    VITE_SUPABASE_URL=https://xyz.supabase.co
                    VITE_SUPABASE_ANON_KEY=eyJh...
                  </pre>
                </li>
                <li>
                  Run the SQL migration script located at:
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', marginTop: '2px' }}>
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
