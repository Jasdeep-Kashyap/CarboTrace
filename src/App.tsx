import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { PageSkeleton } from '@/components/shared/PageSkeleton';

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

function ProtectedRoute({ children, allowedRoles }: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { profile, isLoading } = useAuth();
  if (isLoading) return <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading…</div>;
  if (!profile) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(profile.role)) return <Navigate to={`/${profile.role}`} replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
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
            <Route path="/marketplace"        element={<MarketplacePage />} />
            <Route path="/marketplace/:id"    element={<CreditDetailPage />} />
            <Route path="/buyer"              element={<ProtectedRoute allowedRoles={['buyer', 'admin']}><BuyerDashboard /></ProtectedRoute>} />

            {/* Admin */}
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
