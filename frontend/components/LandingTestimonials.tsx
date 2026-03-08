'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Aarav Sharma',
        role: 'Student, Age 12',
        avatar: 'AS',
        avatarColor: 'from-blue-400 to-blue-600',
        text: 'CodeMentorAI helped me understand loops and functions in just one session! The voice feature is amazing — I just say my question and get a perfect explanation.',
        stars: 5,
    },
    {
        name: 'Priya Patel',
        role: 'Parent of a 10-year-old',
        avatar: 'PP',
        avatarColor: 'from-pink-400 to-rose-600',
        text: "My daughter went from knowing nothing to building her first game in 2 weeks. The step-by-step guidance is brilliant. It's like having a personal tutor 24/7!",
        stars: 5,
    },
    {
        name: 'Rahul Gupta',
        role: 'CS Teacher',
        avatar: 'RG',
        avatarColor: 'from-green-400 to-emerald-600',
        text: "I recommend CodeMentorAI to all my students. The AI explains concepts at exactly the right level, and the code examples are clean and educational.",
        stars: 5,
    },
    {
        name: 'Sophia Chen',
        role: 'Student, Age 15',
        avatar: 'SC',
        avatarColor: 'from-purple-400 to-violet-600',
        text: "I was stuck on recursion for weeks. One voice question on CodeMentorAI and it all clicked. The animations and explanations are so much better than textbooks.",
        stars: 5,
    },
    {
        name: 'Arjun Mehta',
        role: 'Homeschool Student, Age 11',
        avatar: 'AM',
        avatarColor: 'from-yellow-400 to-orange-500',
        text: 'Learning Python is actually fun now! The AI remembers what I asked before and builds on it. I love earning badges when I complete lessons.',
        stars: 5,
    },
    {
        name: 'Ms. Linda Ray',
        role: 'Elementary School Teacher',
        avatar: 'LR',
        avatarColor: 'from-cyan-400 to-cyan-600',
        text: "An incredible tool for young coders. The interface is clean, the explanations are age-appropriate, and kids absolutely love using it every day!",
        stars: 5,
    },
];

export default function LandingTestimonials() {
    return (
        <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300 text-sm font-semibold rounded-full mb-4">
                        ⭐ Loved by Learners
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        What People Say
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        Real stories from students, parents, and teachers who love CodeMentorAI.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                            className="relative p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col gap-4 transition-all group"
                        >
                            {/* Quote Icon */}
                            <Quote size={24} className="text-blue-200 dark:text-blue-900 absolute top-4 right-4" />

                            {/* Stars */}
                            <div className="flex gap-1">
                                {Array.from({ length: t.stars }).map((_, j) => (
                                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-1">
                                &quot;{t.text}&quot;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
