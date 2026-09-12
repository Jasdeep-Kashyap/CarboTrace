import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppShell } from '@/components/layout/AppShell';

// Public
import PublicDashboard from '@/views/public/PublicDashboard';

// Auth
import LoginPage from '@/views/auth/LoginPage';
import RegisterPage from '@/views/auth/RegisterPage';

// Generator
import GeneratorDashboard from '@/views/generator/GeneratorDashboard';
import NewPickupPage from '@/views/generator/NewPickupPage';
import PickupDetailPage from '@/views/generator/PickupDetailPage';

// Driver
import DriverDashboard from '@/views/driver/DriverDashboard';
import RoutePage from '@/views/driver/RoutePage';

// Recycler
import RecyclerDashboard from '@/views/recycler/RecyclerDashboard';
import ProcessingLogPage from '@/views/recycler/ProcessingLogPage';

// Checker
import CheckerDashboard from '@/views/checker/CheckerDashboard';
import AuditQueuePage from '@/views/checker/AuditQueuePage';
import AuditReviewPage from '@/views/checker/AuditReviewPage';

// Marketplace
import MarketplacePage from '@/views/marketplace/MarketplacePage';
import BuyerDashboard from '@/views/marketplace/BuyerDashboard';
import CreditDetailPage from '@/views/marketplace/CreditDetailPage';

// Admin
import AdminDashboard from '@/views/admin/AdminDashboard';
import OrgsPage from '@/views/admin/OrgsPage';
import DisputesPage from '@/views/admin/DisputesPage';

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
    <Routes>
      {/* Public — no auth required */}
      <Route path="/" element={<PublicDashboard />} />

      {/* Auth */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
