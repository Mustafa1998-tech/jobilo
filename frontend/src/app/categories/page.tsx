'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Code2, Palette, PenTool, BarChart3, Camera, Globe, BookOpen, Music, ShoppingBag, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { icon: Code2, name: 'برمجة وتطوير', desc: 'تطوير مواقع، تطبيقات، أنظمة', count: 120 },
  { icon: Palette, name: 'تصميم', desc: 'UX/UI، شعارات، جرافيك', count: 85 },
  { icon: PenTool, name: 'كتابة وتحرير', desc: 'محتوى، تدقيق، ترجمة', count: 64 },
  { icon: BarChart3, name: 'تسويق ومبيعات', desc: 'SEO، إعلانات، تواصل اجتماعي', count: 92 },
  { icon: Camera, name: 'فيديو وصور', desc: 'مونتاج، تصوير، أنيميشن', count: 47 },
  { icon: Globe, name: 'تقنية معلومات', desc: 'شبكات، سيرفرات، أمن معلومات', count: 38 },
  { icon: BookOpen, name: 'تدريس واستشارات', desc: 'دروس خصوصية، استشارات مهنية', count: 55 },
  { icon: Music, name: 'صوتيات وموسيقى', desc: 'إنتاج صوتي، تلحين، غناء', count: 28 },
  { icon: ShoppingBag, name: 'متاجر إلكترونية', desc: 'إدارة متاجر، دروبشيبينغ', count: 43 },
  { icon: GraduationCap, name: 'إدخال بيانات', desc: 'إدخال، نسخ، تنظيم بيانات', count: 71 },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">التصنيفات</h1>
          <p className="mt-1 text-sm text-gray-500">تصفح جميع التصنيفات المتاحة على المنصة</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={`/projects?category=${cat.name}`} className="flex items-center gap-4 rounded-md border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50">
                  <Icon size={18} className="text-primary-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.desc}</p>
                </div>
                <span className="mr-auto text-xs text-gray-400">{cat.count} مشروع</span>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
