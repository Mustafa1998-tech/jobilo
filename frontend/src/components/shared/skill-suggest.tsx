'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Search, X } from 'lucide-react';

interface SkillSuggestProps {
  selected: string[];
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
}

const MOCK_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Django', 'Flask',
  'Vue.js', 'Angular', 'Svelte', 'Tailwind CSS', 'Bootstrap', 'SASS', 'HTML', 'CSS',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro',
  'SEO', 'Google Ads', 'Facebook Ads', 'Content Writing', 'Copywriting', 'Translation',
  'Flutter', 'React Native', 'Swift', 'Kotlin', 'Java', 'C#', 'PHP', 'Laravel',
  'WordPress', 'Shopify', 'Wix', 'UI Design', 'UX Design', 'Graphic Design', 'Logo Design',
  'Project Management', 'Agile', 'Scrum', 'Data Analysis', 'Machine Learning',
];

// Suggest similar skills for fuzzy matching simulation
const SIMILAR_MAP: Record<string, string> = {
  'react.js': 'React',
  'reactjs': 'React',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'typescript': 'TypeScript',
  'javascipt': 'JavaScript',
  'javscript': 'JavaScript',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'mongodb': 'MongoDB',
  'photoshop': 'Photoshop',
  'illustrator': 'Illustrator',
  'flutter': 'Flutter',
  'reactnative': 'React Native',
  'react native': 'React Native',
  'wordpress': 'WordPress',
};

export function SkillSuggest({ selected, onAdd, onRemove }: SkillSuggestProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', nameAr: '', description: '' });
  const [suggested, setSuggested] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    setSuggested(null);

    if (!value.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const lower = value.toLowerCase().trim();
    const matched = MOCK_SKILLS.filter((s) => s.toLowerCase().includes(lower) && !selected.includes(s));

    // Fuzzy / similar detection
    if (matched.length === 0) {
      const similar = SIMILAR_MAP[lower];
      if (similar && !selected.includes(similar)) {
        setSuggested(similar);
        setResults([]);
      } else {
        setResults([]);
      }
    } else {
      setResults(matched);
    }
    setShowResults(true);
  };

  const selectSkill = (skill: string) => {
    onAdd(skill);
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSuggested(null);
  };

  const handleAddNew = () => {
    if (newSkill.name.trim()) {
      onAdd(newSkill.name.trim());
      setNewSkill({ name: '', nameAr: '', description: '' });
      setShowAddModal(false);
      setQuery('');
      setResults([]);
      setSuggested(null);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selected.map((skill) => (
          <span key={skill} className="flex items-center gap-1 rounded bg-primary-50 px-2 py-0.5 text-xs text-primary-700">
            {skill}
            <button onClick={() => onRemove(skill)}><X size={10} /></button>
          </span>
        ))}
      </div>

      <div className="relative">
        <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="ابحث عن مهارة..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          className="w-full rounded border border-gray-200 px-3 py-1.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {showResults && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-sm max-h-48 overflow-y-auto">
          {suggested && (
            <div className="px-3 py-2 text-xs text-amber-700 bg-amber-50 border-b border-gray-100">
              هل تقصد: <button onClick={() => selectSkill(suggested)} className="font-medium text-primary-600 hover:underline">{suggested}</button>؟
            </div>
          )}
          {results.map((skill) => (
            <button
              key={skill}
              onClick={() => selectSkill(skill)}
              className="w-full px-3 py-1.5 text-right text-xs text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {skill}
            </button>
          ))}
          {results.length === 0 && !suggested && query.trim() && (
            <div className="px-3 py-2 text-xs text-gray-500">
              لم يتم العثور على &quot;{query}&quot;
              <button onClick={() => { setShowAddModal(true); setShowResults(false); }} className="mr-1 font-medium text-primary-600 hover:underline">
                إضافة مهارة جديدة
              </button>
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-sm rounded-md border border-gray-200 bg-white p-4 shadow-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">إضافة مهارة جديدة</h3>
            <div className="space-y-2">
              <div>
                <label className="mb-0.5 block text-[11px] font-medium text-gray-600">اسم المهارة (بالإنجليزية) *</label>
                <input value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full rounded border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" placeholder="e.g. Rust" />
              </div>
              <div>
                <label className="mb-0.5 block text-[11px] font-medium text-gray-600">الاسم بالعربية</label>
                <input value={newSkill.nameAr} onChange={(e) => setNewSkill({ ...newSkill, nameAr: e.target.value })}
                  className="w-full rounded border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" placeholder="مثال: رست" />
              </div>
              <div>
                <label className="mb-0.5 block text-[11px] font-medium text-gray-600">وصف مختصر (اختياري)</label>
                <textarea value={newSkill.description} onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  className="w-full rounded border border-gray-200 px-2.5 py-1.5 text-xs text-gray-900 focus:border-primary-500 focus:outline-none" rows={2} />
              </div>
            </div>
            <p className="mt-2 text-[10px] text-amber-600">سيتم إرسال المهارة للمراجعة من قبل الإدارة.</p>
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="rounded border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">إلغاء</button>
              <button onClick={handleAddNew} className="rounded bg-primary-600 px-3 py-1 text-xs text-white hover:bg-primary-700">إرسال</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
