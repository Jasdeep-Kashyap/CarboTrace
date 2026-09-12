import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Filter, Search } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockCredits } from '@/lib/mock-data';
import { formatCO2e, formatCurrency, formatDate, PROCESSING_METHOD_LABELS } from '@/lib/utils';
import type { ProcessingMethod } from '@/types/database';

const ALL_METHODS = Object.keys(PROCESSING_METHOD_LABELS) as ProcessingMethod[];

export default function MarketplacePage() {
  const [search, setSearch]     = useState('');
  const [method, setMethod]     = useState<string>('all');
  const [vintage, setVintage]   = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState(100);

  const listed = mockCredits.filter(c => c.status === 'listed' || c.status === 'sold' || c.status === 'retired');

  const filtered = listed.filter(c => {
    if (method !== 'all' && c.methodology !== method) return false;
    if (vintage !== 'all' && String(c.vintage_year) !== vintage) return false;
    if (c.price_usd > maxPrice) return false;
    if (search && !c.serial_number.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Carbon Credit Marketplace</h1>
        <p className="page-subtitle">Browse and purchase verified W2C carbon credits</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.875rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={16} color="var(--color-text-muted)" />

        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="input-base" placeholder="Search serial…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2rem' }} id="marketplace-search" />
        </div>

        <select className="input-base" value={method} onChange={e => setMethod(e.target.value)} style={{ flex: '0 0 180px' }} id="filter-method">
          <option value="all">All Methodologies</option>
          {ALL_METHODS.map(m => <option key={m} value={m}>{PROCESSING_METHOD_LABELS[m]}</option>)}
        </select>

        <select className="input-base" value={vintage} onChange={e => setVintage(e.target.value)} style={{ flex: '0 0 130px' }} id="filter-vintage">
          <option value="all">All Vintages</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>

        <div style={{ flex: '0 0 200px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Max Price: ${maxPrice}</div>
          <input type="range" min={5} max={50} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-accent)' }} id="filter-price" />
        </div>
      </div>

      {/* Credit grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map(credit => (
          <div key={credit.id} className="card card-hover" id={`credit-card-${credit.id}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <code style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700 }}>{credit.serial_number}</code>
              <StatusBadge status={credit.status} type="credit" />
            </div>

            {/* Methodology */}
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {PROCESSING_METHOD_LABELS[credit.methodology]} · {credit.vintage_year}
            </div>

            {/* CO2e highlight */}
            <div style={{ background: 'hsl(174 72% 46% / 0.06)', border: '1px solid hsl(174 72% 46% / 0.15)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-accent)' }}>{formatCO2e(credit.co2e_kg)}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>CO₂e Verified</div>
            </div>

            {/* Price + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatCurrency(credit.price_usd)}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>per tCO₂e</div>
              </div>
              {credit.status === 'listed' ? (
                <Link to={`/marketplace/${credit.id}`} className="btn btn-accent btn-sm" id={`buy-credit-${credit.id}`}>
                  <ShoppingCart size={14} /> Buy
                </Link>
              ) : (
                <span className="badge badge-gray">{credit.status === 'retired' ? 'Retired' : 'Sold'}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          No credits match your filters.
        </div>
      )}
    </div>
  );
}
