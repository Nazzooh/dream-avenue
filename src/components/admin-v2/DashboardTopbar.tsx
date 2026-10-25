// src/components/admin-v2/DashboardTopbar.tsx — Redesigned Warm Editorial Luxury Topbar
import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ExternalLink, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../../src/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../src/hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { roleLabel } from '../../src/lib/adminPermissions';

interface DashboardTopbarProps {
  pageTitle: string;
  onMenuClick: () => void;
}

export function DashboardTopbar({ pageTitle, onMenuClick }: DashboardTopbarProps) {
  const { user, signOut } = useAuth();
  const { profile } = useAdminGuard();
  const navigate = useNavigate();

  // Notification state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // User Profile dropdown state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { unreadCount } = useNotifications();

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setIsNotificationOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="admin-topbar-luxury">
      {/* Left: Mobile Menu + Breadcrumbs & Page Title */}
      <div className="topbar-lux-left">
        <button
          onClick={onMenuClick}
          className="topbar-lux-menu-btn lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="topbar-lux-title-wrap">
          <div className="topbar-lux-breadcrumbs">
            <span>Dream Avenue</span>
            <span style={{ opacity: 0.5 }}>/</span>
            <span>Workspace</span>
          </div>
          <h2 className="topbar-lux-title">{pageTitle}</h2>
        </div>
      </div>

      {/* Right: Status, Notifications, Website Link & Profile */}
      <div className="topbar-lux-right">
        {/* Live Venue Status Pill (Desktop) */}
        <div className="topbar-lux-status-pill hidden md:inline-flex">
          <span className="topbar-lux-status-dot" />
          <span>Venue Active</span>
        </div>

        {/* Visit Live Website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="topbar-lux-action-btn hidden sm:inline-flex"
          title="Open live venue website in new tab"
        >
          <ExternalLink size={15} />
          <span>Live Site</span>
        </a>

        {/* Notifications Center */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="topbar-lux-notif-btn"
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="topbar-lux-notif-badge" />}
          </button>

          {isNotificationOpen && (
            <NotificationDropdown
              onClose={() => setIsNotificationOpen(false)}
              onViewAllBookings={() => {
                setIsNotificationOpen(false);
                navigate('/admin/bookings');
              }}
            />
          )}
        </div>

        {/* Interactive User Profile Dropdown */}
        <div ref={profileMenuRef} className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`topbar-lux-profile-trigger ${isProfileMenuOpen ? 'active' : ''}`}
            aria-expanded={isProfileMenuOpen}
            aria-label="User account menu"
          >
            <div className="topbar-lux-user-avatar">
              <User size={16} className="text-stone-700" />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-stone-900 leading-tight">
                {roleLabel(userRole)}
              </span>
              <span className="text-[11px] text-stone-500 leading-tight truncate max-w-[150px]">
                {user?.email || profile?.email || 'admin@dreamavenue.com'}
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-stone-400 hidden sm:block transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="topbar-lux-profile-dropdown" role="menu">
              <div className="topbar-lux-dropdown-footer topbar-lux-dropdown-footer-only">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    handleLogout();
                  }}
                  className="topbar-lux-dropdown-logout"
                  role="menuitem"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
