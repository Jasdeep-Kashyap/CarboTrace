import { Link } from 'react-router-dom';
import { ShoppingCart, Leaf, Download, Award } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockCredits } from '@/lib/mock-data';
import { formatCO2e, formatCurrency, formatDate, PROCESSING_METHOD_LABELS } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function BuyerDashboard() {
  const { profile } = useAuth();
  const myCredits = mockCredits.filter(c => (profile?.org_id ? c.owner_org_id === profile.org_id : c.owner_org_id === 'org-buyer'));
  const retired   = myCredits.filter(c => c.status === 'retired');
  const purchased = myCredits.filter(c => c.status === 'sold');
  const totalCO2e = myCredits.reduce((s, c) => s + c.co2e_kg, 0);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Buyer Dashboard</h1>
          <p className="page-subtitle">Welcome, {profile?.full_name} · Infosys ESG Fund</p>
        </div>
        <Link to="/marketplace" className="btn btn-accent" id="browse-market-btn">
          <ShoppingCart size={16} /> Browse Marketplace
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard label="Credits Owned"    value={myCredits.length}   icon={<Award size={16} />}       trend={1}   sub="All statuses"         accentColor="var(--color-accent)"  id="stat-owned" />
        <StatCard label="Credits Retired"  value={retired.length}     icon={<Leaf size={16} />}        trend={1}   sub="Permanently offset"    accentColor="var(--color-success)" id="stat-retired" />
        <StatCard label="Total CO₂e"       value={formatCO2e(totalCO2e)} icon={<Leaf size={16} />}    trend={4}   sub="Offset contributed"    accentColor="var(--color-primary)" id="stat-co2e" />
        <StatCard label="Spent"            value={formatCurrency(myCredits.reduce((s, c) => s + c.price_usd * (c.co2e_kg / 1000), 0))} icon={<ShoppingCart size={16} />} trend={0} sub="Total investment"  accentColor="var(--color-warning)" id="stat-spent" />
      </div>

      {/* Credits table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>My Carbon Credits</h2>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Serial</th>
                <th>Methodology</th>
                <th>CO₂e</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myCredits.map(c => (
                <tr key={c.id} id={`buyer-credit-row-${c.id}`}>
                  <td>
                    <code style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700 }}>{c.serial_number}</code>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{PROCESSING_METHOD_LABELS[c.methodology]}</td>
                  <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>{formatCO2e(c.co2e_kg)}</td>
                  <td><StatusBadge status={c.status} type="credit" /></td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{c.sold_at ? formatDate(c.sold_at) : '—'}</td>
                  <td>
                    {c.certificate_url && (
                      <button className="btn btn-ghost btn-sm" id={`download-cert-${c.id}`}>
                        <Download size={13} /> Cert
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
