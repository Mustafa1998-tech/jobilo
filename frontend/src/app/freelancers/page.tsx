'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockFreelancers = [
  { id: '1', name: 'أحمد محمد', title: 'مطور واجهات أمامية', rating: 4.8, skills: ['React', 'Next.js', 'TypeScript'], rate: '$25/ساعة' },
  { id: '2', name: 'سارة خالد', title: 'مصممة UI/UX', rating: 4.9, skills: ['Figma', 'Adobe XD', 'تصميم واجهات'], rate: '$30/ساعة' },
  { id: '3', name: 'محمد علي', title: 'مطور Full Stack', rating: 4.7, skills: ['Node.js', 'React', 'MongoDB'], rate: '$35/ساعة' },
  { id: '4', name: 'نورة عبدالله', title: 'محللة بيانات', rating: 4.6, skills: ['Python', 'SQL', 'تحليل بيانات'], rate: '$28/ساعة' },
  { id: '5', name: 'خالد عمر', title: 'خبير تسويق رقمي', rating: 4.5, skills: ['Google Ads', 'SEO', 'سوشيال ميديا'], rate: '$22/ساعة' },
  { id: '6', name: 'لينا حسن', title: 'كاتبة محتوى', rating: 4.8, skills: ['كتابة محتوى', 'ترجمة', 'تدقيق لغوي'], rate: '$20/ساعة' },
];

export default function FreelancersPage() {
  const [search, setSearch] = useState('');

  const filtered = search
    ? mockFreelancers.filter(f =>
        f.name.includes(search) || f.title.includes(search) || f.skills.some(s => s.includes(search))
      )
    : mockFreelancers;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-primary-600">Jobilo</Link>
          <nav className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/projects" className="hover:text-primary-600">المشاريع</Link>
            <Link href="/" className="hover:text-primary-600">الرئيسية</Link>
          </nav>
          <Link href="/login" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">دخول</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">المستقلون</h2>
          <p className="text-sm text-gray-500">{filtered.length} مستقل متاح</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن مستقل..."
            className="w-full max-w-md rounded-lg border px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <div key={f.id} className="rounded-xl border bg-white p-6 transition hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-600">
                  {f.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{f.name}</h3>
                  <p className="text-sm text-gray-500">{f.title}</p>
                </div>
              </div>

              <div className="mb-1 flex items-center gap-1 text-sm">
                <span className="text-yellow-500">★</span>
                <span className="text-gray-700">{f.rating}</span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {f.skills.map((skill) => (
                  <span key={skill} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{skill}</span>
                ))}
              </div>

              <div className="border-t pt-3 text-sm font-medium text-primary-600">{f.rate}</div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border bg-white p-12 text-center">
            <h3 className="text-lg font-semibold">لا يوجد مستقلون يطابقون بحثك</h3>
            <p className="mt-2 text-sm text-gray-500">جرب استخدام كلمات بحث مختلفة</p>
          </div>
        )}
      </main>
    </div>
  );
}
