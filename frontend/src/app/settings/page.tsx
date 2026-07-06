'use client';

import { useState } from 'react';
import { Save, CheckCircle2, AlertTriangle, Bell, Shield, Eye, Trash2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type TabKey = 'general' | 'notifications' | 'privacy' | 'subscription' | 'account';

const MOCK_SETTINGS = {
  general: { firstName: 'أحمد', lastName: 'محمد', email: 'ahmed@example.com', phone: '+201234567890', location: 'القاهرة، مصر' },
  notifications: { email: true, push: true, sms: false, newProject: true, message: true, proposal: true },
  privacy: { showEmail: false, showProfile: true, onlineStatus: true },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'subscription') return 'subscription';
    }
    return 'general';
  });
  const [general, setGeneral] = useState(MOCK_SETTINGS.general);
  const [notifications, setNotifications] = useState(MOCK_SETTINGS.notifications);
  const [privacy, setPrivacy] = useState(MOCK_SETTINGS.privacy);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs: { key: TabKey; label: string; icon: typeof Bell }[] = [
    { key: 'general', label: 'عام', icon: Shield },
    { key: 'notifications', label: 'الإشعارات', icon: Bell },
    { key: 'privacy', label: 'الخصوصية', icon: Eye },
    { key: 'subscription', label: 'الاشتراك', icon: Package },
    { key: 'account', label: 'الحساب', icon: Trash2 },
  ];

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const toggleNotification = (key: keyof typeof MOCK_SETTINGS.notifications) => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  const togglePrivacy = (key: keyof typeof MOCK_SETTINGS.privacy) => setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-lg font-bold text-gray-900">الإعدادات</h1>

        <div className="mb-4 flex gap-1 overflow-x-auto rounded-md border border-gray-200 bg-white p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium whitespace-nowrap transition',
                  activeTab === tab.key ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-700',
                )}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {saved && (
          <div className="mb-3 flex items-center gap-1.5 rounded border border-green-200 bg-green-50 p-2.5 text-xs text-green-700">
            <CheckCircle2 size={14} />
            تم حفظ الإعدادات
          </div>
        )}

        {activeTab === 'general' && (
          <div className="space-y-3 rounded-md border border-gray-200 bg-white p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {[{ label: 'الاسم الأول', value: general.firstName, field: 'firstName' }, { label: 'الاسم الأخير', value: general.lastName, field: 'lastName' }].map(({ label, value, field }) => (
                <div key={field}>
                  <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
                  <input value={value} onChange={(e) => setGeneral({ ...general, [field]: e.target.value })}
                    className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" />
                </div>
              ))}
            </div>
            {[{ label: 'البريد الإلكتروني', value: general.email, field: 'email' }, { label: 'رقم الهاتف', value: general.phone, field: 'phone' }, { label: 'الموقع', value: general.location, field: 'location' }].map(({ label, value, field }) => (
              <div key={field}>
                <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
                <input value={value} onChange={(e) => setGeneral({ ...general, [field]: e.target.value })}
                  className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" />
              </div>
            ))}
            <button onClick={handleSave} className="flex items-center gap-1.5 rounded bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700">
              <Save size={14} />
              حفظ التغييرات
            </button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3 rounded-md border border-gray-200 bg-white p-5">
            {[
              { key: 'email' as const, label: 'الإشعارات عبر البريد الإلكتروني' },
              { key: 'push' as const, label: 'إشعارات التطبيق (Push)' },
              { key: 'sms' as const, label: 'التنبيهات عبر SMS' },
              { key: 'newProject' as const, label: 'مشاريع جديدة تناسب مهاراتي' },
              { key: 'message' as const, label: 'رسائل جديدة' },
              { key: 'proposal' as const, label: 'عروض مقدمة على مشاريعي' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-xs text-gray-700">{item.label}</span>
                <button onClick={() => toggleNotification(item.key)}
                  className={cn('relative h-5 w-9 rounded-full transition', notifications[item.key] ? 'bg-primary-600' : 'bg-gray-200')}>
                  <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition', notifications[item.key] ? 'right-[18px]' : 'right-[2px]')} />
                </button>
              </div>
            ))}
            <button onClick={handleSave} className="flex items-center gap-1.5 rounded bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700">
              <Save size={14} />
              حفظ الإعدادات
            </button>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-3 rounded-md border border-gray-200 bg-white p-5">
            {[
              { key: 'showEmail' as const, label: 'إظهار البريد الإلكتروني في الملف الشخصي' },
              { key: 'showProfile' as const, label: 'الملف الشخصي عام للجميع' },
              { key: 'onlineStatus' as const, label: 'إظهار حالة التواجد' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-xs text-gray-700">{item.label}</span>
                <button onClick={() => togglePrivacy(item.key)}
                  className={cn('relative h-5 w-9 rounded-full transition', privacy[item.key] ? 'bg-primary-600' : 'bg-gray-200')}>
                  <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition', privacy[item.key] ? 'right-[18px]' : 'right-[2px]')} />
                </button>
              </div>
            ))}
            <button onClick={handleSave} className="flex items-center gap-1.5 rounded bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700">
              <Save size={14} />
              حفظ الإعدادات
            </button>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="rounded-md border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">الباقة الحالية</h3>
                <p className="text-xs text-gray-500">باقتك الحالية: مجانية</p>
              </div>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">مجانية</span>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between"><span>العروض المتبقية هذا الشهر</span><span className="font-medium text-gray-900">2 من 3</span></div>
              <div className="flex justify-between"><span>ظهور أولوية في البحث</span><span className="text-gray-400">غير مفعل</span></div>
              <div className="flex justify-between"><span>شارة موثوق</span><span className="text-gray-400">غير مفعل</span></div>
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <Link href="/subscriptions" className="inline-flex items-center gap-1.5 rounded bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700">
                <Package size={13} />
                ترقية الباقة
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="rounded-md border border-gray-200 bg-white p-5">
            <div className="rounded border border-red-100 bg-red-50 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">حذف الحساب</h3>
                  <p className="mt-0.5 text-xs text-red-600">عند حذف حسابك، سيتم إزالة جميع بياناتك بشكل نهائي ولا يمكن استعادتها.</p>
                  {!showDeleteConfirm ? (
                    <button onClick={() => setShowDeleteConfirm(true)} className="mt-2 flex items-center gap-1.5 rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                      <Trash2 size={12} />
                      حذف الحساب
                    </button>
                  ) : (
                    <div className="mt-2 flex items-center gap-2">
                      <button className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">تأكيد الحذف</button>
                      <button onClick={() => setShowDeleteConfirm(false)} className="rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">إلغاء</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
