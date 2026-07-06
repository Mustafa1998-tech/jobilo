'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-md border border-gray-200 bg-white p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <span className="text-xl font-bold text-red-600">!</span>
        </div>
        <h1 className="mb-1 text-sm font-bold text-gray-900">حدث خطأ غير متوقع</h1>
        <p className="mb-4 text-xs text-gray-500">نأسف للإزعاج. يرجى المحاولة مرة أخرى.</p>
        <button onClick={reset} className="rounded-md bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700 transition-colors">
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
