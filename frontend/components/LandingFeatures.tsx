'use client';

import { motion } from 'framer-motion';
import { Mic, Code, Brain, Zap, Sparkles, Shield } from 'lucide-react';

const features = [
    {
        icon: Mic,
        title: 'Voice Commands',
        description: 'Speak your coding question naturally and receive instant, context-aware AI responses.',
        color: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-800',
        iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
        icon: Code,
        title: 'Live Code Examples',
        description: 'Get ready-to-run code snippets in Python, JS, and more with step-by-step explanations.',
        color: 'from-cyan-500 to-cyan-600',
        bg: 'bg-cyan-50 dark:bg-cyan-950/30',
        border: 'border-cyan-200 dark:border-cyan-800',
        iconBg: 'bg-cyan-100 dark:bg-cyan-900/50',
        iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
        icon: Brain,
        title: 'Smart Learning Path',
        description: 'AI adapts to your skill level and creates a personalized curriculum just for you.',
        color: 'from-purple-500 to-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-200 dark:border-purple-800',
        iconBg: 'bg-purple-100 dark:bg-purple-900/50',
        iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Get meaningful answers in under 2 seconds with our optimized AI inference engine.',
        color: 'from-yellow-500 to-orange-500',
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-200 dark:border-yellow-800',
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
        iconColor: 'text-yellow-600 dark:text-yellow-500',
    },
    {
        icon: Sparkles,
        title: 'Step-by-Step Guidance',
        description: 'Complex topics broken into simple, digestible steps so you never feel overwhelmed.',
        color: 'from-pink-500 to-rose-500',
        bg: 'bg-pink-50 dark:bg-pink-950/30',
        border: 'border-pink-200 dark:border-pink-800',
        iconBg: 'bg-pink-100 dark:bg-pink-900/50',
        iconColor: 'text-pink-600 dark:text-pink-400',
    },
    {
        icon: Shield,
        title: 'Safe & Private',
        description: 'All your chats are stored locally on your device. Nothing is sent to third parties.',
        color: 'from-green-500 to-emerald-500',
        bg: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
        iconBg: 'bg-green-100 dark:bg-green-900/50',
        iconColor: 'text-green-600 dark:text-green-400',
    },
];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingFeatures() {
    return (
        <section id="features" className="py-24 bg-white dark:bg-gray-950">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full mb-4">
                        ✨ Everything You Need
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Built from the ground up to make coding education accessible, fun, and effective for learners of all ages.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={i}
                                variants={item}
                                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                className={`group p-6 rounded-2xl border ${f.bg} ${f.border} transition-all duration-300 cursor-default`}
                            >
                                <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} className={f.iconColor} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
