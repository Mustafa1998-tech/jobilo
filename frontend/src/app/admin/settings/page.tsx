'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Globe, Mail, HardDrive, Cpu, Bell, Search, Shield, Save,
} from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

type Tab = 'platform' | 'email' | 'storage' | 'ai' | 'notifications' | 'seo' | 'security';

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'platform', label: 'المنصة', icon: Globe },
  { key: 'email', label: 'البريد الإلكتروني', icon: Mail },
  { key: 'storage', label: 'التخزين', icon: HardDrive },
  { key: 'ai', label: 'الذكاء الاصطناعي', icon: Cpu },
  { key: 'notifications', label: 'الإشعارات', icon: Bell },
  { key: 'seo', label: 'تحسين محركات البحث', icon: Search },
  { key: 'security', label: 'الأمان', icon: Shield },
];

const API_PATHS: Record<Tab, string> = {
  platform: '/super-admin/settings/platform',
  email: '/super-admin/settings/email',
  storage: '/super-admin/settings/storage',
  ai: '/super-admin/settings/ai',
  notifications: '/super-admin/settings/notifications',
  seo: '/super-admin/settings/seo',
  security: '/super-admin/settings/security',
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('platform');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-500">إعدادات المنصة العامة</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary-50 text-primary-600 border border-primary-200'
                  : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <TabIcon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <SettingsForm tab={activeTab} apiPath={API_PATHS[activeTab]} />
    </div>
  );
}

function SettingsForm({ tab, apiPath }: { tab: Tab; apiPath: string }) {
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminClient.get(apiPath);
      setForm(data.settings || data || {});
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  }, [apiPath]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await adminClient.put(apiPath, form);
      setSuccess('تم حفظ الإعدادات بنجاح');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-primary-50 border border-primary-200 p-3 text-sm text-primary-600 text-center">
          {success}
        </div>
      )}

      <div className="space-y-5">
        {tab === 'platform' && (
          <>
            <TextField label="اسم المنصة" value={form.siteName} onChange={(v) => handleChange('siteName', v)} />
            <TextAreaField label="الوصف" value={form.description} onChange={(v) => handleChange('description', v)} />
            <TextField label="رابط الشعار" value={form.logoUrl} onChange={(v) => handleChange('logoUrl', v)} />
            <TextField label="رمز الموقع (favicon)" value={form.favicon} onChange={(v) => handleChange('favicon', v)} />
            <TextField label="اللغة الافتراضية" value={form.defaultLanguage} onChange={(v) => handleChange('defaultLanguage', v)} />
            <TextField label="المنطقة الزمنية" value={form.timezone} onChange={(v) => handleChange('timezone', v)} />
            <ToggleField label="وضع الصيانة" checked={form.maintenanceMode} onChange={(v) => handleChange('maintenanceMode', v)} />
            <ToggleField label="فتح التسجيل" checked={form.registrationEnabled} onChange={(v) => handleChange('registrationEnabled', v)} />
          </>
        )}

        {tab === 'email' && (
          <>
            <TextField label="خادم SMTP" value={form.smtpHost} onChange={(v) => handleChange('smtpHost', v)} />
            <TextField label="المنفذ" type="number" value={form.smtpPort} onChange={(v) => handleChange('smtpPort', v)} />
            <TextField label="اسم المستخدم" value={form.smtpUser} onChange={(v) => handleChange('smtpUser', v)} />
            <TextField label="كلمة المرور" type="password" value={form.smtpPass} onChange={(v) => handleChange('smtpPass', v)} placeholder="●●●●●●●●" />
            <TextField label="بريد المرسل" value={form.fromAddress} onChange={(v) => handleChange('fromAddress', v)} />
            <TextField label="اسم المرسل" value={form.fromName} onChange={(v) => handleChange('fromName', v)} />
            <button className="rounded-lg bg-blue-500/20 border border-blue-500/30 px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/30">
              إرسال بريد اختباري
            </button>
          </>
        )}

        {tab === 'storage' && (
          <>
            <SelectField label="مزود التخزين" value={form.provider} onChange={(v) => handleChange('provider', v)} options={[
              { value: 'local', label: 'محلي' },
              { value: 's3', label: 'Amazon S3' },
            ]} />
            {form.provider === 's3' && (
              <>
                <TextField label="المخزن (Bucket)" value={form.bucket} onChange={(v) => handleChange('bucket', v)} />
                <TextField label="المنطقة (Region)" value={form.region} onChange={(v) => handleChange('region', v)} />
                <TextField label="مفتاح الوصول" value={form.accessKey} onChange={(v) => handleChange('accessKey', v)} />
                <TextField label="مفتاح سري" type="password" value={form.secretKey} onChange={(v) => handleChange('secretKey', v)} />
              </>
            )}
            <TextField label="الحد الأقصى لحجم الملف (MB)" type="number" value={form.maxFileSize} onChange={(v) => handleChange('maxFileSize', v)} />
            <TextField label="أنواع الملفات المسموحة" value={form.allowedTypes} onChange={(v) => handleChange('allowedTypes', v)} placeholder="jpg,png,pdf" />
          </>
        )}

        {tab === 'ai' && (
          <>
            <SelectField label="المزود" value={form.provider} onChange={(v) => handleChange('provider', v)} options={[
              { value: 'openai', label: 'OpenAI' },
              { value: 'gemini', label: 'Google Gemini' },
            ]} />
            <TextField label="مفتاح API" type="password" value={form.apiKey} onChange={(v) => handleChange('apiKey', v)} />
            <TextField label="النموذج" value={form.model} onChange={(v) => handleChange('model', v)} placeholder="gpt-4" />
            <TextField label="الحد الأقصى للرموز" type="number" value={form.maxTokens} onChange={(v) => handleChange('maxTokens', v)} />
            <TextField label="درجة الحرارة" type="number" value={form.temperature} onChange={(v) => handleChange('temperature', v)} />
            <ToggleField label="تفعيل الذكاء الاصطناعي" checked={form.enabled} onChange={(v) => handleChange('enabled', v)} />
          </>
        )}

        {tab === 'notifications' && (
          <>
            <ToggleField label="إشعارات البريد الإلكتروني" checked={form.emailNotifications} onChange={(v) => handleChange('emailNotifications', v)} />
            <ToggleField label="الإشعارات الفورية" checked={form.pushNotifications} onChange={(v) => handleChange('pushNotifications', v)} />
            <ToggleField label="تنبيهات البريد للمشرفين" checked={form.adminEmailAlerts} onChange={(v) => handleChange('adminEmailAlerts', v)} />
            <ToggleField label="بريد ترحيبي للمستخدمين الجدد" checked={form.newUserWelcomeEmail} onChange={(v) => handleChange('newUserWelcomeEmail', v)} />
            <ToggleField label="بريد إتمام المشروع" checked={form.projectCompletionEmail} onChange={(v) => handleChange('projectCompletionEmail', v)} />
          </>
        )}

        {tab === 'seo' && (
          <>
            <TextField label="عنوان الميتا" value={form.metaTitle} onChange={(v) => handleChange('metaTitle', v)} />
            <TextAreaField label="وصف الميتا" value={form.metaDescription} onChange={(v) => handleChange('metaDescription', v)} />
            <TextField label="كلمات مفتاحية" value={form.metaKeywords} onChange={(v) => handleChange('metaKeywords', v)} />
            <TextField label="Google Analytics ID" value={form.googleAnalyticsId} onChange={(v) => handleChange('googleAnalyticsId', v)} />
            <TextField label="Facebook Pixel ID" value={form.facebookPixelId} onChange={(v) => handleChange('facebookPixelId', v)} />
            <TextAreaField label="محتوى robots.txt" value={form.robotsTxt} onChange={(v) => handleChange('robotsTxt', v)} rows={6} />
          </>
        )}

        {tab === 'security' && (
          <>
            <TextField label="الحد الأقصى لمحاولات تسجيل الدخول" type="number" value={form.maxLoginAttempts} onChange={(v) => handleChange('maxLoginAttempts', v)} />
            <TextField label="مدة القفل (دقائق)" type="number" value={form.lockoutDuration} onChange={(v) => handleChange('lockoutDuration', v)} />
            <TextField label="الحد الأدنى لطول كلمة المرور" type="number" value={form.passwordMinLength} onChange={(v) => handleChange('passwordMinLength', v)} />
            <ToggleField label="اشتراط أحرف خاصة" checked={form.requireSpecialChars} onChange={(v) => handleChange('requireSpecialChars', v)} />
            <ToggleField label="اشتراط التحقق بخطوتين للمشرفين" checked={form.require2FA} onChange={(v) => handleChange('require2FA', v)} />
            <TextField label="مهلة الجلسة (دقائق)" type="number" value={form.sessionTimeout} onChange={(v) => handleChange('sessionTimeout', v)} />
            <ToggleField label="تفعيل قائمة IP البيضاء" checked={form.ipWhitelistEnabled} onChange={(v) => handleChange('ipWhitelistEnabled', v)} />
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-primary-50 border border-primary-200 px-6 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>
    </div>
  );
}

/* ============ Field Components ============ */
function TextField({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value?: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 }: {
  label: string; value?: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
        rows={rows}
      />
    </div>
  );
}

function ToggleField({ label, checked, onChange }: {
  label: string; checked?: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-gray-700'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value?: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
