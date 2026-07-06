'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Mail, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">تواصل معنا</h1>
          <p className="mt-1 text-sm text-gray-500">نحن هنا للإجابة على استفساراتك ومساعدتك</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-50"><Mail size={15} className="text-primary-600" /></div>
              <div><p className="font-medium text-gray-900">البريد الإلكتروني</p><p className="text-gray-500">support@jobilo.com</p></div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-50"><MapPin size={15} className="text-primary-600" /></div>
              <div><p className="font-medium text-gray-900">المكتب الرئيسي</p><p className="text-gray-500">دبي، الإمارات العربية المتحدة</p></div>
            </div>
          </div>

          {sent ? (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              تم إرسال رسالتك بنجاح. سيقوم فريقنا بالرد عليك في أقرب وقت.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input type="text" placeholder="الاسم" required className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div>
                <input type="email" placeholder="البريد الإلكتروني" required className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <div>
                <textarea rows={4} placeholder="رسالتك..." required className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </div>
              <button type="submit" className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
                <Send size={14} />
                إرسال
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
