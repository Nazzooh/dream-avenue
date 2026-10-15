import { motion } from 'framer-motion';
import { useState, ReactNode } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';
import { MobileBottomNav } from './MobileBottomNav';
import { AutoLogout } from './AutoLogout';

// Map routes to page info

const routeMap: Record<string, { title: string; id: string }> = {
  '/admin': { title: 'Dashboard', id: 'dashboard' },
  '/admin/dashboard': { title: 'Dashboard', id: 'dashboard' },
  '/admin/packages': { title: 'Packages Management', id: 'packages' },
  '/admin/facilities': { title: 'Facilities Management', id: 'facilities' },
  '/admin/gallery': { title: 'Gallery Management', id: 'gallery' },
  '/admin/availability': { title: 'Availability Management', id: 'availability' },
  '/admin/requests': { title: 'Admin Access Requests', id: 'requests' },
  '/admin/bookings': { title: 'Bookings Management', id: 'bookings' },
  '/admin/analytics': { title: 'Analytics & Insights', id: 'analytics' },
  '/admin/partners': { title: 'Partner Network', id: 'partners' },
  '/admin/activity': { title: 'Activity & Audit', id: 'activity' },
  '/admin/tasks': { title: 'Team Tasks', id: 'tasks' },
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  // Admin routes are protected by ProtectedRoute in App.tsx. Keeping the
  // layout presentational prevents a second auth/profile request on navigation.
  const loading = false;
  const isAdmin = true;

  // Show loading state while checking auth
  if (loading) {
    console.log('🎨 AdminLayout: Loading auth state...');
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-6">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="mx-auto h-10 w-10 rounded-full border-2 border-slate-200 border-t-slate-900"
          />
          <p className="mt-4 text-sm font-semibold text-slate-900">Checking admin access</p>
          <p className="mt-1 text-xs text-slate-500">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not admin
  if (!isAdmin) {
    console.log('🎨 AdminLayout: Not admin, redirecting to login...');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('✅ AdminLayout: Admin authenticated, rendering layout');

  // Get current page info based on route
  const currentRoute = routeMap[location.pathname] || { title: 'Dashboard', id: 'dashboard' };

  return (
    <div className={`admin-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <AutoLogout />
      {/* Sidebar */}
      <DashboardSidebar
        currentPage={currentRoute.id}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="admin-main-content">
        <DashboardTopbar
          pageTitle={currentRoute.title}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Scrollable Content - Fluid Layout */}
        <main
          className="w-full mx-auto"
          style={{
            background: 'var(--bg-cream)',
            padding: 'clamp(1rem,3vw,3rem) clamp(1rem,4vw,3rem)',
            maxWidth: '1600px'
          }}
        >
          {children}

          <footer style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--admin-divider)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)' }}>
              © {new Date().getFullYear()} Dream Avenue · Designed and developed by <a href="https://nasooh.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--admin-lime-primary)', textDecoration: 'none', fontWeight: 600 }}>Nasooh</a>
            </p>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav currentPage={currentRoute.id} />
    </div>
  );
}
