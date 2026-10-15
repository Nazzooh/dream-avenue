import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  ClipboardList, 
  MoreHorizontal 
} from 'lucide-react';
import { useAdminGuard } from '../../src/hooks/useAdminGuard';
import { can } from '../../src/lib/adminPermissions';

interface MobileBottomNavProps {
  currentPage: string;
}

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'packages', label: 'Packages', icon: Package, path: '/admin/packages', permission: 'content' },
  { id: 'bookings', label: 'Bookings', icon: ClipboardList, path: '/admin/bookings', permission: 'operations' },
  { id: 'requests', label: 'Requests', icon: ClipboardList, path: '/admin/requests', permission: 'access' },
  { id: 'partners', label: 'Partners', icon: MoreHorizontal, path: '/admin/partners', permission: 'partners' },
];

export function MobileBottomNav({ currentPage }: MobileBottomNavProps) {
  const { profile } = useAdminGuard();
  return (
    <nav className="mobile-bottom-nav">
      {navItems.filter((item) => !item.permission || can(profile?.role, item.permission as any)).map(item => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
