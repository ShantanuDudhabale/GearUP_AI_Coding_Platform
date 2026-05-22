'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import LandingHero from '@/components/LandingHero';
import LandingFeatures from '@/components/LandingFeatures';
import LandingStats from '@/components/LandingStats';
import LandingTestimonials from '@/components/LandingTestimonials';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const { setShowLoginModal, user } = useAppStore();

  // Redirect logged-in users away from landing page
  useEffect(() => {
    // No auto-redirect — user may want to visit landing page even logged in
  }, []);

  const handleGetStarted = () => {
    if (user) {
      router.push('/chat');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <main className="relative pt-16">
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
              Join thousands of learners already using CodeMentorAI to master coding with AI-powered guidance.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              🚀 Get Started Free
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
