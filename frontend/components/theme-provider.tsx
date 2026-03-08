'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import '../styles/header.css';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

export default function Header({ isDark, setIsDark }: HeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  if (!mounted) return null;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <div className="logo-icon">🚀</div>
          <span>CodeAI</span>
        </div>

        <nav className={`header-nav ${isMobileOpen ? 'open' : ''}`}>
          <a href="#features">Features</a>
          <a href="#demo">Demo</a>
          <a href="#stats">Impact</a>
          <a href="#footer">Contact</a>
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="btn-primary header-btn">Get Started</button>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            title="Toggle menu"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
