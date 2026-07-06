'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Search, Filter, MapPin, Clock, DollarSign, ChevronDown, X } from 'lucide-react';

const allCategories = ['الكل', 'برمجة وتطوير', 'تصميم', 'كتابة وتحرير', 'تسويق', 'فيديو وصور', 'تقنية معلومات'];
const allBudgets = ['الكل', 'أقل من $500', '$500 - $1000', '$1000 - $3000', '$3000 - $5000', '+$5000'];
const allSkills = ['React', 'Python', 'Node.js', 'UI/UX', 'SEO', 'WordPress', 'Laravel', 'Flutter'];

const MOCK_PROJECTS = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  title: ['تطبيق جوال', 'تصميم موقع', 'تطوير API', 'لوحة إدارة', 'متجر إلكتروني', 'تطبيق دليفري', 'نظام محاسبي', 'منصة تعليمية', 'Chatbot', 'تطبيق صحي', 'منصة عقارات', 'نظام موارد بشرية'][i],
  description: 'مطلوب مطور محترف لبناء تطبيق متكامل باستخدام أحدث التقنيات مع التركيز على الأداء وتجربة المستخدم.',
  budget: [1500, 800, 3000, 5000, 2500, 4000, 6000, 3500, 1200, 2800, 4500, 7000][i],
  category: allCategories[(i % 6) + 1],
  skills: [['React', 'Node.js'], ['Figma', 'UI/UX'], ['Python', 'Django'], ['React', 'TypeScript'], ['Shopify', 'Laravel'], ['Flutter', 'Firebase'], ['Python', 'Django'], ['React', 'Node.js'], ['Python', 'NLP'], ['Flutter', 'Firebase'], ['React', 'Node.js'], ['Laravel', 'Vue.js']][i],
  location: ['مصر', 'السعودية', 'الإمارات', 'الأردن', 'عالمي', 'مصر', 'السعودية', 'عالمي', 'الإمارات', 'مصر', 'عالمي', 'السعودية'][i],
  proposals: [5, 12, 3, 8, 6, 4, 2, 10, 7, 9, 1, 15][i],
  date: ['2026-06-30', '2026-06-29', '2026-06-28', '2026-06-27', '2026-06-26', '2026-06-25', '2026-06-24', '2026-06-23', '2026-06-22', '2026-06-21', '2026-06-20', '2026-06-19'][i],
  type: ['مشروع محدد', 'مشروع محدد', 'مشروع محدد', 'مشروع محدد', 'مشروع محدد', 'مشروع محدد', 'مشروع محدد', 'مشروع محدد', 'مشروع محدد', 'مشروع محدد', 'مشروع محدد', 'مشروع محدد'][i],
  rating: [4.8, 4.5, 4.9, 4.2, 4.7, 4.4, 5.0, 4.6, 4.3, 4.1, 4.8, 4.5][i],
}));

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('الكل');
  const [budget, setBudget] = useState('الكل');
  const [skillFilter, setSkillFilter] = useState('الكل');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MOCK_PROJECTS.filter((p) => {
    if (search && !p.title.includes(search) && !p.description.includes(search)) return false;
    if (category !== 'الكل' && p.category !== category) return false;
    if (skillFilter !== 'الكل' && !p.skills.includes(skillFilter)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-base font-bold text-gray-900">المشاريع</h1>
            <p className="text-xs text-gray-500">{filtered.length} مشروع متاح</p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
            <Filter size={13} />
            فلترة
            <ChevronDown size={12} className={`transition ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث عن مشاريع..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white py-2 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
          />
        </div>

        {showFilters && (
          <div className="mb-4 rounded-md border border-gray-200 bg-white p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">التصنيف</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs text-gray-700 focus:border-primary-500 focus:outline-none">
                  {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">الميزانية</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs text-gray-700 focus:border-primary-500 focus:outline-none">
                  {allBudgets.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">المهارة</label>
                <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs text-gray-700 focus:border-primary-500 focus:outline-none">
                  <option value="الكل">الكل</option>
                  {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => { setCategory('الكل'); setBudget('الكل'); setSkillFilter('الكل'); setSearch(''); }} className="mt-2 text-xs text-primary-600 hover:underline">
              مسح الكل
            </button>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="rounded-md border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-sm font-semibold text-gray-900">{project.title}</h3>
                <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[10px] text-primary-700">{project.category}</span>
              </div>
              <p className="mb-3 text-xs text-gray-500 leading-relaxed line-clamp-2">{project.description}</p>
              <div className="mb-3 flex flex-wrap gap-1">
                {project.skills.map((skill) => (
                  <span key={skill} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{skill}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><DollarSign size={12} />${project.budget.toLocaleString()}</span>
                <span className="flex items-center gap-1"><MapPin size={12} />{project.location}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{project.proposals} عرض</span>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-sm text-gray-400">
              لا توجد مشاريع تطابق معايير البحث
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
