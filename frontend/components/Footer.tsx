'use client';

import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer id="footer" className="footer bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo.png"
              alt="GearUp Technologies Logo"
              className="h-8 w-auto"
            />
            <div>
              <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                CodeMentorAI
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                by GearUp Technologies 2026
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Learn coding smarter with AI-powered voice guidance. Empowering the next generation of developers.
          </p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Follow Us</span>
            <div className="social-links flex gap-3">
              <a href="#" title="Twitter" className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Twitter size={18} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a href="#" title="GitHub" className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Github size={18} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a href="#" title="LinkedIn" className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Linkedin size={18} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a href="#" title="Email" className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Mail size={18} className="text-gray-700 dark:text-gray-300" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
          <ul className="space-y-2">
            <li><a href="#features" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
            <li><a href="#demo" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Demo</a></li>
            <li><a href="#pricing" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a></li>
            <li><a href="#blog" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#about" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About GearUp</a></li>
            <li><a href="#careers" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</a></li>
            <li><a href="#press" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Press</a></li>
            <li><a href="#contact" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#privacy" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a></li>
            <li><a href="#security" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Security</a></li>
            <li><a href="#cookies" className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom with Enhanced Branding */}
      <div className="footer-bottom border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brand Statement */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="GearUp Technologies"
                  className="h-6 w-auto"
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">GearUp Technologies 2026</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Innovating Education Through AI</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  CodeMentorAI
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  AI-Powered Coding Education Platform by GearUp Technologies
                </p>
              </div>
            </div>
          </div>

          {/* Copyright & Credits */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-center md:text-left">
              <p className="text-gray-700 dark:text-gray-400">
                &copy; 2026 <span className="font-semibold text-gray-900 dark:text-white">GearUp Technologies</span>. All rights reserved.
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">
                CodeMentorAI - Empowering the next generation of developers
              </p>
            </div>
            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-400">
              <span>Made with</span>
              <Heart size={14} className="text-red-500 fill-red-500" />
              <span>by GearUp Technologies</span>
            </div>
          </div>

          {/* Version & Status */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600 dark:text-gray-500">
            <span>Version 2026.1 | CodeMentorAI by GearUp Technologies</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

