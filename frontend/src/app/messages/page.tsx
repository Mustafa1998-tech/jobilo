'use client';

import { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1', name: 'محمد علي', initials: 'م.ع',
    lastMessage: 'تم، سأرسل لك التحديثات غداً', time: '10:32 ص', unread: 2, online: true,
    messages: [
      { id: 'm1', text: 'مرحباً، كيف تسير الأمور في المشروع؟', sender: 'me', time: '10:00 ص' },
      { id: 'm2', text: 'الحمد لله، الأمور تمام. أقوم حالياً بمراجعة الكود.', sender: 'other', time: '10:15 ص' },
      { id: 'm3', text: 'ممتاز! هل تحتاج أي مساعدة؟', sender: 'me', time: '10:20 ص' },
      { id: 'm4', text: 'لا شكراً، كل شيء تحت السيطرة.', sender: 'other', time: '10:25 ص' },
      { id: 'm5', text: 'تم، سأرسل لك التحديثات غداً', sender: 'other', time: '10:32 ص' },
    ],
  },
  {
    id: '2', name: 'سارة أحمد', initials: 'س.أ',
    lastMessage: 'حسناً، ننتظر الرد من العميل', time: 'أمس', unread: 0, online: false,
    messages: [
      { id: 'm6', text: 'هل تمت الموافقة على التصميم؟', sender: 'me', time: '02:00 م' },
      { id: 'm7', text: 'حسناً، ننتظر الرد من العميل', sender: 'other', time: '02:30 م' },
    ],
  },
  {
    id: '3', name: 'خالد عبدالله', initials: 'خ.ع', lastMessage: 'بالتوفيق لك', time: 'الثلاثاء', unread: 1, online: true, messages: [],
  },
  {
    id: '4', name: 'نورة حسن', initials: 'ن.ح', lastMessage: 'تم استلام المبلغ', time: 'الإثنين', unread: 0, online: false, messages: [],
  },
  {
    id: '5', name: 'فيصل عمر', initials: 'ف.ع', lastMessage: 'شكراً لك', time: '6/25', unread: 0, online: false, messages: [],
  },
];

export default function MessagesPage() {
  const [conversations] = useState(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [input, setInput] = useState('');

  const active = conversations.find((c) => c.id === activeId) || conversations[0];

  const handleSend = () => {
    if (!input.trim()) return;
    setInput('');
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] bg-white">
      <aside className="hidden w-72 flex-col border-l border-gray-200 md:flex">
        <div className="border-b border-gray-100 p-4">
          <h1 className="mb-3 text-base font-semibold text-gray-900">الرسائل</h1>
          <div className="relative">
            <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="ابحث في الرسائل..."
              className="w-full rounded border border-gray-200 bg-gray-50 py-1.5 pr-8 text-xs text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={cn(
                'flex w-full items-center gap-3 border-b border-gray-50 p-3 text-right transition',
                activeId === conv.id ? 'bg-primary-50' : 'hover:bg-gray-50',
              )}
            >
              <div className="relative shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                  {conv.initials}
                </div>
                {conv.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-900">{conv.name}</span>
                  <span className="text-[10px] text-gray-400">{conv.time}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-gray-500">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-600 text-[8px] font-bold text-white">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                {active.initials}
              </div>
              {active.online && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{active.name}</p>
              <p className="text-[11px] text-gray-400">{active.online ? 'متصل الآن' : 'غير متصل'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Phone size={15} className="cursor-pointer hover:text-gray-600" />
            <Video size={15} className="cursor-pointer hover:text-gray-600" />
            <MoreVertical size={15} className="cursor-pointer hover:text-gray-600" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
          {active.messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-gray-400">لا توجد رسائل بعد. ابدأ المحادثة!</p>
            </div>
          )}
          {active.messages.map((msg) => (
            <div key={msg.id} className={cn('flex', msg.sender === 'me' ? 'justify-start' : 'justify-end')}>
              <div
                className={cn(
                  'max-w-[70%] rounded-lg px-3 py-2 text-xs',
                  msg.sender === 'me'
                    ? 'rounded-br-sm bg-primary-600 text-white'
                    : 'rounded-bl-sm bg-white border border-gray-200 text-gray-700',
                )}
              >
                <p>{msg.text}</p>
                <p className={cn('mt-1 text-[10px]', msg.sender === 'me' ? 'text-primary-100' : 'text-gray-400')}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 bg-white p-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب رسالتك..."
              className="flex-1 rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="rounded bg-primary-600 p-2 text-white transition hover:bg-primary-700"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
