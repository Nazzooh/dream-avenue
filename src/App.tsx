import { Suspense, lazy, type ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Outlet, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import AdminErrorBoundary from './components/admin-v2/AdminErrorBoundary';
import { AdminWorkspaceShell } from './components/admin-v2/AdminLayout';
import { CookieConsent } from './components/CookieConsent';
import { AdminLoadingFallback, LoadingFallback } from './components/LoadingFallback';
import { MainWebsite } from './pages/MainWebsite';
import { ProtectedRoute } from './src/auth/ProtectedRoute';
import type { AdminPermission } from './src/lib/adminPermissions';
import { queryClient } from './src/lib/queryClient';
import { initializePerformanceOptimizations } from './src/utils/performanceOptimizations';

import './styles/admin-dashboard.css';
import './styles/admin-login-pastel.css';
import './styles/new-booking-page.css';
import './styles/admin-workspace.css';
import './styles/admin-redesign.css';
import './styles/admin-completion.css';
import './styles/admin-responsive.css';

const SmartSlotBookingPage = lazy(() => import('./pages/SmartSlotBookingPage'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminLogin = lazy(() => import('./pages/admin/Login').then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminPackages = lazy(() => import('./pages/admin/Packages').then((m) => ({ default: m.AdminPackages })));
const AdminFacilities = lazy(() => import('./pages/admin/Facilities').then((m) => ({ default: m.AdminFacilities })));
const AdminGallery = lazy(() => import('./pages/admin/Gallery').then((m) => ({ default: m.AdminGallery })));
const AdminAvailability = lazy(() => import('./pages/admin/Availability').then((m) => ({ default: m.AdminAvailability })));
const AdminRequests = lazy(() => import('./pages/admin/Requests').then((m) => ({ default: m.AdminRequests })));
const AdminBookings = lazy(() => import('./pages/admin/Bookings').then((m) => ({ default: m.AdminBookings })));
const AnalyticsSettings = lazy(() => import('./pages/admin/AnalyticsSettings').then((m) => ({ default: m.AnalyticsSettings })));
const AdminPartners = lazy(() => import('./pages/admin/Partners').then((m) => ({ default: m.AdminPartners })));
const AdminActivity = lazy(() => import('./pages/admin/Activity').then((m) => ({ default: m.AdminActivity })));
const AdminTasks = lazy(() => import('./pages/admin/Tasks').then((m) => ({ default: m.AdminTasks })));
const AdminStaffDirectory = lazy(() => import('./pages/admin/StaffDirectory').then((m) => ({ default: m.AdminStaffDirectory })));

function protectedAdminPage(page: ReactNode, permission?: AdminPermission) {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <ProtectedRoute requireAdmin={true} permission={permission}>{page}</ProtectedRoute>
    </Suspense>
  );
}

export default function App() {
  useEffect(() => {
    initializePerformanceOptimizations();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<MainWebsite />} />
              <Route path="/booking" element={<SmartSlotBookingPage />} />
              <Route path="/slot-booking" element={<SmartSlotBookingPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route element={<AdminErrorBoundary><Outlet /></AdminErrorBoundary>}>
                <Route path="/admin" element={<AdminWorkspaceShell />}>
                  <Route index element={protectedAdminPage(<AdminDashboard />)} />
                  <Route path="dashboard" element={protectedAdminPage(<AdminDashboard />)} />
                  <Route path="packages" element={protectedAdminPage(<AdminPackages />, 'content')} />
                  <Route path="facilities" element={protectedAdminPage(<AdminFacilities />, 'content')} />
                  <Route path="gallery" element={protectedAdminPage(<AdminGallery />, 'content')} />
                  <Route path="availability" element={protectedAdminPage(<AdminAvailability />, 'operations')} />
                  <Route path="requests" element={protectedAdminPage(<AdminRequests />, 'access')} />
                  <Route path="bookings" element={protectedAdminPage(<AdminBookings />, 'operations')} />
                  <Route path="analytics" element={protectedAdminPage(<AnalyticsSettings />, 'analytics')} />
                  <Route path="partners" element={protectedAdminPage(<AdminPartners />, 'partners')} />
                  <Route path="activity" element={protectedAdminPage(<AdminActivity />, 'audit')} />
                  <Route path="tasks" element={protectedAdminPage(<AdminTasks />, 'tasks')} />
                  <Route path="staff" element={protectedAdminPage(<AdminStaffDirectory />, 'access')} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>

        <Toaster position="top-right" richColors />
        <CookieConsent />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </HelmetProvider>
  );
}
