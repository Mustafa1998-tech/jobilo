import Link from 'next/link';
import { Home } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '404 - الصفحة غير موجودة | Jobilo' };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary-600">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">الصفحة غير موجودة</h1>
        <p className="mt-2 text-gray-500">عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <Home size={16} />
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  );
}