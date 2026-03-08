'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            window.addEventListener('keydown', onKey);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const reset = () => { setEmail(''); setPassword(''); setName(''); setDob(''); setError(''); };

    const { setUser } = useAppStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all required fields.'); return; }
        if (mode === 'signup') {
            if (!name) { setError('Please fill in your name.'); return; }
            if (!dob) { setError('Please enter your date of birth.'); return; }
        }

        setIsLoading(true);
        try {
            const endpoint = mode === 'login' ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
            const payload = mode === 'login'
                ? { email, password }
                : { username: name, email, password, dob };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            // Set user and token in global state
            if (data.user && data.user.token) {
                setUser(data.user, data.user.token);
                onClose();
                reset();
                router.push('/chat');
            } else if (mode === 'signup') {
                // Handle registration without auto-login (though our backend returns user and token now)
                if (data.user) {
                    setUser(data.user, data.user.token);
                    onClose();
                    reset();
                    router.push('/chat');
                } else {
                    setMode('login');
                    setError('Registration successful, please log in.');
                }
            }
        } catch (err: unknown) {
            setError((err as Error).message || 'An error occurred during authentication');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocial = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 900));
        setIsLoading(false);
        onClose();
        router.push('/chat');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[200] bg-black/50"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, y: 24, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.97 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="pointer-events-auto w-full max-w-[420px] bg-white dark:bg-[#111] rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.18)] overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Top accent line */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70" />

                            <div className="px-8 pt-8 pb-8">
                                {/* Close button */}
                                <div className="flex items-center justify-between mb-7">
                                    <div>
                                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-400 dark:text-gray-500 mb-1">
                                            CodeMentorAI
                                        </p>
                                        <h2 className="text-[1.35rem] font-bold text-gray-900 dark:text-white tracking-tight">
                                            {mode === 'login' ? 'Sign in to your account' : 'Create an account'}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8 transition-all flex-shrink-0"
                                    >
                                        <X size={16} strokeWidth={2} />
                                    </button>
                                </div>

                                {/* Social buttons */}
                                <div className="grid grid-cols-2 gap-2.5 mb-5">
                                    {[
                                        {
                                            label: 'Google',
                                            icon: (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                            ),
                                        },
                                        {
                                            label: 'GitHub',
                                            icon: <Github size={16} className="text-gray-700 dark:text-black" />,
                                        },
                                    ].map(({ label, icon }) => (
                                        <button
                                            key={label}
                                            onClick={() => handleSocial()}
                                            disabled={isLoading}
                                            className="flex items-center justify-center gap-2.5 h-10 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/4 text-[13px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/8 transition-all disabled:opacity-50"
                                        >
                                            {icon}
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex-1 h-px bg-gray-100 dark:bg-white/8" />
                                    <span className="text-[11px] font-medium text-gray-400 dark:text-gray-600 tracking-wide">or</span>
                                    <div className="flex-1 h-px bg-gray-100 dark:bg-white/8" />
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-3.5">
                                    {mode === 'signup' && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginBottom: 14 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <label className="block text-[12px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 tracking-wide uppercase">
                                                    Full Name
                                                </label>
                                                <div className={`flex items-center h-11 px-3.5 rounded-xl border transition-all bg-gray-50 dark:bg-white/5 ${focusedField === 'name'
                                                    ? 'border-blue-500 ring-3 ring-blue-500/15 dark:ring-blue-500/20'
                                                    : 'border-gray-200 dark:border-white/10'
                                                    }`}>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={e => setName(e.target.value)}
                                                        onFocus={() => setFocusedField('name')}
                                                        onBlur={() => setFocusedField(null)}
                                                        placeholder="Your full name"
                                                        className="flex-1 bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none"
                                                    />
                                                </div>
                                            </motion.div>

                                            {/* date of birth field */}
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                animate={{ opacity: 1, height: 'auto', marginBottom: 14 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <label className="block text-[12px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 tracking-wide uppercase">
                                                    Date of Birth
                                                </label>
                                                <div className={`flex items-center h-11 px-3.5 rounded-xl border transition-all bg-gray-50 dark:bg-white/5 ${focusedField === 'dob'
                                                    ? 'border-blue-500 ring-3 ring-blue-500/15 dark:ring-blue-500/20'
                                                    : 'border-gray-200 dark:border-white/10'
                                                    }`}>
                                                    <input
                                                        type="date"
                                                        value={dob}
                                                        onChange={e => setDob(e.target.value)}
                                                        onFocus={() => setFocusedField('dob')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="flex-1 bg-transparent text-[14px] text-gray-900 dark:text-white outline-none"
                                                    />
                                                </div>
                                            </motion.div>

                                        </>
                                    )}

                                    <div>
                                        <label className="block text-[12px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 tracking-wide uppercase">
                                            Email
                                        </label>
                                        <div className={`flex items-center h-11 px-3.5 rounded-xl border transition-all bg-gray-50 dark:bg-white/5 ${focusedField === 'email'
                                            ? 'border-blue-500 ring-3 ring-blue-500/15 dark:ring-blue-500/20'
                                            : 'border-gray-200 dark:border-white/10'
                                            }`}>
                                            <Mail size={15} className="text-gray-400 dark:text-gray-600 mr-2.5 flex-shrink-0" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="you@example.com"
                                                autoComplete="email"
                                                className="flex-1 bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-[12px] font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                                                Password
                                            </label>
                                            {mode === 'login' && (
                                                <button type="button" className="text-[12px] text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                                    Forgot?
                                                </button>
                                            )}
                                        </div>
                                        <div className={`flex items-center h-11 px-3.5 rounded-xl border transition-all bg-gray-50 dark:bg-white/5 ${focusedField === 'password'
                                            ? 'border-blue-500 ring-3 ring-blue-500/15 dark:ring-blue-500/20'
                                            : 'border-gray-200 dark:border-white/10'
                                            }`}>
                                            <Lock size={15} className="text-gray-400 dark:text-gray-600 mr-2.5 flex-shrink-0" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                onFocus={() => setFocusedField('password')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="••••••••"
                                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                                className="flex-1 bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="ml-2 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors flex-shrink-0"
                                            >
                                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="text-[13px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg border border-red-100 dark:border-red-500/20"
                                            >
                                                {error}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="relative w-full h-11 mt-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {isLoading ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : null}
                                            {isLoading
                                                ? 'Please wait…'
                                                : mode === 'login'
                                                    ? 'Continue'
                                                    : 'Create account'}
                                            {!isLoading && (
                                                <ArrowRight size={15} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                                            )}
                                        </span>
                                        {/* Shimmer */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '200%' }}
                                            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
                                        />
                                    </button>
                                </form>

                                {/* Toggle */}
                                <p className="mt-5 text-center text-[13px] text-gray-500 dark:text-gray-400">
                                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                                    <button
                                        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                                        className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                    >
                                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                                    </button>
                                </p>

                                <p className="mt-4 text-center text-[11px] text-gray-400 dark:text-gray-600 leading-relaxed">
                                    By continuing, you agree to our{' '}
                                    <span className="underline cursor-pointer hover:text-gray-600">Terms of Service</span>
                                    {' '}and{' '}
                                    <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
