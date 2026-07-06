'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Search, MapPin, Briefcase, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const companies = [
  { id: '1', name: 'تقنية المستقبل', field: 'برمجة وتطوير', location: 'الرياض، السعودية', rate: 4.8, projects: 45, employees: 120, desc: 'شركة تقنية رائدة في تطوير الحلول البرمجية المبتكرة للشركات.' },
  { id: '2', name: 'إبداع للتصميم', field: 'تصميم', location: 'دبي، الإمارات', rate: 4.6, projects: 32, employees: 28, desc: 'وكالة تصميم متخصصة في الهوية البصرية وتجربة المستخدم.' },
  { id: '3', name: 'كتابة', field: 'كتابة وتحرير', location: 'القاهرة، مصر', rate: 4.9, projects: 78, employees: 15, desc: 'فريق متخصص في كتابة المحتوى التسويقي والترجمة الاحترافية.' },
  { id: '4', name: 'حلول التسويق', field: 'تسويق', location: 'جدة، السعودية', rate: 4.5, projects: 28, employees: 9, desc: 'استراتيجيات تسويق رقمي لتنمية أعمالك وزيادة مبيعاتك.' },
];

export default function CompaniesPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">الشركات</h1>
          <p className="mt-1 text-sm text-gray-500">تصفح الشركات المسجلة على المنصة</p>
        </div>

        <div className="relative mb-6 max-w-sm">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="ابحث عن شركة..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-200 py-2 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {companies.filter((c) => c.name.includes(search) || c.field.includes(search)).map((company) => (
            <div key={company.id} className="rounded-md border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-sm font-bold text-primary-700">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{company.name}</h3>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={12} />{company.location}</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-amber-600"><Star size={12} />{company.rate}</span>
              </div>
              <p className="mb-3 text-xs text-gray-500">{company.desc}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Briefcase size={12} />{company.projects} مشروع</span>
                <span>{company.employees} موظف</span>
                <span className="mr-auto rounded bg-primary-50 px-2 py-0.5 text-primary-700">{company.field}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
