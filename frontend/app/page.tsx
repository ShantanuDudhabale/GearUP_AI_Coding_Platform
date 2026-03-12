'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import LoginModal from '@/components/LoginModal';
import LandingHero from '@/components/LandingHero';
import LandingFeatures from '@/components/LandingFeatures';
import LandingStats from '@/components/LandingStats';
import LandingTestimonials from '@/components/LandingTestimonials';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const { showLoginModal, setShowLoginModal, user } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      // If logged in, navigate to chat
      router.push('/chat');
    } else {
      // If not logged in, show login modal
      setShowLoginModal(true);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-gray-950" />;

  return (
    <main className="relative overflow-x-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* Login Modal — triggered from hero CTA or from Header's Get Started */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <LandingHero onGetStarted={handleGetStarted} />
      <LandingFeatures />
      <LandingStats />
      <LandingTestimonials />

      {/* CTA Band */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join 500,000+ learners already using CodeMentorAI to master coding.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            🚀 Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-12 bg-gray-900 dark:bg-black text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-2xl mb-3">🚀</p>
          <p className="font-bold text-white text-lg mb-2">CodeMentorAI</p>
          <p className="text-gray-500 text-sm mb-6">AI-powered coding education for the next generation</p>
          <div className="flex justify-center gap-6 text-gray-500 text-sm mb-8">
            <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
            <a href="#stats" className="hover:text-gray-300 transition-colors">About</a>
            <button onClick={handleGetStarted} className="hover:text-gray-300 transition-colors">
              Get Started
            </button>
          </div>
          <p className="text-gray-600 text-xs">© 2026 CodeMentorAI · Built for the next generation of coders 🚀</p>
        </div>
      </footer>
    </main>
  );
}
