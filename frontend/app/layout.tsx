import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import OfflineBanner from '@/components/OfflineBanner';
<<<<<<< HEAD
import CursorGlow from '@/components/CursorGlow';
=======
import ErrorBoundary from '@/components/ErrorBoundary';
>>>>>>> origin/saurabh

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code', display: 'swap' });

export const metadata: Metadata = {
  title: 'CodeMentor AI — Learn Coding With AI | GearUp Technologies 2026',
  description: 'AI-powered coding mentor by GearUp Technologies 2026. Learn to code with voice-first guidance and step-by-step AI assistance.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors`}>
<<<<<<< HEAD
        <Providers>
          <CursorGlow />
          <OfflineBanner />
          {children}
        </Providers>
=======
        <ErrorBoundary>
          <Providers>
            <OfflineBanner />
            {children}
          </Providers>
        </ErrorBoundary>
>>>>>>> origin/saurabh
      </body>
    </html>
  );
}
