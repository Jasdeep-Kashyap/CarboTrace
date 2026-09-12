import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  trend?: number; // positive = up, negative = down, 0 = neutral
  accentColor?: string;
  id?: string;
}

export function StatCard({ label, value, sub, icon, trend, accentColor = 'var(--color-accent)', id }: StatCardProps) {
  const trendIcon = trend === undefined ? null : trend > 0
    ? <TrendingUp size={13} color="var(--color-success)" />
    : trend < 0
      ? <TrendingDown size={13} color="var(--color-danger)" />
      : <Minus size={13} color="var(--color-text-muted)" />;

  const trendColor = trend === undefined ? '' : trend > 0 ? 'var(--color-success)' : trend < 0 ? 'var(--color-danger)' : 'var(--color-text-muted)';

  return (
    <div className="card" id={id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 80, height: 80,
        background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
        borderRadius: '50%', transform: 'translate(20px, -20px)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</span>
        {icon && (
          <div style={{
            width: 32, height: 32, borderRadius: '8px',
            background: `${accentColor}18`, color: accentColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>
        {value}
      </div>

      {(sub || trend !== undefined) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {trendIcon}
          {sub && <span style={{ fontSize: '0.75rem', color: trendColor || 'var(--color-text-muted)' }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}
