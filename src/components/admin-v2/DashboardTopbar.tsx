// src/components/admin-v2/DashboardTopbar.tsx — Redesigned Warm Editorial Luxury Topbar
import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ExternalLink, LogOut, ChevronDown, ShieldCheck, Terminal, User } from 'lucide-react';
import { useAuth } from '../../src/auth/useAuth';
import { useNavigate, Link } from 'react-router-dom';
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
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl transition-all border border-transparent hover:border-[#EAE6DF] hover:bg-white"
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
              <span className="text-[11px] text-stone-500 leading-tight truncate max-w-[140px]">
                {user?.email || profile?.email || 'admin@dreamavenue.com'}
              </span>
            </div>
            <ChevronDown size={14} className="text-stone-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl shadow-xl border p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'var(--lux-border)',
                boxShadow: 'var(--lux-shadow-lg)',
              }}
            >
              <div className="p-3 border-b border-stone-100 mb-1">
                <p className="text-xs uppercase tracking-wider text-stone-400 font-bold">Signed in as</p>
                <p className="text-sm font-bold text-stone-800 truncate mt-0.5">{user?.email || profile?.email || "Administrator"}</p>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mt-2 bg-stone-100 text-stone-700">
                  <ShieldCheck size={13} className="text-lime-700" />
                  <span>{roleLabel(userRole)}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <Link
                  to="/admin/activity"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-50 rounded-xl flex items-center gap-2.5 transition-colors"
                >
                  <Terminal size={15} />
                  <span>Audit & Activity Log</span>
                </Link>
              </div>

              <div className="pt-1 mt-1 border-t border-stone-100">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2.5 transition-colors"
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
