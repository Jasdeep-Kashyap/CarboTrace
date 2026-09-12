import { Menu, Bell, Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/utils';

interface TopbarProps { onMenuClick: () => void; }

export function Topbar({ onMenuClick }: TopbarProps) {
  const { profile } = useAuth();
  const role = profile?.role ?? 'generator';
  const color = ROLE_COLORS[role];

  const badgeStyle: Record<string, string> = {
    background: `hsl(var(--badge-${color}-hue, 142) 71% 45% / 0.15)`,
    color:      'var(--color-accent)',
    padding:    '0.2rem 0.625rem',
    borderRadius: '99px',
    fontSize:   '0.72rem',
    fontWeight: '600',
  };

  return (
    <header className="topbar">
      <button
        id="topbar-menu-btn"
        onClick={onMenuClick}
        style={{
          background: 'transparent', border: 'none', color: 'var(--color-text-muted)',
          cursor: 'pointer', padding: '0.25rem', borderRadius: '6px',
          display: 'none', // shown via CSS at mobile breakpoints
        }}
      >
        <Menu size={20} />
      </button>

      {/* Mobile logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1 }}>
        <Leaf size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>CarboTrace</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
        {/* Role badge */}
        <span style={badgeStyle} className={`badge badge-${color}`}>
          {ROLE_LABELS[role]}
        </span>

        {/* Notifications bell */}
        <button
          id="topbar-notifications-btn"
          style={{
            background: 'transparent', border: 'none', color: 'var(--color-text-muted)',
            cursor: 'pointer', padding: '0.375rem', borderRadius: '8px',
            position: 'relative', transition: 'color 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseOut={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: '4px', right: '4px',
            width: '7px', height: '7px', background: 'var(--color-accent)',
            borderRadius: '50%', border: '1.5px solid var(--color-bg)',
          }} />
        </button>

        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 700, color: 'white', cursor: 'pointer',
          flexShrink: 0,
        }}>
          {profile?.full_name?.charAt(0) ?? 'U'}
        </div>
      </div>
    </header>
  );
}
