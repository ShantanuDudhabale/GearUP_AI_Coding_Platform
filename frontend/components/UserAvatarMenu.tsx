'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LayoutDashboard, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import Link from 'next/link';

interface Props {
    variant?: 'sidebar' | 'header';
}

export default function UserAvatarMenu({ variant = 'sidebar' }: Props) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user, logout } = useAppStore();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        setMounted(true);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (!mounted || !user) return null;

    const initials = (() => {
        const name: string = user.username || user.email || '?';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    })();

    const handleLogout = () => {
        setOpen(false);
        logout();
        router.push('/');
    };

    const dropdown = (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: variant === 'header' ? -6 : 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: variant === 'header' ? -6 : 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute ${variant === 'header'
                        ? 'top-[calc(100%+8px)] right-0 w-60'
                        : 'bottom-[calc(100%+6px)] left-0 right-0'
                        } bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-[200]`}
                >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.username || 'User'}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-1.5">
                        <Link href="/dashboard" onClick={() => setOpen(false)}>
                            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                                    <LayoutDashboard size={14} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium">Dashboard</span>
                            </button>
                        </Link>

                        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Settings size={14} className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <span className="font-medium">Settings</span>
                        </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 p-1.5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                        >
                            <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                <LogOut size={14} className="text-red-500 dark:text-red-400" />
                            </div>
                            <span className="font-semibold">Log out</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // HEADER variant — compact avatar button, dropdown opens downward
    if (variant === 'header') {
        return (
            <div ref={menuRef} className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    title={user.username || user.email}
                >
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                        {initials}
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-white dark:border-gray-950" />
                    </div>
                    <span className="hidden lg:block text-sm font-semibold text-gray-800 dark:text-gray-100 max-w-[100px] truncate">
                        {user.username || 'User'}
                    </span>
                    <ChevronDown
                        size={13}
                        className={`hidden lg:block text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    />
                </button>
                {dropdown}
            </div>
        );
    }

    // SIDEBAR variant — full-width with name/email, dropdown opens upward
    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2.5 w-full px-2 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
                <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {initials}
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate leading-none mb-0.5">
                        {user.username || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate leading-none">
                        {user.email}
                    </p>
                </div>
                <ChevronUp
                    size={14}
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>
            {dropdown}
        </div>
    );
}
