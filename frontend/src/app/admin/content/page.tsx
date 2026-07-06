'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FileText, Plus, Edit3, Trash2, X, BookOpen,
  HelpCircle, Image, ChevronLeft, ChevronRight,
} from 'lucide-react';
import adminClient from '@/lib/api/admin-client';

// --- Types ---
interface Page {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  content: string;
  status: 'PUBLISHED' | 'DRAFT';
  updatedAt: string;
}

interface BlogPost {
  id: string;
  titleAr: string;
  titleEn: string;
  content: string;
  author: string;
  tags: string[];
  status: string;
  views: number;
  createdAt: string;
}

interface FaqCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  faqs: Faq[];
}

interface Faq {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  categoryId: string;
  sortOrder: number;
}

interface Banner {
  id: string;
  titleAr: string;
  titleEn: string;
  link: string;
  imageUrl: string;
  position: string;
  isActive: boolean;
  createdAt: string;
}

type Tab = 'pages' | 'blog' | 'faq' | 'banners';

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'pages', label: 'الصفحات', icon: FileText },
  { key: 'blog', label: 'المدونة', icon: BookOpen },
  { key: 'faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
  { key: 'banners', label: 'البنرات', icon: Image },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    PUBLISHED: 'bg-primary-50 text-primary-600 border-primary-200',
    DRAFT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };
  return styles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
};

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<Tab>('pages');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة المحتوى</h1>
        <p className="text-gray-500">إدارة صفحات الموقع والمحتوى</p>
      </div>

      {/* Tabs */}
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

      {activeTab === 'pages' && <PagesSection />}
      {activeTab === 'blog' && <BlogSection />}
      {activeTab === 'faq' && <FaqSection />}
      {activeTab === 'banners' && <BannersSection />}
    </div>
  );
}

/* ============ Pages Section ============ */
function PagesSection() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState<{ open: boolean; page?: Page }>({ open: false });
  const [form, setForm] = useState({ titleAr: '', titleEn: '', slug: '', content: '', status: 'DRAFT' as string });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminClient.get('/super-admin/content/pages');
      setPages(data.pages || data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل الصفحات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const openModal = (page?: Page) => {
    setForm({
      titleAr: page?.titleAr || '',
      titleEn: page?.titleEn || '',
      slug: page?.slug || '',
      content: page?.content || '',
      status: page?.status || 'DRAFT',
    });
    setEditModal({ open: true, page });
  };

  const handleSave = async () => {
    if (!form.titleAr.trim() || !form.slug.trim()) return;
    setSaving(true);
    try {
      if (editModal.page) {
        await adminClient.put(`/super-admin/content/pages/${editModal.page.id}`, form);
      } else {
        await adminClient.post('/super-admin/content/pages', form);
      }
      setEditModal({ open: false });
      fetchPages();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await adminClient.delete(`/super-admin/content/pages/${id}`);
      setDeleteConfirm(null);
      fetchPages();
    } catch {
      setError('فشل الحذف');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30"
        >
          <Plus size={16} />
          صفحة جديدة
        </button>
      </div>

      {pages.length === 0 ? (
        <EmptyState icon={FileText} message="لا توجد صفحات" />
      ) : (
        <div className="grid gap-3">
          {pages.map((page) => (
            <div key={page.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{page.titleAr}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(page.status)}`}>
                      {page.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {page.slug} — آخر تحديث: {new Date(page.updatedAt).toLocaleDateString('ar-EG')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(page)}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-primary-600"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(page.id)}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {editModal.open && (
        <Modal onClose={() => setEditModal({ open: false })} title={editModal.page ? 'تعديل الصفحة' : 'صفحة جديدة'}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان (عربي)</label>
              <input type="text" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان (إنجليزي)</label>
              <input type="text" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الرابط (slug)</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">المحتوى</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" rows={8} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الحالة</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none">
                <option value="DRAFT">مسودة</option>
                <option value="PUBLISHED">منشور</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50">
              {saving ? 'جاري...' : 'حفظ'}
            </button>
            <button onClick={() => setEditModal({ open: false })}
              className="flex-1 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
              إلغاء
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <ConfirmDialog
          title="تأكيد الحذف"
          message="هل أنت متأكد من حذف هذه الصفحة؟"
          loading={actionLoading === deleteConfirm}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

/* ============ Blog Section ============ */
function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState<{ open: boolean; post?: BlogPost }>({ open: false });
  const [form, setForm] = useState({ titleAr: '', titleEn: '', content: '', tags: '', status: 'DRAFT' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      const { data } = await adminClient.get('/super-admin/content/blog', { params });
      setPosts(data.posts || data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل المقالات');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openModal = (post?: BlogPost) => {
    setForm({
      titleAr: post?.titleAr || '',
      titleEn: post?.titleEn || '',
      content: post?.content || '',
      tags: post?.tags?.join(', ') || '',
      status: post?.status || 'DRAFT',
    });
    setEditModal({ open: true, post });
  };

  const handleSave = async () => {
    if (!form.titleAr.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
      if (editModal.post) {
        await adminClient.put(`/super-admin/content/blog/${editModal.post.id}`, payload);
      } else {
        await adminClient.post('/super-admin/content/blog', payload);
      }
      setEditModal({ open: false });
      fetchPosts();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await adminClient.delete(`/super-admin/content/blog/${id}`);
      setDeleteConfirm(null);
      fetchPosts();
    } catch {
      setError('فشل الحذف');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input type="text" placeholder="بحث..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none" />
        </div>
        <button onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30">
          <Plus size={16} />
          مقال جديد
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <EmptyState icon={BookOpen} message="لا توجد مقالات" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-4 py-3 text-right text-gray-400 font-medium">العنوان</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الكاتب</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">الحالة</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">تاريخ النشر</th>
                <th className="px-4 py-3 text-right text-gray-400 font-medium">المشاهدات</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-200/50 hover:bg-white/50">
                  <td className="px-4 py-3 text-gray-900">{post.titleAr || post.titleEn}</td>
                  <td className="px-4 py-3 text-gray-400">{post.author || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(post.status)}`}>{post.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(post.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="px-4 py-3 text-gray-400">{post.views || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-start">
                      <button onClick={() => openModal(post)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-primary-600" title="تعديل"><Edit3 size={15} /></button>
                      <button onClick={() => setDeleteConfirm(post.id)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-red-400" title="حذف"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      {editModal.open && (
        <Modal onClose={() => setEditModal({ open: false })} title={editModal.post ? 'تعديل المقال' : 'مقال جديد'}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان (عربي)</label>
              <input type="text" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان (إنجليزي)</label>
              <input type="text" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">المحتوى</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" rows={6} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الوسوم (مفصولة بفواصل)</label>
              <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الحالة</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none">
                <option value="DRAFT">مسودة</option>
                <option value="PUBLISHED">منشور</option>
                <option value="PENDING">قيد المراجعة</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50">
              {saving ? 'جاري...' : 'حفظ'}
            </button>
            <button onClick={() => setEditModal({ open: false })}
              className="flex-1 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
              إلغاء
            </button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="تأكيد الحذف"
          message="هل أنت متأكد من حذف هذا المقال؟"
          loading={actionLoading === deleteConfirm}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

/* ============ FAQ Section ============ */
function FaqSection() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCatForm, setNewCatForm] = useState({ nameAr: '', nameEn: '' });
  const [showNewCat, setShowNewCat] = useState(false);
  const [faqModal, setFaqModal] = useState<{ open: boolean; faq?: Faq; categoryId?: string }>({ open: false });
  const [faqForm, setFaqForm] = useState({ questionAr: '', questionEn: '', answerAr: '', answerEn: '', categoryId: '', sortOrder: 0 });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [catRes, faqRes] = await Promise.all([
        adminClient.get('/super-admin/content/faq-categories'),
        adminClient.get('/super-admin/content/faqs'),
      ]);
      setCategories(catRes.data.categories || catRes.data || []);
      setFaqs(faqRes.data.faqs || faqRes.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddCategory = async () => {
    if (!newCatForm.nameAr.trim()) return;
    setSaving(true);
    try {
      await adminClient.post('/super-admin/content/faq-categories', newCatForm);
      setShowNewCat(false);
      setNewCatForm({ nameAr: '', nameEn: '' });
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل إضافة التصنيف');
    } finally {
      setSaving(false);
    }
  };

  const openFaqModal = (categoryId?: string, faq?: Faq) => {
    setFaqForm({
      questionAr: faq?.questionAr || '',
      questionEn: faq?.questionEn || '',
      answerAr: faq?.answerAr || '',
      answerEn: faq?.answerEn || '',
      categoryId: faq?.categoryId || categoryId || '',
      sortOrder: faq?.sortOrder || 0,
    });
    setFaqModal({ open: true, faq, categoryId });
  };

  const handleSaveFaq = async () => {
    if (!faqForm.questionAr.trim() || !faqForm.answerAr.trim()) return;
    setSaving(true);
    try {
      if (faqModal.faq) {
        await adminClient.patch(`/super-admin/content/faqs/${faqModal.faq.id}`, faqForm);
      } else {
        await adminClient.post('/super-admin/content/faqs', faqForm);
      }
      setFaqModal({ open: false });
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    setActionLoading(id);
    try {
      await adminClient.delete(`/super-admin/content/faqs/${id}`);
      setDeleteConfirm(null);
      fetchData();
    } catch {
      setError('فشل الحذف');
    } finally {
      setActionLoading(null);
    }
  };

  const getCategoryFaqs = (catId: string) => faqs.filter((f) => f.categoryId === catId);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">التصنيفات</h2>
        <button onClick={() => setShowNewCat(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-50 border border-primary-200 px-3 py-1.5 text-xs text-primary-600 hover:bg-primary-600/30">
          <Plus size={14} />
          تصنيف جديد
        </button>
      </div>

      {showNewCat && (
        <div className="flex gap-2">
          <input type="text" placeholder="الاسم (عربي)" value={newCatForm.nameAr}
            onChange={(e) => setNewCatForm({ ...newCatForm, nameAr: e.target.value })}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
          <input type="text" placeholder="الاسم (إنجليزي)" value={newCatForm.nameEn}
            onChange={(e) => setNewCatForm({ ...newCatForm, nameEn: e.target.value })}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
          <button onClick={handleAddCategory} disabled={saving}
            className="rounded-lg bg-primary-50 border border-primary-200 px-3 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50">
            {saving ? 'جاري...' : 'إضافة'}
          </button>
          <button onClick={() => setShowNewCat(false)}
            className="rounded-lg border border-gray-200 bg-gray-800 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700">
            إلغاء
          </button>
        </div>
      )}

      {categories.length === 0 ? (
        <EmptyState icon={HelpCircle} message="لا توجد تصنيفات" />
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => {
            const catFaqs = getCategoryFaqs(cat.id);
            return (
              <div key={cat.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">{cat.nameAr || cat.nameEn}</h3>
                  <button onClick={() => openFaqModal(cat.id)}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-800 px-3 py-1 text-xs text-gray-300 hover:bg-gray-700">
                    <Plus size={12} />
                    إضافة سؤال
                  </button>
                </div>
                {catFaqs.length === 0 ? (
                  <p className="text-xs text-gray-500">لا توجد أسئلة في هذا التصنيف</p>
                ) : (
                  <div className="space-y-2">
                    {catFaqs.map((faq) => (
                      <div key={faq.id} className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{faq.questionAr || faq.questionEn}</p>
                            <p className="text-xs text-gray-500 mt-1">{faq.answerAr || faq.answerEn}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => openFaqModal(cat.id, faq)}
                              className="rounded-lg p-1 text-gray-500 hover:text-primary-600"><Edit3 size={13} /></button>
                            <button onClick={() => setDeleteConfirm(faq.id)}
                              className="rounded-lg p-1 text-gray-500 hover:text-red-400"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FAQ Modal */}
      {faqModal.open && (
        <Modal onClose={() => setFaqModal({ open: false })} title={faqModal.faq ? 'تعديل السؤال' : 'سؤال جديد'}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">السؤال (عربي)</label>
              <input type="text" value={faqForm.questionAr} onChange={(e) => setFaqForm({ ...faqForm, questionAr: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">السؤال (إنجليزي)</label>
              <input type="text" value={faqForm.questionEn} onChange={(e) => setFaqForm({ ...faqForm, questionEn: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الإجابة (عربي)</label>
              <textarea value={faqForm.answerAr} onChange={(e) => setFaqForm({ ...faqForm, answerAr: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" rows={4} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الإجابة (إنجليزي)</label>
              <textarea value={faqForm.answerEn} onChange={(e) => setFaqForm({ ...faqForm, answerEn: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" rows={4} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">التصنيف</label>
              <select value={faqForm.categoryId} onChange={(e) => setFaqForm({ ...faqForm, categoryId: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nameAr || cat.nameEn}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSaveFaq} disabled={saving}
              className="flex-1 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50">
              {saving ? 'جاري...' : 'حفظ'}
            </button>
            <button onClick={() => setFaqModal({ open: false })}
              className="flex-1 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
              إلغاء
            </button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="تأكيد الحذف"
          message="هل أنت متأكد من حذف هذا السؤال؟"
          loading={actionLoading === deleteConfirm}
          onConfirm={() => handleDeleteFaq(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

/* ============ Banners Section ============ */
function BannersSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState<{ open: boolean; banner?: Banner }>({ open: false });
  const [form, setForm] = useState({ titleAr: '', titleEn: '', link: '', imageUrl: '', position: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminClient.get('/super-admin/content/banners');
      setBanners(data.banners || data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تحميل البنرات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const openModal = (banner?: Banner) => {
    setForm({
      titleAr: banner?.titleAr || '',
      titleEn: banner?.titleEn || '',
      link: banner?.link || '',
      imageUrl: banner?.imageUrl || '',
      position: banner?.position || '',
      isActive: banner?.isActive ?? true,
    });
    setEditModal({ open: true, banner });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editModal.banner) {
        await adminClient.put(`/super-admin/content/banners/${editModal.banner.id}`, form);
      } else {
        await adminClient.post('/super-admin/content/banners', form);
      }
      setEditModal({ open: false });
      fetchBanners();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await adminClient.delete(`/super-admin/content/banners/${id}`);
      setDeleteConfirm(null);
      fetchBanners();
    } catch {
      setError('فشل الحذف');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="flex justify-end">
        <button onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30">
          <Plus size={16} />
          بانر جديد
        </button>
      </div>

      {banners.length === 0 ? (
        <EmptyState icon={Image} message="لا توجد بنرات" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <div key={banner.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`rounded-lg p-2 ${banner.isActive ? 'bg-primary-50 text-primary-600' : 'bg-gray-500/10 text-gray-400'}`}>
                  <Image size={18} />
                </div>
                <button
                  onClick={() => openModal(banner)}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-primary-600"
                >
                  <Edit3 size={15} />
                </button>
              </div>
              <div className="aspect-video rounded-lg bg-gray-800 flex items-center justify-center mb-3 overflow-hidden">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.titleAr} className="w-full h-full object-cover" />
                ) : (
                  <Image size={32} className="text-gray-600" />
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{banner.titleAr || banner.titleEn}</h3>
              <p className="text-xs text-gray-500 mt-1">{banner.link}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">{banner.position}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${banner.isActive ? 'bg-primary-50 text-primary-600 border-primary-200' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                  {banner.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={() => setDeleteConfirm(banner.id)}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-red-400">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editModal.open && (
        <Modal onClose={() => setEditModal({ open: false })} title={editModal.banner ? 'تعديل البانر' : 'بانر جديد'}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان (عربي)</label>
              <input type="text" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان (إنجليزي)</label>
              <input type="text" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الرابط</label>
              <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">رابط الصورة</label>
              <input type="text" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الموضع</label>
              <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded border-gray-200 bg-gray-800 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-gray-400">نشط</span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 rounded-lg bg-primary-50 border border-primary-200 px-4 py-2 text-sm text-primary-600 hover:bg-primary-600/30 disabled:opacity-50">
              {saving ? 'جاري...' : 'حفظ'}
            </button>
            <button onClick={() => setEditModal({ open: false })}
              className="flex-1 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
              إلغاء
            </button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="تأكيد الحذف"
          message="هل أنت متأكد من حذف هذا البانر؟"
          loading={actionLoading === deleteConfirm}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

/* ============ Shared Components ============ */
function LoadingSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
      {message}
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center text-gray-500">
      <Icon size={40} className="mb-3 opacity-50" />
      <p>{message}</p>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmDialog({ title, message, loading, onConfirm, onCancel }: {
  title: string; message: string; loading: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
          <Trash2 size={24} className="text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/30 disabled:opacity-50">
            {loading ? 'جاري...' : 'تأكيد'}
          </button>
          <button onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}
        className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-white disabled:opacity-50">
        <ChevronRight size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            page === p
              ? 'bg-primary-50 text-primary-600 border border-primary-200'
              : 'border border-gray-200 text-gray-400 hover:bg-white'
          }`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
        className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-white disabled:opacity-50">
        <ChevronLeft size={16} />
      </button>
    </div>
  );
}
