import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Download, Filter } from 'lucide-react';
import { mockPickups, mockBatches, mockCredits, mockOrgs } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';

// We'll generate a fake audit log by interleaving dates from mock data
const auditLog = [
  ...mockPickups.map(p => ({
    id: `al-p-${p.id}`,
    action: `Pickup requested: ${p.tracking_code}`,
    actor: mockOrgs.find(o => o.id === p.org_id)?.name || 'Unknown',
    timestamp: p.created_at,
    category: 'pickup'
  })),
  ...mockBatches.map(b => ({
    id: `al-b-${b.id}`,
    action: `Batch created: ${b.id.toUpperCase()}`,
    actor: 'GreenCycle Industries',
    timestamp: b.created_at,
    category: 'batch'
  })),
  ...mockCredits.map(c => ({
    id: `al-c-${c.id}`,
    action: `Credit minted: ${c.serial_number}`,
    actor: 'System / Auditor',
    timestamp: c.minted_at,
    category: 'credit'
  }))
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export default function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredLogs = auditLog.filter(log => {
    if (filter !== 'all' && log.category !== filter) return false;
    if (search && !log.action.toLowerCase().includes(search.toLowerCase()) && !log.actor.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/admin" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
        <div style={{ flex: 1 }}>
          <h1 className="page-title">Immutable Audit Log</h1>
          <p className="page-subtitle">Cryptographically verifiable trail of all platform events</p>
        </div>
        <button className="btn btn-accent" id="export-csv-btn">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={16} color="var(--color-text-muted)" />
        
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            className="input-base" 
            placeholder="Search action or actor..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            style={{ paddingLeft: '2rem' }}
          />
        </div>

        <select className="input-base" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 180 }}>
          <option value="all">All Events</option>
          <option value="pickup">Pickups</option>
          <option value="batch">Processing Batches</option>
          <option value="credit">Carbon Credits</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 'var(--radius-lg)' }}>
          <table>
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Actor</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td>
                    <code style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{log.id}</code>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{formatDateTime(log.timestamp)}</td>
                  <td style={{ fontWeight: 500, fontSize: '0.875rem' }}>{log.action}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{log.actor}</td>
                  <td>
                    <span className={`badge ${log.category === 'credit' ? 'badge-purple' : log.category === 'batch' ? 'badge-teal' : 'badge-blue'}`}>
                      {log.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No audit logs match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
