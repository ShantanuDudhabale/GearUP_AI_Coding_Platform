'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import UserAvatarMenu from './UserAvatarMenu';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  onGetStarted?: () => void;
  showDashboardBtn?: boolean;
  onSidebarToggle?: () => void;
}

export default function Header({ isDark, setIsDark, onGetStarted, showDashboardBtn, onSidebarToggle }: HeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const setShowLoginModal = useAppStore(s => s.setShowLoginModal);
  const user = useAppStore(s => s.user);

  const handleGetStarted = () => {
    if (onGetStarted) onGetStarted();
    else setShowLoginModal(true);
  };


  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/80 dark:border-gray-800/80'
        : 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Sidebar toggle (dashboard) or Logo */}
          <div className="flex items-center gap-3">
            {onSidebarToggle && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSidebarToggle}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Toggle Sidebar"
              >
                <Menu size={20} />
              </motion.button>
            )}
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <motion.div
                className="text-3xl"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                🚀
              </motion.div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                CodeMentorAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm">
              Features
            </a>
            <a href="#demo" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm">
              Demo
            </a>
            <a href="#stats" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm">
              Impact
            </a>
            <a href="#footer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm">
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Dashboard Button */}
            {showDashboardBtn && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/chat"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  <LayoutDashboard size={16} />
                  Chat
                </Link>
              </motion.div>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Login/User Menu - Show based on auth state (wait for mount to prevent hydration mismatch) */}
            {!mounted ? (
              <div className="w-[84px] h-[36px] hidden md:block" />
            ) : !user ? (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGetStarted}
                className="hidden md:block px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold text-sm transition-all shadow-md shadow-blue-500/30"
              >
                Log In
              </motion.button>
            ) : (
              <div className="hidden md:block">
                <UserAvatarMenu variant="header" />
              </div>
            )}

            {/* Mobile Hamburger */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 text-gray-700 dark:text-gray-200"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              title="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-800"
            >
              <div className="pb-4 flex flex-col gap-1 pt-2">
                <a href="#features" onClick={() => setIsMobileOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors">
                  Features
                </a>
                <a href="#demo" onClick={() => setIsMobileOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors">
                  Demo
                </a>
                <a href="#stats" onClick={() => setIsMobileOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors">
                  Impact
                </a>
                {showDashboardBtn && (
                  <Link href="/dashboard" className="mx-4 px-4 py-2 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg font-medium mt-1">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                )}
                {!user && (
                  <button
                    onClick={() => {
                      handleGetStarted();
                      setIsMobileOpen(false);
                    }}
                    className="mx-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold mt-2"
                  >
                    Log In
                  </button>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
