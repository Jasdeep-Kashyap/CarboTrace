import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { mockOrgs } from '@/lib/mock-data';
import { formatDate, ORG_TYPE_LABELS } from '@/lib/utils';

export default function OrgsPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/admin" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
        <div>
          <h1 className="page-title">Organisations</h1>
          <p className="page-subtitle">{mockOrgs.length} registered organisations</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 'var(--radius-lg)' }}>
          <table>
            <thead>
              <tr>
                <th>Organisation</th>
                <th>Type</th>
                <th>City</th>
                <th>Tier</th>
                <th>Verified</th>
                <th>Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockOrgs.map(org => (
                <tr key={org.id} id={`org-row-${org.id}`}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={14} color="var(--color-accent)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{org.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{org.contact_email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{ORG_TYPE_LABELS[org.type]}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{org.city}, {org.state}</td>
                  <td>
                    <span className={`badge ${org.tier === 'enterprise' ? 'badge-purple' : org.tier === 'pro' ? 'badge-teal' : org.tier === 'basic' ? 'badge-blue' : 'badge-gray'}`}>
                      {org.tier}
                    </span>
                  </td>
                  <td>
                    {org.verified
                      ? <span className="badge badge-green"><CheckCircle2 size={10} /> Verified</span>
                      : <span className="badge badge-gray"><XCircle size={10} /> Pending</span>
                    }
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{formatDate(org.created_at)}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" id={`manage-org-${org.id}`}>Manage</button>
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
