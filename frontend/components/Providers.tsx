'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';

export default function Providers({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Dashboard and Chat have their own layouts — no global header there
  const isDashboardOrChat = pathname?.startsWith('/dashboard') || pathname?.startsWith('/chat');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    // Default light — only switch dark if explicitly saved
    const isDarkMode = savedTheme === 'dark';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>
      {!isDashboardOrChat && mounted && (
        <Header isDark={isDark} setIsDark={setIsDark} showDashboardBtn />
      )}
      {children}
    </>
  );
}
