'use client';

import { useState } from 'react';
import { X, Eye, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = ['تطوير مواقع', 'تطبيقات جوال', 'تصميم', 'كتابة وتحرير', 'تسويق', 'تحليل بيانات', 'دعم فني', 'أخرى'];

const SKILLS_LIST = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'PHP',
  'UI/UX', 'Figma', 'Photoshop', 'SEO', 'WordPress', 'Laravel', 'Flutter',
  'React Native', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL',
];

const EXPERIENCE_LEVELS = ['مبتدئ', 'متوسط', 'خبير'];

export default function PostProjectPage() {
  const [step, setStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '', skills: [] as string[],
    projectType: 'fixed', minBudget: '', maxBudget: '', duration: '',
    experienceLevel: '', location: '', nda: false, urgent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const { [field]: _, ...rest } = prev; return rest; });
  };

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }));
  };

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!form.title.trim()) errs.title = 'عنوان المشروع مطلوب';
      if (!form.description.trim()) errs.description = 'وصف المشروع مطلوب';
      if (!form.category) errs.category = 'يرجى اختيار تصنيف';
      if (form.skills.length === 0) errs.skills = 'اختر مهارة واحدة على الأقل';
    }
    if (s === 1) {
      if (!form.projectType) errs.projectType = 'يرجى اختيار نوع المشروع';
      if (!form.minBudget) errs.minBudget = 'الميزانية الدنيا مطلوبة';
      if (!form.maxBudget) errs.maxBudget = 'الميزانية القصوى مطلوبة';
      if (!form.duration) errs.duration = 'مدة المشروع مطلوبة';
      if (!form.experienceLevel) errs.experienceLevel = 'يرجى اختيار مستوى الخبرة';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const sections = [
    { title: 'المعلومات الأساسية', subtitle: 'أدخل تفاصيل مشروعك' },
    { title: 'الميزانية والمدة', subtitle: 'حدد الميزانية والمدة الزمنية' },
    { title: 'تفاصيل إضافية', subtitle: 'معلومات إضافية عن المشروع' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-1 text-lg font-semibold text-gray-900">نشر مشروع جديد</h1>
        <p className="mb-6 text-xs text-gray-400">املأ التفاصيل أدناه لنشر مشروعك والحصول على عروض من المستقلين</p>

        <div className="mb-6 flex items-center gap-2">
          {[0, 1, 2].map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={cn('flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium transition', step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500')}>
                {s + 1}
              </div>
              <span className={cn('text-xs', step >= s ? 'text-gray-900' : 'text-gray-400')}>{sections[s].title}</span>
              {s < 2 && <ChevronLeft size={12} className="text-gray-300" />}
            </div>
          ))}
        </div>

        <div className="rounded border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">{sections[step].title}</h2>
          <p className="mb-4 text-xs text-gray-400">{sections[step].subtitle}</p>

          {step === 0 && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">عنوان المشروع</label>
                <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="مثال: تطوير موقع إلكتروني متكامل"
                  className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none" />
                {errors.title && <p className="mt-0.5 text-[11px] text-red-500">{errors.title}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">وصف المشروع</label>
                <textarea rows={5} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="اشرح بالتفصيل ما تريد تنفيذه..."
                  className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none" />
                {errors.description && <p className="mt-0.5 text-[11px] text-red-500">{errors.description}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">التصنيف</label>
                <select value={form.category} onChange={(e) => update('category', e.target.value)}
                  className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none">
                  <option value="">اختر تصنيفاً</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="mt-0.5 text-[11px] text-red-500">{errors.category}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">المهارات المطلوبة</label>
                <div className="flex flex-wrap gap-1.5">
                  {SKILLS_LIST.map((skill) => (
                    <button key={skill} onClick={() => toggleSkill(skill)}
                      className={cn('rounded px-2 py-0.5 text-[11px] transition', form.skills.includes(skill) ? 'bg-primary-50 text-primary-700 border border-primary-200' : 'border border-gray-200 text-gray-500 hover:border-gray-300')}>
                      {skill}
                    </button>
                  ))}
                </div>
                {errors.skills && <p className="mt-0.5 text-[11px] text-red-500">{errors.skills}</p>}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">نوع المشروع</label>
                <div className="flex gap-2">
                  {['fixed', 'hourly'].map((type) => (
                    <button key={type} onClick={() => update('projectType', type)}
                      className={cn('flex-1 rounded border py-2 text-xs font-medium transition', form.projectType === type ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300')}>
                      {type === 'fixed' ? 'مشروع بسعر ثابت' : 'بالساعة'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">الميزانية الدنيا ($)</label>
                  <input type="number" value={form.minBudget} onChange={(e) => update('minBudget', e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" />
                  {errors.minBudget && <p className="mt-0.5 text-[11px] text-red-500">{errors.minBudget}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">الميزانية القصوى ($)</label>
                  <input type="number" value={form.maxBudget} onChange={(e) => update('maxBudget', e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" />
                  {errors.maxBudget && <p className="mt-0.5 text-[11px] text-red-500">{errors.maxBudget}</p>}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">مدة المشروع (بالأيام)</label>
                <input type="number" value={form.duration} onChange={(e) => update('duration', e.target.value)} placeholder="مثال: 30"
                  className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none" />
                {errors.duration && <p className="mt-0.5 text-[11px] text-red-500">{errors.duration}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">مستوى الخبرة</label>
                <div className="flex gap-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button key={level} onClick={() => update('experienceLevel', level)}
                      className={cn('flex-1 rounded border py-2 text-xs font-medium transition', form.experienceLevel === level ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300')}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">الموقع (اختياري)</label>
                <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="مثال: الرياض، السعودية"
                  className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none" />
              </div>
              {[
                { key: 'nda', label: 'يتطلب توقيع NDA' },
                { key: 'urgent', label: 'مشروع عاجل' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">{label}</span>
                  <button onClick={() => update(key, !(form as any)[key])}
                    className={cn('relative h-5 w-9 rounded-full transition', (form as any)[key] ? 'bg-primary-600' : 'bg-gray-200')}>
                    <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition', (form as any)[key] ? 'right-[18px]' : 'right-[2px]')} />
                  </button>
                </div>
              ))}
              <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                <Eye size={12} />
                {showPreview ? 'إخفاء المعاينة' : 'معاينة المشروع'}
              </button>
              {showPreview && (
                <div className="rounded border border-gray-200 bg-gray-50 p-3">
                  <h3 className="text-sm font-semibold text-gray-900">{form.title || '(بدون عنوان)'}</h3>
                  <p className="mt-1 text-xs text-gray-500">{form.description || '(بدون وصف)'}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {form.skills.map((s) => <span key={s} className="rounded bg-primary-50 px-1.5 py-0.5 text-[10px] text-primary-700">{s}</span>)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-400">
                    {form.category && <span>التصنيف: {form.category}</span>}
                    {form.minBudget && <span>الميزانية: ${form.minBudget} - ${form.maxBudget}</span>}
                    {form.duration && <span>المدة: {form.duration} يوم</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
            {step > 0 ? (
              <button onClick={() => setStep((s) => s - 1)} className="rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                السابق
              </button>
            ) : <div />}
            {step < 2 ? (
              <button onClick={() => { if (validateStep(step)) setStep((s) => s + 1); }} className="rounded bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700">
                التالي
              </button>
            ) : (
              <button onClick={() => {}} className="rounded bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700">
                نشر المشروع
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
