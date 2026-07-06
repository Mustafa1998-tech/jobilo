'use client';

import { useState } from 'react';
import { MapPin, Calendar, Star, Briefcase, MessageSquare, Award } from 'lucide-react';
import Link from 'next/link';

const MOCK_USER = {
  id: '1',
  firstName: 'سارة',
  lastName: 'أحمد',
  role: 'FREELANCER',
  location: 'القاهرة، مصر',
  bio: 'مطورة Full-stack بخبرة 7 سنوات في تطوير تطبيقات الويب والجوال باستخدام React و Next.js و Node.js. أعمل مع شركات ناشئة عالمية لبناء منتجات رقمية متكاملة.',
  skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'AWS', 'GraphQL'],
  projectsCompleted: 34,
  rating: 4.9,
  memberSince: '2024-03-15',
  recentProjects: [
    { id: '1', title: 'منصة إدارة محتوى', budget: 5000 },
    { id: '2', title: 'تطبيق توصيل طلبات', budget: 8000 },
  ],
};

export default function PublicProfilePage() {
  const [user] = useState(MOCK_USER);

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-800 text-3xl font-bold text-primary-600">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="flex-1 text-center sm:text-right">
              <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-400 sm:justify-start">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
                  {user.role === 'FREELANCER' ? 'مستقل' : 'عميل'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {user.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  عضو منذ {new Date(user.memberSince).getFullYear()}
                </span>
              </div>
            </div>
            <Link
              href="/messages"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-primary-700"
            >
              <MessageSquare size={16} />
              تواصل
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
              <Briefcase size={20} className="mx-auto mb-2 text-primary-600" />
              <p className="text-2xl font-bold text-gray-900">{user.projectsCompleted}</p>
              <p className="text-sm text-gray-500">مشاريع مكتملة</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
              <Star size={20} className="mx-auto mb-2 text-yellow-400" />
              <p className="text-2xl font-bold text-gray-900">{user.rating}</p>
              <p className="text-sm text-gray-500">التقييم</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
              <Award size={20} className="mx-auto mb-2 text-primary-600" />
              <p className="text-2xl font-bold text-gray-900">{new Date().getFullYear() - new Date(user.memberSince).getFullYear()}</p>
              <p className="text-sm text-gray-500">سنوات الخبرة</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">نبذة عني</h2>
            <p className="leading-relaxed text-gray-400">{user.bio}</p>
          </div>

          {user.role === 'FREELANCER' && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">المهارات</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-primary-50 px-3 py-1.5 text-sm text-primary-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.role === 'FREELANCER' && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">آخر المشاريع</h2>
              <div className="space-y-3">
                {user.recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                    <span className="text-sm text-gray-900">{project.title}</span>
                    <span className="text-sm text-gray-400">${project.budget.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
