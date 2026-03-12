'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Trophy, Zap, Flame, Target, ArrowLeft, LayoutDashboard, Code, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { stats, fetchStats } = useAppStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchStats();
    }, [fetchStats]);

    if (!mounted || !stats) return <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]" />;

    const cards = [
        { icon: Trophy, label: 'Completed Lessons', value: stats.completedLessons || 0, color: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { icon: Zap, label: 'Saved Snippets', value: stats.savedCodes || 0, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { icon: Flame, label: 'Current Streak', value: `${stats.streak || 0} days`, color: 'from-red-500 to-orange-600', bg: 'bg-red-50 dark:bg-red-900/20' },
        { icon: Target, label: 'Total XP', value: stats.xp || 0, color: 'from-purple-500 to-fuchsia-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white pb-20">
            {/* Header Area */}
            <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
                            <h1 className="text-xl font-bold tracking-tight">Your Progress</h1>
                        </div>
                    </div>

                    <Link href="/chat">
                        <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                            Resume Learning
                        </button>
                    </Link>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                {/* Hero Stats */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className={`relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow`}
                                >
                                    <div className={`absolute top-0 right-0 p-4 opacity-5 pointer-events-none`}>
                                        <Icon size={80} />
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${card.color} text-white shadow-inner`}>
                                        <Icon size={20} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
                                    <p className="text-3xl font-extrabold tracking-tight">{card.value}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Weak Topics */}
                    <div className="lg:col-span-2 space-y-8">
                        {stats?.weakTopics && stats.weakTopics.length > 0 ? (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                            <Target size={18} className="text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <h2 className="text-lg font-bold">Topics to Review</h2>
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium">{stats.weakTopics.length} areas needed</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {stats.weakTopics.map((topic, i) => (
                                        <div key={i} className="flex flex-col gap-1 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/10">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">{topic}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Needs more practice</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        ) : (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center"
                            >
                                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                                    <BookOpen size={28} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">You&apos;re doing great!</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                                    You have no weak topics currently. Keep chatting with the AI mentor to explore new concepts.
                                </p>
                            </motion.section>
                        )}

                        {/* Recent Activity placeholder (optional, can be static for now) */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                    <Code size={18} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className="text-lg font-bold">Recent Learning Path</h2>
                            </div>
                            <div className="space-y-4">
                                {/* Dummy timeline */}
                                {[
                                    { title: 'Asked about React Hooks', time: 'Today' },
                                    { title: 'Completed basic Python syntax', time: 'Yesterday' },
                                    { title: 'Earned "First Question" badge', time: '2 days ago' }
                                ].map((act, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-indigo-400 dark:bg-indigo-600 mt-1.5" />
                                            {i !== 2 && <div className="flex-1 w-px bg-gray-200 dark:bg-gray-800 my-1" />}
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{act.title}</p>
                                            <p className="text-xs text-gray-500">{act.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Column - Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold mb-6">Badges Earned</h2>
                            {stats?.badges && stats.badges.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {stats.badges.map((b: string, i: number) => (
                                        <div key={i} className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                                            <div className="text-3xl mb-2 filter drop-shadow-md">🏆</div>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                                                {b.replace('_', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-3 opacity-50 grayscale">🏆</div>
                                    <p className="text-sm text-gray-500 font-medium">No badges yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Start learning to earn</p>
                                </div>
                            )}
                        </section>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
