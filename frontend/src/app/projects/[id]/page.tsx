'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/endpoints';
import { formatRelativeTime, formatCurrency } from '@/lib/utils';
import { CalendarDays, DollarSign, MessageSquare, Clock, Star, Heart, ArrowLeft } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getById(id),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse rounded-xl border bg-white p-8">
          <div className="mb-4 h-8 w-3/4 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-full rounded bg-gray-200" />
          <div className="mb-2 h-4 w-5/6 rounded bg-gray-200" />
          <div className="mb-6 h-4 w-1/3 rounded bg-gray-200" />
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded bg-gray-200" />
            <div className="h-8 w-20 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-red-600">حدث خطأ في تحميل المشروع</p>
          <Link href="/projects" className="mt-4 inline-block text-primary-600 hover:underline">
            العودة للمشاريع
          </Link>
        </div>
      </div>
    );
  }

  const p = project?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center px-4 py-3">
          <Link href="/projects" className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600">
            <ArrowLeft size={14} />
            العودة للمشاريع
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl border bg-white p-8">
          {/* Title & Status */}
          <div className="mb-6">
            {p?.isUrgent && (
              <span className="mb-2 inline-block rounded bg-red-100 px-2 py-1 text-xs text-red-600">
                عاجل
              </span>
            )}
            <h1 className="text-2xl font-bold">{p?.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><CalendarDays size={14} />{p?.durationDays} يوماً</span>
              <span className="flex items-center gap-1">
                <DollarSign size={14} />{p?.budgetMin && p?.budgetMax
                  ? `${formatCurrency(Number(p.budgetMin))} - ${formatCurrency(Number(p.budgetMax))}`
                  : 'قابل للتفاوض'}
              </span>
              <span className="flex items-center gap-1"><MessageSquare size={14} />{p?._count?.proposals || 0} عرضاً</span>
              <span className="flex items-center gap-1"><Clock size={14} />{formatRelativeTime(p?.createdAt)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">وصف المشروع</h2>
            <p className="whitespace-pre-wrap text-gray-700">{p?.description}</p>
          </div>

          {/* Skills */}
          {p?.skills?.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-semibold">المهارات المطلوبة</h2>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((ps: { skill: { id: string; name: string } }) => (
                  <span key={ps.skill.id} className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700">
                    {ps.skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Client Info */}
          {p?.client?.clientProfile && (
            <div className="mb-8 rounded-lg bg-gray-50 p-4">
              <h2 className="mb-2 text-lg font-semibold">عن العميل</h2>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-600">
                  {p.client.clientProfile.companyName?.[0]}
                </div>
                <div>
                  <p className="font-medium">{p.client.clientProfile.companyName}</p>
                  <p className="text-sm text-gray-500">
                    <Star size={12} className="inline text-amber-400" /> {p.client.clientProfile.averageRating || 'جديد'} | {p.client.clientProfile.totalProjectsPosted || 0} مشروع
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-4 border-t pt-6">
            <Link
              href={`/proposals/new?project=${id}`}
              className="rounded-lg bg-primary-600 px-8 py-3 text-white transition hover:bg-primary-700"
            >
              تقديم عرض
            </Link>
            <button className="flex items-center gap-1 rounded-lg border px-6 py-3 transition hover:bg-gray-50">
              <Heart size={16} />
              حفظ
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
