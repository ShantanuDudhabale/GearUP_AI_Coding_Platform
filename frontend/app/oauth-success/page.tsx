'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function OAuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAppStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setErrorMsg('No authentication token received.');
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch user profile');
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user, data.user.token || token);
          setStatus('success');
          setTimeout(() => router.push('/chat'), 800);
        } else {
          throw new Error('Invalid user data received');
        }
      })
      .catch((err) => {
        console.error('OAuth success error:', err);
        setStatus('error');
        setErrorMsg(err.message || 'Authentication failed.');
      });
  }, [searchParams, setUser, router]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center max-w-sm w-full shadow-2xl">
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Signing you in…</h1>
            <p className="text-gray-400 text-sm">Please wait while we set up your account.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Welcome! 🎉</h1>
            <p className="text-gray-400 text-sm">Redirecting you to the chat…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Sign-in Failed</h1>
            <p className="text-gray-400 text-sm mb-6">{errorMsg}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-blue-500" />
      </div>
    }>
      <OAuthSuccessContent />
    </Suspense>
  );
}
