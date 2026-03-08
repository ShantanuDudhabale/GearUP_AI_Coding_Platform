'use client';

import { motion } from 'framer-motion';

const stats = [
    { display: '1M+', label: 'Lines of Code Explained', icon: '📝' },
    { display: '500K+', label: 'Happy Learners', icon: '🎓' },
    { display: '50+', label: 'Programming Languages', icon: '💻' },
    { display: '99.9%', label: 'Uptime Guarantee', icon: '⚡' },
];

export default function LandingStats() {
    return (
        <section id="stats" className="py-24 relative overflow-hidden bg-[#fafafa] dark:bg-gray-950">
            {/* Background elements */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[300px] bg-blue-400/10 dark:bg-blue-500/5 blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Trusted Worldwide
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative flex flex-col items-center text-center p-6 bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 backdrop-blur-xl rounded-3xl hover:bg-white/60 dark:hover:bg-white/[0.04] transition-all"
                        >
                            {/* Glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent rounded-3xl transition-all duration-500" />

                            <div className="text-3xl mb-4 opacity-90 group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-2">
                                {stat.display}
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium leading-tight max-w-[140px]">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
