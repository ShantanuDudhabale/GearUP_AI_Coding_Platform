'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import {
    Trophy, Zap, Flame, Target, ArrowLeft, LayoutDashboard,
    Code, BookOpen, TrendingUp, Star, Clock, Activity
} from 'lucide-react';
import Link from 'next/link';

// ─── Helpers ───────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
}

function xpToNextLevel(level: number): number {
    return level * 200; // 200 XP per level
}

function langColor(lang: string): string {
    const colors: Record<string, string> = {
        python: '#3B82F6', javascript: '#EAB308', typescript: '#6366F1',
        java: '#F97316', c: '#06B6D4', 'c++': '#EC4899', rust: '#F59E0B',
        go: '#10B981', ruby: '#EF4444', php: '#8B5CF6',
    };
    return colors[lang.toLowerCase()] || '#6B7280';
}

function diffBadgeClass(diff: string): string {
    switch (diff) {
        case 'too easy': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
        case 'easy': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
        case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
        case 'hard': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
        case 'too hard': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
        default: return 'bg-gray-100 dark:bg-gray-800 text-gray-500';
    }
}

// ─── Components ────────────────────────────────────────────────────────────

function XPBar({ xp, level }: { xp: number; level: number }) {
    const needed = xpToNextLevel(level);
    const pct = Math.min(100, Math.round((xp % needed) / needed * 100));
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Level {level}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {xp % needed} / {needed} XP to Level {level + 1}
                </span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{xp} total XP earned</p>
        </div>
    );
}

function LanguageBar({ stats }: { stats: Record<string, number> }) {
    const entries = Object.entries(stats).sort(([, a], [, b]) => b - a).slice(0, 6);
    if (entries.length === 0) return (
        <p className="text-sm text-gray-400 text-center py-4">No language data yet. Start chatting!</p>
    );
    const max = entries[0][1];
    return (
        <div className="space-y-3">
            {entries.map(([lang, count]) => (
                <div key={lang}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{lang}</span>
                        <span className="text-xs text-gray-500">{count} uses</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round((count / max) * 100)}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: langColor(lang) }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const { stats, fetchStats, recentInteractions, fetchRecentInteractions, user } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchStats();
        fetchRecentInteractions();
    }, [fetchStats, fetchRecentInteractions]);

    if (!mounted) return <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]" />;

    const cards = [
        {
            icon: Trophy, label: 'Questions Solved', value: stats.completedLessons || 0,
            color: 'from-yellow-500 to-amber-600', sub: 'all time'
        },
        {
            icon: Zap, label: 'Total Interactions', value: stats.savedCodes || 0,
            color: 'from-blue-500 to-cyan-600', sub: 'all time'
        },
        {
            icon: Flame, label: 'Current Streak', value: `${stats.streak || 0}`,
            color: 'from-red-500 to-orange-600', sub: `Best: ${stats.highestStreak || 0} days`
        },
        {
            icon: Star, label: 'Total XP', value: stats.xp || 0,
            color: 'from-purple-500 to-fuchsia-600', sub: `Level ${stats.level || 1}`
        },
    ];

    const hasLangStats = Object.keys(stats.languageStats || {}).length > 0;
    const hasActivity = recentInteractions && recentInteractions.length > 0;

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/chat">
                            <button className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <LayoutDashboard size={18} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight leading-none">Your Dashboard</h1>
                                {user?.username && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.username}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <Link href="/chat">
                        <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                            Resume Learning
                        </button>
                    </Link>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

                {/* ── Stat Cards ────── */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Overview</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {cards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08, duration: 0.4 }}
                                    className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <Icon size={70} />
                                    </div>
                                    <div className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center bg-gradient-to-br ${card.color} text-white shadow-inner`}>
                                        <Icon size={17} />
                                    </div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{card.label}</p>
                                    <p className="text-2xl font-extrabold tracking-tight">{card.value}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">{card.sub}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* ── XP Progress ────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-8"
                >
                    <div className="flex items-center gap-2 mb-5">
                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <TrendingUp size={18} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-lg font-bold">XP Progress</h2>
                    </div>
                    <XPBar xp={stats.xp || 0} level={stats.level || 1} />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── Left: Activity + Weak Topics ────── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Recent Activity */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                    <Activity size={18} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className="text-lg font-bold">Recent Activity</h2>
                                {hasActivity && (
                                    <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                                        {recentInteractions.length} recent
                                    </span>
                                )}
                            </div>

                            {hasActivity ? (
                                <div className="space-y-0">
                                    {recentInteractions.map((item, i) => (
                                        <div key={item._id} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${item.type === 'like' ? 'bg-green-400' : 'bg-red-400'}`} />
                                                {i < recentInteractions.length - 1 && (
                                                    <div className="flex-1 w-px bg-gray-100 dark:bg-gray-800 my-1" />
                                                )}
                                            </div>
                                            <div className="pb-4 flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {item.questionText}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    {item.detectedLanguage && (
                                                        <span
                                                            className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded capitalize"
                                                            style={{
                                                                backgroundColor: langColor(item.detectedLanguage) + '20',
                                                                color: langColor(item.detectedLanguage)
                                                            }}
                                                        >
                                                            <Code size={10} />
                                                            {item.detectedLanguage}
                                                        </span>
                                                    )}
                                                    {item.dificultyLevel && (
                                                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium capitalize ${diffBadgeClass(item.dificultyLevel)}`}>
                                                            {item.dificultyLevel}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                        <Clock size={10} /> {timeAgo(item.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <BookOpen size={32} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                                    <p className="text-sm text-gray-500 font-medium">No activity yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Start chatting with the AI to track your learning.</p>
                                </div>
                            )}
                        </motion.section>

                        {/* Language Stats */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Code size={18} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-lg font-bold">Language Usage</h2>
                                {stats.mostUsedLanguage && (
                                    <span className="ml-auto text-xs text-gray-500">
                                        Most used: <span className="font-semibold capitalize text-gray-700 dark:text-gray-300">{stats.mostUsedLanguage}</span>
                                    </span>
                                )}
                            </div>
                            <LanguageBar stats={stats.languageStats || {}} />
                        </motion.section>
                    </div>

                    {/* ── Right: Badges + Topics ────── */}
                    <div className="space-y-8">
                        {/* Badges */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <h2 className="text-lg font-bold mb-5">Badges Earned</h2>
                            {stats?.badges && stats.badges.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {stats.badges.map((b: string, i: number) => (
                                        <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                                            <div className="text-2xl mb-2">🏆</div>
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 leading-tight">
                                                {b.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="text-3xl mb-2 opacity-30 grayscale">🏆</div>
                                    <p className="text-sm text-gray-500 font-medium">No badges yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Start learning to earn</p>
                                </div>
                            )}
                        </motion.section>

                        {/* Topic Focus */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-5">
                                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <Target size={18} className="text-orange-600 dark:text-orange-400" />
                                </div>
                                <h2 className="text-lg font-bold">Topic Focus</h2>
                            </div>
                            {Object.keys(stats.topicStats || {}).length > 0 ? (
                                <div className="space-y-2">
                                    {Object.entries(stats.topicStats)
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 5)
                                        .map(([topic, count]) => (
                                            <div key={topic} className="flex items-center justify-between p-2.5 rounded-xl border border-orange-50 dark:border-orange-900/20 bg-orange-50/50 dark:bg-orange-950/10">
                                                <span className="text-sm font-semibold capitalize text-gray-800 dark:text-gray-200">{topic}</span>
                                                <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">{count}×</span>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-400">No topics tracked yet</p>
                                </div>
                            )}
                        </motion.section>
                    </div>
                </div>
            </main>
        </div>
    );
}
