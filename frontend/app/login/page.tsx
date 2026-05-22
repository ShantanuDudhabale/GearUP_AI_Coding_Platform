'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function LoginPage() {
    const router = useRouter();
    const { setShowLoginModal } = useAppStore();

    useEffect(() => {
        setShowLoginModal(true);
        router.replace('/');
    }, [router, setShowLoginModal]);

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );
}
