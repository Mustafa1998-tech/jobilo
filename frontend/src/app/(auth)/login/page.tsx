'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      const { user } = useAuthStore.getState();
      if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
        router.push('/admin');
      } else if (user?.role === 'CLIENT') {
        router.push('/dashboard/client');
      } else {
        router.push('/dashboard/freelancer');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'فشل تسجيل الدخول. تحقق من بياناتك.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Jobilo
          </Link>
          <p className="mt-0.5 text-sm text-gray-400">سجل دخولك وابدأ رحلة العمل الحر</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-md border border-gray-200 bg-white p-6">
          {error && (
            <div className="mb-3 rounded border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-gray-600">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-600">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 pl-8 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="أدخل كلمة المرور"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              تذكرني
            </label>
            <Link href="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-primary-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>

          <div className="mt-4 text-center text-xs text-gray-400">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
              إنشاء حساب جديد
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
