import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import OfflineBanner from '@/components/OfflineBanner';
import CursorGlow from '@/components/CursorGlow';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code', display: 'swap' });

export const metadata: Metadata = {
  title: 'CodeMentor AI — Learn Coding With AI',
  description: 'Voice-first AI coding mentor for children aged 5–15. Speak your question, get step-by-step code guidance instantly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors`}>
        <Providers>
          <CursorGlow />
          <OfflineBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
