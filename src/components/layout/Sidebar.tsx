import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Recycle, ShieldCheck, ShoppingCart,
  Settings, LogOut, Leaf, Package, MapPin, ClipboardList, X,
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
      {/* Logo */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={16} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>CarboTrace</span>
        </div>
        <button className="btn-ghost" style={{ padding: '0.25rem', borderRadius: '6px', display: 'none' }} onClick={onClose} id="sidebar-close-btn">
          <X size={16} />
        </button>
      </div>

      {/* Role badge */}
      <div style={{ padding: '0.75rem 1rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)',
          padding: '0.5rem 0.75rem',
        }}>
          <div style={{ color: 'var(--color-accent)' }}>{ROLE_ICON[role]}</div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text)' }}>{profile?.full_name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{ROLE_LABELS[role]}</div>
          </div>
        </div>
      </div>

      <div className="divider" style={{ margin: '0 1rem' }} />

      {/* Nav items */}
      <nav style={{ padding: '0 0.5rem', flex: 1 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.25rem 0.5rem 0.5rem', marginTop: '0.25rem' }}>
          Portal
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

        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.75rem 0.5rem 0.5rem', marginTop: '0.5rem' }}>
          Platform
        </div>
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={onClose}>
          <Leaf size={16} /> Public Dashboard
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
