import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Users, Activity, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { mockOrgs, mockDisputes, mockImpactMetrics } from '@/lib/mock-data';
import { formatWeight, formatCO2e } from '@/lib/utils';

export default function AdminDashboard() {
  const metrics = mockImpactMetrics;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform-wide oversight · CarboTrace</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Organisations"    value={metrics.orgs_registered}                icon={<Building2 size={16} />}   trend={5}   sub="Registered on platform"   accentColor="var(--color-info)"    id="stat-orgs" />
        <StatCard label="Waste Diverted"   value={formatWeight(metrics.total_waste_kg)}   icon={<Activity size={16} />}    trend={12}  sub="From landfills"           accentColor="var(--color-accent)"  id="stat-waste" />
        <StatCard label="Credits Minted"   value={metrics.credits_minted}                 icon={<ShieldCheck size={16} />} trend={8}   sub="W2C serials generated"    accentColor="var(--color-success)" id="stat-credits" />
        <StatCard label="Open Disputes"    value={mockDisputes.filter(d => d.status === 'open').length} icon={<AlertTriangle size={16} />} trend={-1} sub="Requiring resolution" accentColor="var(--color-danger)" id="stat-disputes" />
      </div>

      {/* Quick nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Manage Orgs',     href: '/admin/orgs',      icon: <Building2 size={20} />,  color: 'var(--color-info)',    desc: `${mockOrgs.length} organisations` },
          { label: 'Disputes',        href: '/admin/disputes',  icon: <AlertTriangle size={20} />, color: 'var(--color-danger)', desc: `${mockDisputes.length} total disputes` },
          { label: 'Marketplace',     href: '/marketplace',     icon: <ShieldCheck size={20} />, color: 'var(--color-accent)', desc: 'View all credits' },
        ].map(item => (
          <Link key={item.href} to={item.href} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none' }} id={`admin-nav-${item.href.replace('/', '').replace('/', '-')}`}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${item.color}18`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Recent Platform Activity</h2>
        </div>
        <div style={{ padding: '0.5rem 0' }}>
          {[
            { icon: '✅', text: 'Carbon credit W2C-2026-000001 minted by Dr. Meena Nair',     time: '2h ago',  color: 'var(--color-success)' },
            { icon: '🚛', text: 'Route route-1 started by Ravi Kumar (3 stops)',               time: '3h ago',  color: 'var(--color-info)' },
            { icon: '📦', text: 'Pickup W2C-2026-002BX7 queued by The Leela Palace',           time: '5h ago',  color: 'var(--color-accent)' },
            { icon: '⚠️', text: 'Dispute raised on pickup W2C-2026-005EW3 — photo flagged',   time: '7h ago',  color: 'var(--color-warning)' },
            { icon: '🌱', text: 'GreenCycle Industries submitted batch for audit',              time: '1d ago',  color: 'var(--color-primary)' },
            { icon: '💰', text: 'Infosys ESG Fund purchased W2C-2026-000002 · $22/tCO₂e',   time: '2d ago',  color: '#a855f7' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 1.25rem', borderBottom: i < 5 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ fontSize: '1.1rem' }}>{a.icon}</span>
              <span style={{ fontSize: '0.85rem', flex: 1, color: 'var(--color-text)' }}>{a.text}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-subtle)', flexShrink: 0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
