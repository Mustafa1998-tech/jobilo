'use client';

import { useState } from 'react';
import { Camera, Save, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SkillSuggest } from '@/components/shared/skill-suggest';

const MOCK_USER = {
  firstName: 'أحمد', lastName: 'محمد', email: 'ahmed@example.com',
  bio: 'مطور واجهات أمامية بخبرة 5 سنوات في React و Next.js',
  skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  hourlyRate: 35, location: 'القاهرة، مصر',
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(MOCK_USER);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'الاسم الأول مطلوب';
    if (!form.lastName.trim()) errs.lastName = 'الاسم الأخير مطلوب';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSavePassword = () => {
    const errs: Record<string, string> = {};
    if (!passwords.current) errs.current = 'كلمة المرور الحالية مطلوبة';
    if (!passwords.newPass || passwords.newPass.length < 6) errs.newPass = 'يجب أن تكون 6 أحرف على الأقل';
    if (passwords.newPass !== passwords.confirm) errs.confirm = 'كلمة المرور غير متطابقة';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaved(true);
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setSaved(false), 3000);
  };

  const addSkill = (skill: string) => {
    if (!form.skills.includes(skill)) setForm((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
  };
  const removeSkill = (skill: string) => setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));

  const tabs = [
    { key: 'profile', label: 'الملف الشخصي' },
    { key: 'password', label: 'كلمة المرور' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-lg font-semibold text-gray-900">الملف الشخصي</h1>

        <div className="mb-4 flex gap-1 rounded border border-gray-200 bg-white p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setErrors({}); }}
              className={cn(
                'flex-1 rounded py-1.5 text-xs font-medium transition',
                activeTab === tab.key ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {saved && (
          <div className="mb-3 flex items-center gap-1.5 rounded border border-green-200 bg-green-50 p-2.5 text-xs text-green-700">
            <CheckCircle2 size={14} />
            تم الحفظ بنجاح
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4 rounded border border-gray-200 bg-white p-5">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <label className="relative cursor-pointer">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-lg font-medium text-gray-600">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : 'أ'}
                </div>
                <div className="absolute bottom-0 right-0 rounded-full bg-primary-600 p-1">
                  <Camera size={12} className="text-white" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              <div className="text-center sm:text-right">
                <p className="text-sm font-semibold text-gray-900">{form.firstName} {form.lastName}</p>
                <p className="text-xs text-gray-400">{form.email}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'الاسم الأول', value: form.firstName, field: 'firstName' },
                { label: 'الاسم الأخير', value: form.lastName, field: 'lastName' },
              ].map(({ label, value, field }) => (
                <div key={field}>
                  <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
                  <input value={value} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" />
                  {errors[field] && <p className="mt-0.5 text-[11px] text-red-500">{errors[field]}</p>}
                </div>
              ))}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">نبذة عني</label>
              <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">المهارات</label>
              <SkillSuggest selected={form.skills} onAdd={addSkill} onRemove={removeSkill} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">سعر الساعة ($)</label>
                <input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: +e.target.value })}
                  className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">الموقع</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" />
              </div>
            </div>

            <button onClick={handleSaveProfile} className="flex items-center gap-1.5 rounded bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700">
              <Save size={14} />
              حفظ التغييرات
            </button>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="space-y-3 rounded border border-gray-200 bg-white p-5">
            {['current', 'newPass', 'confirm'].map((field) => (
              <div key={field}>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  {field === 'current' ? 'كلمة المرور الحالية' : field === 'newPass' ? 'كلمة المرور الجديدة' : 'تأكيد كلمة المرور الجديدة'}
                </label>
                <input type="password" value={passwords[field as keyof typeof passwords]}
                  onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                  className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" />
                {errors[field] && <p className="mt-0.5 text-[11px] text-red-500">{errors[field]}</p>}
              </div>
            ))}
            <button onClick={handleSavePassword} className="flex items-center gap-1.5 rounded bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700">
              <Save size={14} />
              تغيير كلمة المرور
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
