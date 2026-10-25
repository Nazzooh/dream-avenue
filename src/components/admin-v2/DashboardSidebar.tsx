// src/components/admin-v2/DashboardSidebar.tsx — Redesigned Warm Editorial Luxury Sidebar
import logoImage from '../../assets/b9e63ce206aa68d0d57227942230badde2fa6a6b.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/auth/useAuth';
import { 
  LayoutDashboard, 
  Package, 
  Building2, 
  Image as ImageIcon, 
  CalendarCheck, 
  ClipboardList, 
  BookOpen,
  LogOut,
  X,
  User,
  UserPlus,
  TrendingUp,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Users,
  ExternalLink
} from 'lucide-react';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { can, roleLabel } from '../../src/lib/adminPermissions';

interface DashboardSidebarProps {
  currentPage: string;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavSection {
  heading?: string;
  items: {
    id: string;
    label: string;
    icon: any;
    path: string;
    permission?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    heading: 'Venue & Content',
    items: [
      { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon, path: '/admin/gallery', permission: 'content' },
      { id: 'facilities', label: 'Venue Facilities', icon: Building2, path: '/admin/facilities', permission: 'content' },
      { id: 'packages', label: 'Packages & Pricing', icon: Package, path: '/admin/packages', permission: 'content' },
    ]
  },
  {
    heading: 'Operations',
    items: [
      { id: 'availability', label: 'Availability Calendar', icon: CalendarCheck, path: '/admin/availability', permission: 'operations' },
      { id: 'bookings', label: 'Bookings & Events', icon: BookOpen, path: '/admin/bookings', permission: 'operations' },
      { id: 'tasks', label: 'Team Tasks', icon: ClipboardList, path: '/admin/tasks', permission: 'tasks' },
    ]
  },
  {
    heading: 'Performance & Insights',
    items: [
      { id: 'analytics', label: 'Analytics & Trends', icon: TrendingUp, path: '/admin/analytics', permission: 'analytics' },
    ]
  },
  {
    heading: 'Administration',
    items: [
      { id: 'partners', label: 'Partner Network', icon: Users, path: '/admin/partners', permission: 'partners' },
      { id: 'requests', label: 'Access Requests', icon: UserPlus, path: '/admin/requests', permission: 'access' },
      { id: 'staff', label: 'Staff Directory', icon: Users, path: '/admin/staff', permission: 'access' },
      { id: 'activity', label: 'Security & Audit', icon: Terminal, path: '/admin/activity', permission: 'audit' },
    ]
  }
];

export function DashboardSidebar({ 
  currentPage, 
  isOpen, 
  onClose, 
  isCollapsed = false, 
  onToggleCollapse 
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useAdminGuard();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out of Dream Avenue Admin?')) {
      try {
        await signOut();
        navigate('/admin/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const userRole = profile?.role;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Luxury Redesigned Sidebar */}
      <aside 
        className={`admin-sidebar-luxury ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
      >
        {/* Brand Header */}
        <div className="sidebar-lux-brand flex items-center justify-between">
          <Link to="/admin/dashboard" className="sidebar-lux-logo-box flex items-center gap-3">
            <img
              src={logoImage}
              alt="Dream Avenue"
              className="sidebar-lux-logo-img"
              style={{ width: '36px', height: '36px', objectFit: 'contain' }}
            />
            {!isCollapsed && (
              <div className="sidebar-lux-brand-info">
                <h1 className="sidebar-lux-brand-title">Dream Avenue</h1>
                <span className="sidebar-lux-brand-tag">Venue Admin</span>
              </div>
            )}
          </Link>

          {/* Desktop Discreet Header Collapse Toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 transition-colors"
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav className="sidebar-lux-nav">
          {/* Prominent Overview Hero Card */}
          <div className="mb-3 px-1">
            <Link
              to="/admin/dashboard"
              className={`sidebar-lux-overview-hero ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => onClose()}
              title={isCollapsed ? 'Overview Dashboard' : undefined}
            >
              <LayoutDashboard className="sidebar-lux-overview-hero-icon" size={20} />
              {!isCollapsed && (
                <div className="flex flex-col text-left">
                  <span className="sidebar-lux-overview-hero-title">Overview</span>
                  <span className="sidebar-lux-overview-hero-sub">Workspace Command Center</span>
                </div>
              )}
            </Link>
          </div>
          {navSections.map((section, sIdx) => {
            const accessibleItems = section.items.filter(
              (item) => !item.permission || can(userRole, item.permission as any)
            );

            if (accessibleItems.length === 0) return null;

            return (
              <div key={sIdx} className="mb-2">
                {!isCollapsed && section.heading && (
                  <p className="sidebar-lux-nav-heading">{section.heading}</p>
                )}
                {accessibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`sidebar-lux-link ${isActive ? 'active' : ''}`}
                      onClick={() => onClose()}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="sidebar-lux-link-icon" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer with User Card and Controls */}
        <div className="sidebar-lux-footer">
          {/* User profile card */}
          {!isCollapsed ? (
            <div className="sidebar-lux-user-card">
              <div className="sidebar-lux-user-avatar-icon">
                <User size={18} className="text-stone-700" />
              </div>
              <div className="sidebar-lux-user-info">
                <span className="sidebar-lux-user-role">{roleLabel(userRole)}</span>
                <span className="sidebar-lux-user-email" title={user?.email || profile?.email || ''}>
                  {user?.email || profile?.email || 'admin@dreamavenue.com'}
                </span>
              </div>
            </div>
          ) : (
            <div 
              className="sidebar-lux-user-avatar-icon mx-auto mb-2" 
              title={`${roleLabel(userRole)} (${user?.email || profile?.email || 'Admin'})`}
            >
              <User size={18} className="text-stone-700" />
            </div>
          )}

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="sidebar-lux-action-btn logout"
            title={isCollapsed ? 'Log Out' : undefined}
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
