'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { generateLesson } from '@/lib/mockAI';
import VoiceHero from '@/components/VoiceHero';
import AIResponseCard from '@/components/AIResponseCard';
import { ChatMessage } from '@/store/useAppStore';
import {
    MessageSquare, Plus, Trash2, Clock, MessageCircle, X,
    ArrowLeft, LayoutDashboard, Menu
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserAvatarMenu from '@/components/UserAvatarMenu';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function ChatPage() {
    const router = useRouter();
    const {
        isProcessing, setProcessing,
        currentSessionId, sessions,
        createNewSession, addMessageToSession,
        unlockBadge, showConfetti, setShowConfetti,
        loadSession, deleteSession,
    } = useAppStore();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mounted, setMounted] = useState(false);
    const user = useAppStore(s => s.user);

    // All hooks must be called unconditionally before any early returns
    useEffect(() => {
        useAppStore.setState({ currentSessionId: null });
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !user) {
            router.push('/');
        }
    }, [user, router, mounted]);

    useEffect(() => {
        if (showConfetti) {
            const t = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(t);
        }
    }, [showConfetti, setShowConfetti]);

    const activeSession = currentSessionId
        ? sessions.find(s => s.id === currentSessionId) || null
        : null;

    const handleSubmit = useCallback(async (query: string) => {
        if (!query.trim()) return;
        setProcessing(true);
        let sessionId = currentSessionId;
        if (!sessionId) sessionId = createNewSession();

        const userMsg: ChatMessage = {
            id: Date.now().toString() + '-user',
            role: 'user', content: query,
            timestamp: new Date().toISOString()
        };
        addMessageToSession(sessionId, userMsg);

        const updatedSession = useAppStore.getState().sessions.find(s => s.id === sessionId);
        const messagesSoFar = updatedSession ? updatedSession.messages : [userMsg];
        const steps = await generateLesson(messagesSoFar);

        const aiMsg: ChatMessage = {
            id: Date.now().toString() + '-ai',
            role: 'assistant', content: '', steps,
            timestamp: new Date().toISOString()
        };
        addMessageToSession(sessionId, aiMsg);
        unlockBadge('first_question');
        setShowConfetti(true);
        setProcessing(false);
        setTimeout(() => {
            document.getElementById('chat-bottom')?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
    }, [setProcessing, currentSessionId, createNewSession, addMessageToSession, unlockBadge, setShowConfetti]);

    const handleNewChat = () => {
        createNewSession();
        window.scrollTo({ top: 0 });
    };

    const handleDeleteSession = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteSession(id);
    };

    // Show loading screen until mounted and authenticated
    if (!mounted || !user) {
        return <div className="h-screen w-full bg-gray-50 dark:bg-gray-950" />;
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

            {showConfetti && (
                <Confetti recycle={false} numberOfPieces={240}
                    colors={['#6C63FF', '#FFB703', '#00C2FF', '#ff6b35', '#ffffff']}
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: 9990 }}
                />
            )}

            {/* ─── Sidebar ───────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-[90] lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed lg:relative top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-[100] lg:z-auto flex flex-col shadow-2xl lg:shadow-none flex-shrink-0"
                        >
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                    <Link href="/" className="flex items-center gap-2 group">
                                        <span className="text-2xl">🚀</span>
                                        <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                            CodeMentorAI
                                        </span>
                                    </Link>
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all font-medium"
                                >
                                    <ArrowLeft size={15} />
                                    Back to Home
                                </Link>
                            </div>

                            <div className="flex-1 flex flex-col p-3 overflow-y-auto gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleNewChat}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/30 transition-all"
                                >
                                    <Plus size={16} />
                                    New Chat
                                </motion.button>
                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 mt-3 mb-1">
                                    Chat History
                                </p>
                                {sessions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                        <MessageCircle size={40} className="text-gray-300 dark:text-gray-700 mb-3" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No chats yet</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        {sessions.map((session) => {
                                            const isActive = session.id === currentSessionId;
                                            const date = new Date(session.updatedAt);
                                            const isToday = new Date().toDateString() === date.toDateString();
                                            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            const dateStr = isToday ? timeStr : date.toLocaleDateString([], { month: 'short', day: 'numeric' });

                                            return (
                                                <motion.div
                                                    key={session.id}
                                                    whileHover={{ x: 2 }}
                                                    onClick={() => { loadSession(session.id); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                                                    className={`group flex items-start gap-2 w-full px-3 py-3 rounded-xl cursor-pointer transition-all ${isActive
                                                        ? 'bg-blue-100 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-800'
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800/60 border border-transparent'
                                                        }`}
                                                >
                                                    <MessageSquare size={14} className={`mt-0.5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${isActive ? 'text-blue-900 dark:text-blue-100' : 'text-gray-800 dark:text-gray-200'}`}>
                                                            {session.title || 'New Chat'}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <Clock size={10} className="text-gray-400" />
                                                            <span className={`text-xs ${isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400'}`}>{dateStr}</span>
                                                            <span className="text-gray-300 dark:text-gray-600">·</span>
                                                            <span className={`text-xs ${isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400'}`}>{session.messages.length} msgs</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={e => handleDeleteSession(e, session.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-all flex-shrink-0"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                                <UserAvatarMenu />
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ─── Main Content ──────────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <div className="flex-shrink-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Menu size={18} />
                    </motion.button>

                    <span className="font-semibold text-gray-800 dark:text-white text-sm">
                        {activeSession ? activeSession.title || 'Chat' : 'New Chat'}
                    </span>

                    <div className="flex-1" />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNewChat}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold transition-all"
                    >
                        <Plus size={15} />
                        New Chat
                    </motion.button>

                    <Link href="/dashboard" className="hidden sm:block">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg text-sm font-semibold transition-all hover:bg-purple-200 dark:hover:bg-purple-900/60"
                        >
                            <LayoutDashboard size={15} />
                            Dashboard
                        </motion.button>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6 min-h-full">
                        {!activeSession || activeSession.messages.length === 0 ? (
                            <VoiceHero onSubmit={handleSubmit} />
                        ) : (
                            <div className="flex flex-col gap-6 w-full">
                                <AnimatePresence>
                                    {activeSession.messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="w-full"
                                        >
                                            {msg.role === 'user' ? (
                                                <div className="flex justify-end w-full px-4 mb-2">
                                                    <div className="bg-blue-100 dark:bg-blue-950/50 text-gray-900 dark:text-white px-6 py-4 rounded-3xl rounded-tr-sm max-w-[80%] border border-blue-300 dark:border-blue-700 shadow-lg">
                                                        <p className="font-medium text-lg">{msg.content}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                msg.steps && <AIResponseCard message={msg} />
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {isProcessing && (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-3 py-4 px-4"
                                        >
                                            <div className="flex gap-1.5">
                                                {[0, 1, 2].map(i => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-2.5 h-2.5 bg-blue-500 rounded-full"
                                                        animate={{ y: [0, -8, 0] }}
                                                        transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Crafting your lesson…</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div id="chat-bottom" className="pt-6 border-t border-gray-200 dark:border-gray-800">
                                    <VoiceHero onSubmit={handleSubmit} compact={true} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
