'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { href: '/projects', label: 'المشاريع' },
    { href: '/freelancers', label: 'المستقلون' },
    { href: '/companies', label: 'الشركات' },
    { href: '/categories', label: 'التصنيفات' },
    { href: '/about', label: 'عن المنصة' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-base font-bold text-gray-900 tracking-tight">Jobilo</Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                  {user.email?.charAt(0).toUpperCase() || 'م'}
                </div>
                <span className="text-gray-700">{user.email?.split('@')[0] || 'مستخدم'}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-44 rounded-md border border-gray-100 bg-white py-1 shadow-sm">
                  <Link
                    href={user.role === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer'}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard size={14} />
                    لوحة التحكم
                  </Link>
                  <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                    <User size={14} />
                    الملف الشخصي
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                    <Settings size={14} />
                    الإعدادات
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={14} />
                    تسجيل خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">تسجيل الدخول</Link>
              <Link href="/register" className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors">حساب جديد</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={18} className="text-gray-600" /> : <Menu size={18} className="text-gray-600" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <hr className="my-1 border-gray-100" />
            {isAuthenticated ? (
              <>
                <Link href={user?.role === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer'} className="rounded px-2 py-1 text-sm text-primary-600" onClick={() => setMobileOpen(false)}>
                  لوحة التحكم
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded px-2 py-1 text-left text-sm text-red-600">
                  تسجيل خروج
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded px-2 py-1 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>تسجيل الدخول</Link>
                <Link href="/register" className="rounded px-2 py-1 text-sm text-primary-600 font-medium" onClick={() => setMobileOpen(false)}>حساب جديد</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
