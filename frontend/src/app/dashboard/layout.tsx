'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth-store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-bold text-gray-900">Jobilo</Link>
            <nav className="hidden items-center gap-4 md:flex">
              <Link href="/projects" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">المشاريع</Link>
              <Link href="/messages" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">الرسائل</Link>
              {user?.role === 'CLIENT' ? (
                <Link href="/post-project" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">نشر مشروع</Link>
              ) : (
                <Link href="/proposals" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">عروضي</Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">
              {user?.role === 'CLIENT' ? 'عميل' : 'مستقل'}
            </span>
            <button onClick={() => logout()} className="rounded border border-gray-200 px-2.5 py-0.5 text-gray-500 hover:bg-gray-50 transition-colors">
              تسجيل خروج
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  );
}
