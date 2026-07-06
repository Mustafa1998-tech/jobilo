'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Briefcase, FileText, Scale, Flag,
  CreditCard, DollarSign, FileEdit, Settings, Shield, History,
  BarChart3, Lock, ChevronLeft, Menu, Bell, LogOut, Package,
} from 'lucide-react';
import { useAdminAuthStore } from '@/lib/store/admin-auth-store';

const menuItems = [
  { label: 'لوحة التحكم', icon: LayoutDashboard, href: '/admin' },
  { label: 'المستخدمين', icon: Users, href: '/admin/users' },
  { label: 'المشاريع', icon: Briefcase, href: '/admin/projects' },
  { label: 'العروض', icon: FileText, href: '/admin/proposals' },
  { label: 'النزاعات', icon: Scale, href: '/admin/disputes' },
  { label: 'البلاغات', icon: Flag, href: '/admin/reports' },
  { label: 'الباقات', icon: Package, href: '/admin/subscriptions' },
  { label: 'المحتوى', icon: FileEdit, href: '/admin/content' },
  { label: 'المهارات', icon: FileEdit, href: '/admin/skills' },
  { label: 'الإعدادات', icon: Settings, href: '/admin/settings' },
  { label: 'الأدوار', icon: Shield, href: '/admin/roles' },
  { label: 'السجلات', icon: History, href: '/admin/logs' },
  { label: 'التحليلات', icon: BarChart3, href: '/admin/analytics' },
  { label: 'الأمان', icon: Lock, href: '/admin/security' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, isAuthenticated, isLoading, checkAuth, logout } = useAdminAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin-login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/10 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white border-l border-gray-200 transition-all duration-300 lg:static ${sidebarOpen ? 'w-56' : 'w-14'} ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-12 items-center justify-between border-b border-gray-100 px-3">
          {sidebarOpen && <span className="text-sm font-bold text-gray-900">Jobilo</span>}
          <button onClick={() => { setSidebarOpen(!sidebarOpen); setMobileOpen(false); }} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            {sidebarOpen ? <ChevronLeft size={15} /> : <Menu size={15} />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <button
                key={item.label}
                onClick={() => { router.push(item.href); setMobileOpen(false); }}
                className={`flex w-full items-center gap-3 rounded px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={16} className="shrink-0" />
                {sidebarOpen && <span className="flex-1 text-right">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-12 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4">
          <button onClick={() => setMobileOpen(true)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden">
            <Menu size={16} />
          </button>
          <div className="flex-1" />
          <button className="relative rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Bell size={16} />
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-gray-900">3</span>
          </button>
          <div className="flex items-center gap-2 pr-2">
            <div className="text-left">
              <p className="text-xs font-medium text-gray-900">{admin?.profile?.firstName} {admin?.profile?.lastName}</p>
              <p className="text-[10px] text-gray-400">{admin?.role === 'SUPER_ADMIN' ? 'مدير النظام' : admin?.role}</p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
              {admin?.profile?.firstName?.[0] || 'A'}
            </div>
          </div>
          <button onClick={() => logout()} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500" title="تسجيل خروج">
            <LogOut size={16} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
