import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { ShieldAlert } from 'lucide-react';
import type { UserRole } from '@/types/database';

// Public & Auth (eagerly loaded for fast first paint)
import PublicDashboard from '@/views/public/PublicDashboard';
import LoginPage from '@/views/auth/LoginPage';
import RegisterPage from '@/views/auth/RegisterPage';
import OnboardingPage from '@/views/auth/OnboardingPage';

const ImpactPage = lazy(() => import('@/views/public/ImpactPage'));

// Lazy loaded portals
const GeneratorDashboard = lazy(() => import('@/views/generator/GeneratorDashboard'));
const NewPickupPage      = lazy(() => import('@/views/generator/NewPickupPage'));
const PickupDetailPage   = lazy(() => import('@/views/generator/PickupDetailPage'));

const DriverDashboard    = lazy(() => import('@/views/driver/DriverDashboard'));
const RoutePage          = lazy(() => import('@/views/driver/RoutePage'));

const RecyclerDashboard  = lazy(() => import('@/views/recycler/RecyclerDashboard'));
const ProcessingLogPage  = lazy(() => import('@/views/recycler/ProcessingLogPage'));
const ClaimBatchPage     = lazy(() => import('@/views/recycler/ClaimBatchPage'));

const CheckerDashboard   = lazy(() => import('@/views/checker/CheckerDashboard'));
const AuditQueuePage     = lazy(() => import('@/views/checker/AuditQueuePage'));
const AuditReviewPage    = lazy(() => import('@/views/checker/AuditReviewPage'));

const MarketplacePage    = lazy(() => import('@/views/marketplace/MarketplacePage'));
const BuyerDashboard     = lazy(() => import('@/views/marketplace/BuyerDashboard'));
const CreditDetailPage   = lazy(() => import('@/views/marketplace/CreditDetailPage'));

const AdminDashboard     = lazy(() => import('@/views/admin/AdminDashboard'));
const OrgsPage           = lazy(() => import('@/views/admin/OrgsPage'));
const DisputesPage       = lazy(() => import('@/views/admin/DisputesPage'));
const AuditLogPage       = lazy(() => import('@/views/admin/AuditLogPage'));

const ROLE_HOME_MAP: Record<UserRole, string> = {
  generator: '/generator',
  driver: '/driver',
  recycler: '/recycler',
  checker: '/checker',
  buyer: '/buyer',
  admin: '/admin',
};

function DocumentTitleManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let pageTitle = 'Waste-to-Carbon Value Chain Tracker';

    if (path === '/') pageTitle = 'Waste-to-Carbon Value Chain Tracker';
    else if (path === '/impact') pageTitle = 'Village Impact Pilot & MRV Model';
    else if (path === '/login') pageTitle = 'Sign In to Portal';
    else if (path === '/register') pageTitle = 'Register Organisation';
    else if (path === '/onboarding') pageTitle = 'Organisation Onboarding';
    else if (path === '/generator') pageTitle = 'Generator Workspace';
    else if (path === '/generator/new') pageTitle = 'Schedule New Waste Pickup';
    else if (path.startsWith('/generator/')) pageTitle = 'Pickup Custody Dossier';
    else if (path === '/driver') pageTitle = 'Logistics Driver Console';
    else if (path.startsWith('/driver/route/')) pageTitle = 'Active Delivery Manifest';
    else if (path === '/recycler') pageTitle = 'Facility & Pyrolysis Desk';
    else if (path === '/recycler/claim') pageTitle = 'Claim Feedstock Batches';
    else if (path.startsWith('/recycler/batch/')) pageTitle = 'Batch Processing Log';
    else if (path === '/checker') pageTitle = 'Auditor Desk & MRV Assurance';
    else if (path === '/checker/queue') pageTitle = 'Carbon Verification Queue';
    else if (path.startsWith('/checker/audit/')) pageTitle = 'MRV Audit Review';
    else if (path === '/marketplace') pageTitle = 'Verified Carbon Credit Marketplace';
    else if (path.startsWith('/marketplace/')) pageTitle = 'Credit Provenance Certificate';
    else if (path === '/buyer') pageTitle = 'ESG Offsets & Retirement Portfolio';
    else if (path === '/admin') pageTitle = 'Platform Governance Console';
    else if (path === '/admin/orgs') pageTitle = 'Registered Organisations Ledger';
    else if (path === '/admin/disputes') pageTitle = 'Disputes & Arbitration Ledger';
    else if (path === '/admin/audit-log') pageTitle = 'Immutable Audit Trail';

    document.title = `${pageTitle} | CarboTrace`;
  }, [location.pathname]);

  return null;
}

function AccessDenied({ role }: { role?: string }) {
  const targetHome = role && ROLE_HOME_MAP[role as UserRole] ? ROLE_HOME_MAP[role as UserRole] : '/login';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '65vh', padding: '2rem', textAlign: 'center',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '16px',
        background: 'var(--red-dim)', border: '1px solid rgba(251, 44, 54, 0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem',
        color: 'var(--red)',
      }}>
        <ShieldAlert size={32} />
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.5rem' }}>
        Access Restricted
      </h2>
      <p style={{ maxWidth: 460, color: 'var(--fg-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        You do not have authorization to view this workspace. Each portal is strictly isolated to its designated role to ensure custody integrity and data privacy.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Link to={targetHome} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          Return to My Portal
        </Link>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <PageSkeleton />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    return <AccessDenied role={profile.role} />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <DocumentTitleManager />
      <Suspense fallback={<div className="page-content"><PageSkeleton /></div>}>
        <Routes>
          {/* Public — no auth required */}
          <Route path="/" element={<PublicDashboard />} />
          <Route path="/impact" element={<ImpactPage />} />

          {/* Auth */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

          {/* Protected portals — wrapped in AppShell */}
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            {/* Generator */}
            <Route path="/generator"          element={<ProtectedRoute allowedRoles={['generator', 'admin']}><GeneratorDashboard /></ProtectedRoute>} />
            <Route path="/generator/new"      element={<ProtectedRoute allowedRoles={['generator', 'admin']}><NewPickupPage /></ProtectedRoute>} />
            <Route path="/generator/:id"      element={<ProtectedRoute allowedRoles={['generator', 'admin']}><PickupDetailPage /></ProtectedRoute>} />

            {/* Driver */}
            <Route path="/driver"             element={<ProtectedRoute allowedRoles={['driver', 'admin']}><DriverDashboard /></ProtectedRoute>} />
            <Route path="/driver/route/:id"   element={<ProtectedRoute allowedRoles={['driver', 'admin']}><RoutePage /></ProtectedRoute>} />

            {/* Recycler */}
            <Route path="/recycler"           element={<ProtectedRoute allowedRoles={['recycler', 'admin']}><RecyclerDashboard /></ProtectedRoute>} />
            <Route path="/recycler/claim"     element={<ProtectedRoute allowedRoles={['recycler', 'admin']}><ClaimBatchPage /></ProtectedRoute>} />
            <Route path="/recycler/batch/:id" element={<ProtectedRoute allowedRoles={['recycler', 'admin']}><ProcessingLogPage /></ProtectedRoute>} />

            {/* Checker */}
            <Route path="/checker"            element={<ProtectedRoute allowedRoles={['checker', 'admin']}><CheckerDashboard /></ProtectedRoute>} />
            <Route path="/checker/queue"      element={<ProtectedRoute allowedRoles={['checker', 'admin']}><AuditQueuePage /></ProtectedRoute>} />
            <Route path="/checker/audit/:id"  element={<ProtectedRoute allowedRoles={['checker', 'admin']}><AuditReviewPage /></ProtectedRoute>} />

            {/* Marketplace / Buyer */}
            <Route path="/marketplace"        element={<ProtectedRoute allowedRoles={['buyer', 'generator', 'recycler', 'admin']}><MarketplacePage /></ProtectedRoute>} />
            <Route path="/marketplace/:id"    element={<ProtectedRoute allowedRoles={['buyer', 'generator', 'recycler', 'admin']}><CreditDetailPage /></ProtectedRoute>} />
            <Route path="/buyer"              element={<ProtectedRoute allowedRoles={['buyer', 'admin']}><BuyerDashboard /></ProtectedRoute>} />

            {/* Admin & Platform-wide Governance (Strictly Admin only) */}
            <Route path="/admin"              element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/orgs"         element={<ProtectedRoute allowedRoles={['admin']}><OrgsPage /></ProtectedRoute>} />
            <Route path="/admin/disputes"     element={<ProtectedRoute allowedRoles={['admin']}><DisputesPage /></ProtectedRoute>} />
            <Route path="/admin/audit-log"    element={<ProtectedRoute allowedRoles={['admin']}><AuditLogPage /></ProtectedRoute>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
