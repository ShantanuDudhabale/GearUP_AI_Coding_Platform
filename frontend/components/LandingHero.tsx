'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface LandingHeroProps {
    onGetStarted: () => void;
}

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const dots: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }> = [];
        for (let i = 0; i < 55; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                size: Math.random() * 1.8 + 0.5,
                alpha: Math.random() * 0.3 + 0.07,
            });
        }

        let id: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach(d => {
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99,102,241,${d.alpha})`;
                ctx.fill();
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
                if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
            });

            // Draw faint connecting lines
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            id = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
    }, []);

    const words = ['Build.', 'Create.', 'Learn.'];

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-gray-950"
        >
            {/* Canvas network */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Big light blue orb background */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="absolute w-[800px] h-[800px] rounded-full bg-cyan-300/20 dark:bg-cyan-500/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-400/20 dark:bg-blue-500/15 blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-60" />
            </div>

            <motion.div
                style={{ y, opacity }}
                className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center"
            >
                {/* Eyebrow label */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="inline-flex items-center gap-2 mb-7"
                >
                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[12px] font-semibold tracking-wide">
                        <Sparkles size={12} />
                        AI-Powered Coding Education
                    </span>
                </motion.div>

                {/* Headline — well-proportioned */}
                <h1 className="text-[2.6rem] sm:text-[3.4rem] md:text-[4rem] lg:text-[4.6rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-gray-900 dark:text-white mb-5 min-h-[1.2em]">
                    {words.map((word, i) => (
                        <motion.span
                            key={word}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 + 0.1, duration: 0.5, ease: 'easeOut' }}
                            className="mr-3 inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent"
                        >
                            {word}
                        </motion.span>
                    ))}
                    <br className="hidden sm:block" />
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.8, ease: 'easeOut' }}
                        className="relative inline-block mt-2"
                    >
                        <span className="relative z-10">Powered by GearUP</span>
                        <motion.span
                            className="absolute inset-x-0 bottom-1 h-[3px] rounded-full bg-gradient-to-r from-blue-600 to-violet-600 opacity-40"
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.9, delay: 1.2, ease: 'easeOut' }}
                        />
                    </motion.span>
                </h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.25, ease: 'easeOut' }}
                    className="text-[1rem] sm:text-[1.1rem] md:text-[1.15rem] text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-9 leading-relaxed"
                >
                    Ask a question by voice or text. Get instant, step-by-step AI guidance
                    tailored for beginners aged 5–15.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                    <button
                        onClick={onGetStarted}
                        className="group flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[14px] font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                    >
                        Get Started
                        <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <a
                        href="#features"
                        className="flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                    >
                        See how it works
                    </a>
                </motion.div>

                {/* Social proof strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="mt-10 flex items-center justify-center gap-5 text-[12px] text-gray-400 dark:text-gray-500"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                            {['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400', 'bg-violet-400'].map((c, i) => (
                                <div key={i} className={`w-6 h-6 rounded-full border-2 border-white dark:border-gray-950 ${c}`} />
                            ))}
                        </div>
                        <span>500K+ learners</span>
                    </div>
                    <span className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <svg key={i} className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                        <span className="ml-1">4.9 / 5</span>
                    </div>
                    <span className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
                    <span>Free forever</span>
                </motion.div>
            </motion.div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#fafafa] dark:from-gray-950 to-transparent pointer-events-none" />
        </section>
    );
}
