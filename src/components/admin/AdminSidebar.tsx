/**
 * AdminSidebar Component
 * 
 * Navigation sidebar for admin panel.
 * Provides quick access to all admin functions.
 * 
 * @component
 * @category Admin
 */

import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Image,
  DollarSign,
  MessageSquare,
  Flag,
  Settings,
  BarChart3,
  Shield,
  Bell,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: '/admin/panel',
  },
  {
    label: 'Kullanıcı Yönetimi',
    icon: <Users className="w-5 h-5" />,
    href: '/admin/users',
  },
  {
    label: 'İlan Yönetimi',
    icon: <UserCheck className="w-5 h-5" />,
    href: '/admin/listings',
    badge: 5,
  },
  {
    label: 'Medya Moderasyonu',
    icon: <Image className="w-5 h-5" />,
    href: '/admin/media',
    badge: 12,
  },
  {
    label: 'Finansal Raporlar',
    icon: <DollarSign className="w-5 h-5" />,
    href: '/admin/financial',
  },
  {
    label: 'Mesajlar',
    icon: <MessageSquare className="w-5 h-5" />,
    href: '/admin/messages',
    badge: 3,
  },
  {
    label: 'Şikayetler',
    icon: <Flag className="w-5 h-5" />,
    href: '/admin/reports',
    badge: 8,
  },
  {
    label: 'Analitik',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/admin/analytics',
  },
  {
    label: 'Güvenlik',
    icon: <Shield className="w-5 h-5" />,
    href: '/admin/security',
  },
  {
    label: 'Bildirimler',
    icon: <Bell className="w-5 h-5" />,
    href: '/admin/notifications',
  },
  {
    label: 'Ayarlar',
    icon: <Settings className="w-5 h-5" />,
    href: '/admin/settings',
  },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin/panel" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500">Yönetim Paneli</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                'hover:bg-gray-100',
                isActive
                  ? 'bg-pink-50 text-pink-600 font-medium'
                  : 'text-gray-700'
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
              
              {item.badge && item.badge > 0 && (
                <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
