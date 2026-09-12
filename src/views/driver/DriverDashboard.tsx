import { Link } from 'react-router-dom';
import { MapPin, Play, CheckCircle2, Clock, Package } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockRoutes } from '@/lib/mock-data';
import { formatWeight, formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function DriverDashboard() {
  const { profile } = useAuth();
  const myRoutes = mockRoutes.filter(r => !profile?.id || r.driver_profile_id === profile.id || r.driver_profile_id === 'profile-driver');
  const activeRoute  = myRoutes.find(r => r.status === 'active');
  const allRoutes    = myRoutes;
  const todayRoute   = allRoutes.find(r => r.route_date === new Date().toISOString().split('T')[0]);
  const totalStops   = allRoutes.reduce((s, r) => s + r.total_stops, 0);
  const doneStops    = allRoutes.reduce((s, r) => s + r.completed_stops, 0);
  const totalWeight  = allRoutes.reduce((s, r) => s + r.total_weight_kg, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Driver Dashboard</h1>
        <p className="page-subtitle">Welcome, {profile?.full_name} · Today is {formatDate(new Date().toISOString())}</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Today's Stops"   value={activeRoute?.total_stops ?? 0}     icon={<MapPin size={16} />}       trend={0}  sub="Pending collection"    accentColor="var(--color-info)"    id="stat-stops" />
        <StatCard label="Completed Stops" value={doneStops}                          icon={<CheckCircle2 size={16} />} trend={4}  sub="Across all routes"     accentColor="var(--color-success)" id="stat-done" />
        <StatCard label="Waste Collected" value={formatWeight(totalWeight)}          icon={<Package size={16} />}      trend={6}  sub="Total weight picked up" accentColor="var(--color-accent)"  id="stat-weight" />
        <StatCard label="Active Route"    value={activeRoute ? 'In Progress' : 'None'} icon={<Play size={16} />}     trend={0}  sub="Route status"          accentColor="var(--color-primary)" id="stat-route" />
      </div>

      {/* Active route banner */}
      {activeRoute && (
        <div className="glass-accent" style={{ borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MapPin size={22} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>Active Route — {activeRoute.route_date}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
              {activeRoute.completed_stops}/{activeRoute.total_stops} stops · {formatWeight(activeRoute.total_weight_kg)} collected
            </div>
          </div>
          <Link to={`/driver/route/${activeRoute.id}`} className="btn btn-accent" id="continue-route-btn">
            Continue Route →
          </Link>
        </div>
      )}

      {/* Route history */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Route History</h2>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Stops</th>
                <th>Weight</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allRoutes.map(route => (
                <tr key={route.id} id={`route-row-${route.id}`}>
                  <td style={{ fontWeight: 500 }}>{formatDate(route.route_date)}</td>
                  <td style={{ fontSize: '0.875rem' }}>{route.completed_stops}/{route.total_stops}</td>
                  <td style={{ fontSize: '0.875rem' }}>{formatWeight(route.total_weight_kg)}</td>
                  <td><StatusBadge status={route.status} type="route" label={route.status.charAt(0).toUpperCase() + route.status.slice(1)} /></td>
                  <td>
                    <Link to={`/driver/route/${route.id}`} className="btn btn-ghost btn-sm" id={`view-route-${route.id}`}>
                      View
                    </Link>
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
