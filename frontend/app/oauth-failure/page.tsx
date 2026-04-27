'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, Loader2 } from 'lucide-react';

function OAuthFailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const raw = searchParams.get('message') || 'Authentication was cancelled or failed.';
  let message = raw;
  try { message = decodeURIComponent(raw); } catch { /* use raw */ }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center max-w-sm w-full shadow-2xl">
        <XCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Sign-in Failed</h1>
        <p className="text-gray-400 text-sm mb-2 leading-relaxed">{message}</p>
        <p className="text-gray-600 text-xs mb-6">
          Note: Only Gmail accounts are allowed to sign in with Google.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl text-sm transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OAuthFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-blue-500" />
      </div>
    }>
      <OAuthFailureContent />
    </Suspense>
  );
}
