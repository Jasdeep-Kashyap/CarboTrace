import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Recycle, ShieldCheck, ShoppingCart,
  Settings, LogOut, Leaf, Package, MapPin, ClipboardList, X,
  Building2, AlertTriangle, FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/lib/utils';
import type { UserRole } from '@/types/database';

interface NavItem { label: string; href: string; icon: React.ReactNode; }

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  generator: [
    { label: 'Dashboard',    href: '/generator',     icon: <LayoutDashboard size={16} /> },
    { label: 'New Pickup',   href: '/generator/new', icon: <Package size={16} /> },
  ],
  driver: [
    { label: 'Dashboard',   href: '/driver',          icon: <LayoutDashboard size={16} /> },
    { label: 'Active Route', href: '/driver/route/route-1', icon: <MapPin size={16} /> },
  ],
  recycler: [
    { label: 'Dashboard',   href: '/recycler',            icon: <LayoutDashboard size={16} /> },
    { label: 'Batches',     href: '/recycler/batch/batch-1', icon: <Recycle size={16} /> },
  ],
  checker: [
    { label: 'Dashboard',   href: '/checker',          icon: <LayoutDashboard size={16} /> },
    { label: 'Audit Queue', href: '/checker/queue',    icon: <ClipboardList size={16} /> },
  ],
  buyer: [
    { label: 'Marketplace', href: '/marketplace',     icon: <ShoppingCart size={16} /> },
    { label: 'My Credits',  href: '/buyer',           icon: <Leaf size={16} /> },
  ],
  admin: [
    { label: 'Dashboard',   href: '/admin',           icon: <LayoutDashboard size={16} /> },
    { label: 'Orgs',        href: '/admin/orgs',      icon: <Settings size={16} /> },
    { label: 'Disputes',    href: '/admin/disputes',  icon: <ShieldCheck size={16} /> },
    { label: 'Marketplace', href: '/marketplace',     icon: <ShoppingCart size={16} /> },
  ],
};

const ROLE_ICON: Record<UserRole, React.ReactNode> = {
  generator: <Package  size={14} />,
  driver:    <Truck    size={14} />,
  recycler:  <Recycle  size={14} />,
  checker:   <ShieldCheck size={14} />,
  buyer:     <ShoppingCart size={14} />,
  admin:     <Settings size={14} />,
};

interface SidebarProps { isOpen: boolean; onClose: () => void; }

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const role = profile?.role ?? 'generator';
  const navItems = NAV_BY_ROLE[role] ?? [];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`} style={{ zIndex: 50 }}>
      {/* Logo — Clicking takes to Home Page / */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', cursor: 'pointer' }} title="Go to CarboTrace Home">
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(143, 240, 117, 0.2), rgba(59, 130, 246, 0.2))',
            border: '1px solid rgba(143, 240, 117, 0.4)',
            boxShadow: '0 0 15px rgba(143, 240, 117, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={18} color="#8FF075" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#FFFFFF', letterSpacing: '-0.02em', fontFamily: 'var(--font-sans)' }}>
                Carbo<span style={{ color: '#8FF075' }}>Trace</span>
              </span>
              <span style={{
                fontSize: '9px', fontFamily: 'var(--font-mono)', padding: '1px 5px',
                borderRadius: '4px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)'
              }}>MRV v2.4</span>
            </div>
            <p style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', margin: 0 }}>
              WASTE-TO-CARBON
            </p>
          </div>
        </Link>
        <button className="btn-ghost" style={{ padding: '0.25rem', borderRadius: '6px', display: 'none' }} onClick={onClose} id="sidebar-close-btn">
          <X size={16} />
        </button>
      </div>

      {/* Role badge card */}
      <div style={{ padding: '0.75rem 1rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          background: '#12151A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px',
          padding: '0.625rem 0.75rem',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '8px',
            background: 'rgba(143, 240, 117, 0.12)', border: '1px solid rgba(143, 240, 117, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#8FF075',
          }}>
            {ROLE_ICON[role]}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.full_name}
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#8FF075' }}>
              {ROLE_LABELS[role]} Portal
            </div>
          </div>
        </div>
      </div>

      <div className="divider" style={{ margin: '0 1rem' }} />

      {/* Nav items */}
      <nav style={{ padding: '0 0.5rem', flex: 1, overflowY: 'auto' }}>
        {/* Active role views */}
        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.25rem 0.5rem 0.5rem', marginTop: '0.25rem' }}>
          Active Portal ({ROLE_LABELS[role]})
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        {/* Admin-only Platform Governance */}
        {role === 'admin' && (
          <>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.85rem 0.5rem 0.35rem' }}>
              Platform Governance
            </div>
            <NavLink to="/admin/orgs" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={onClose} title="All registered organisations">
              <Building2 size={16} /> All Organisations
            </NavLink>
            <NavLink to="/admin/audit-log" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={onClose} title="Immutable blockchain audit log">
              <FileText size={16} /> Audit Log
            </NavLink>
            <NavLink to="/admin/disputes" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={onClose} title="Disputes across all pickups">
              <AlertTriangle size={16} /> Disputes Ledger
            </NavLink>
          </>
        )}

        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.85rem 0.5rem 0.35rem' }}>
          Public Ledgers
        </div>
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={onClose}>
          <Leaf size={16} /> Live Public Ledger
        </NavLink>
        <NavLink to="/impact" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={onClose}>
          <ShieldCheck size={16} color="#8FF075" /> Village Impact
        </NavLink>
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <button className="nav-link" onClick={handleLogout} style={{ color: 'var(--color-danger)', width: '100%' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
