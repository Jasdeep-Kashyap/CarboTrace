import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, Check, Package, Truck, Recycle, ShieldCheck, ShoppingCart, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/utils';
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

      {/* Sync pill */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#12151A] border border-white/8 text-[11px] font-mono">
        <span className="w-2 h-2 rounded-full bg-[#8FF075] animate-pulse shadow-[0_0_8px_#8FF075]" />
        <span className="text-white/60">LEDGER SYNCED</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
        {/* 1-Click Persona Switcher */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12151A] hover:bg-[#161A20] border border-white/10 text-xs text-white transition-all shadow-sm cursor-pointer"
            title="Switch demo persona"
          >
            <span className="w-2 h-2 rounded-full bg-[#8FF075]" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-mono text-white/40 leading-none">Persona</span>
              <span className="font-semibold text-white capitalize leading-tight">{ROLE_LABELS[role]}</span>
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
                <p style={{ margin: 0, fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
                  1-Click Persona Switcher
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Test verified end-to-end workflows
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
    </header>
  );
}
