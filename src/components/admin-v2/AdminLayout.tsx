import { motion } from 'framer-motion';
import { createContext, ReactNode, useContext, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AutoLogout } from './AutoLogout';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';
import { MobileBottomNav } from './MobileBottomNav';
import { AdminShortcuts } from './AdminShortcuts';

const routeMap: Record<string, { title: string; id: string }> = {
  '/admin': { title: 'Dashboard', id: 'dashboard' },
  '/admin/dashboard': { title: 'Dashboard', id: 'dashboard' },
  '/admin/packages': { title: 'Packages & Pricing', id: 'packages' },
  '/admin/facilities': { title: 'Venue Facilities', id: 'facilities' },
  '/admin/gallery': { title: 'Photo Gallery', id: 'gallery' },
  '/admin/availability': { title: 'Availability Calendar', id: 'availability' },
  '/admin/requests': { title: 'Access Requests', id: 'requests' },
  '/admin/bookings': { title: 'Bookings & Events', id: 'bookings' },
  '/admin/analytics': { title: 'Analytics & Insights', id: 'analytics' },
  '/admin/partners': { title: 'Partner Network', id: 'partners' },
  '/admin/activity': { title: 'Activity & Audit', id: 'activity' },
  '/admin/tasks': { title: 'Team Tasks', id: 'tasks' },
  '/admin/staff': { title: 'Staff Directory', id: 'staff' },
};

const AdminShellContext = createContext(false);

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminWorkspaceFrame({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const loading = false;
  const isAdmin = true;
  const currentRoute = routeMap[location.pathname] || { title: 'Dream Avenue Admin', id: 'dashboard' };

  if (loading) {
    return (
      <div className="admin-shell-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          className="admin-shell-loading-spinner"
        />
        <p>Preparing your workspace…</p>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <AdminShellContext.Provider value={true}>
      <div className={`admin-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AutoLogout />
        <DashboardSidebar
          currentPage={currentRoute.id}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />

        <div className="admin-main-content">
          <DashboardTopbar
            pageTitle={currentRoute.title}
            onMenuClick={() => setSidebarOpen((open) => !open)}
          />

          <main id="admin-main-content" className="admin-workspace-main" tabIndex={-1}>
            {children}
            <footer className="admin-workspace-footer">
              <p>
                © {new Date().getFullYear()} Dream Avenue · Designed and developed by{' '}
                <a href="https://nasooh.in" target="_blank" rel="noopener noreferrer">Nasooh</a>
              </p>
            </footer>
          </main>
        </div>

        <MobileBottomNav currentPage={currentRoute.id} />
        <AdminShortcuts />
      </div>
    </AdminShellContext.Provider>
  );
}

/** Persistent parent route for every authenticated admin workspace page. */
export function AdminWorkspaceShell() {
  return <AdminWorkspaceFrame><Outlet /></AdminWorkspaceFrame>;
}

/**
 * Compatibility wrapper for existing admin pages. Inside AdminWorkspaceShell it
 * returns only the page body, so legacy modules cannot create a second shell.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const isInsidePersistentShell = useContext(AdminShellContext);
  return isInsidePersistentShell ? <>{children}</> : <AdminWorkspaceFrame>{children}</AdminWorkspaceFrame>;
}
