'use client';

import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Play, BookOpen, Lightbulb, Code2 } from 'lucide-react';
import { ChatMessage } from '@/store/useAppStore';
import TypingText from './TypingText';

interface AIResponseCardProps {
  message: ChatMessage;
  isLatest?: boolean; // Flag to indicate if this is the latest message
}

const STEP_META = [
  { icon: Lightbulb, label: 'Step 1 — Explanation', color: 'text-amber-600 dark:text-amber-400' },
  { icon: BookOpen, label: 'Step 2 — Simple Example', color: 'text-blue-600 dark:text-blue-400' },
  { icon: Code2, label: 'Step 3 — Full Code', color: 'text-cyan-600 dark:text-cyan-400' },
];

function CodeBlock({ code, language, isLatest = false }: { code: string; language: string; isLatest?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(!isLatest);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRun = () => {
    // Only show preview for HTML/CSS/JavaScript
    if (['html', 'javascript', 'css', 'jsx', 'tsx'].includes(language.toLowerCase())) {
      setShowPreview(true);
    }
  };

  return (
    <>
      <div className="relative rounded-xl overflow-hidden mt-4 border border-cyan-500/20 dark:border-cyan-400/20">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-cyan-500/20">
          <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-widest">{language}</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-cyan-500/10 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/30 text-gray-700 dark:text-cyan-400 transition-all"
            >
              {copied ? <><Check className="w-3 h-3 text-green-500" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
            </button>
            <button 
              onClick={handleRun}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 transition-all"
            >
              <Play className="w-3 h-3" /> Run
            </button>
          </div>
        </div>
        {!showCode && isLatest ? (
          <div className="p-6 bg-gray-900 text-green-400 font-mono text-sm">
            <TypingText text={code} speed={420} onComplete={() => setShowCode(true)} />
            <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse" />
          </div>
        ) : (
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            customStyle={{
              margin: 0,
              padding: '1.25rem',
              background: 'rgba(15, 23, 42, 0.5)',
              fontSize: '0.88rem',
              lineHeight: '1.6',
              color: '#e5e7eb'
            }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-auto bg-white dark:bg-gray-950">
                <iframe
                  srcDoc={code}
                  className="w-full h-full border-none"
                  title="Code Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function AIResponseCard({ message, isLatest = false }: AIResponseCardProps) {
  const [visibleSteps, setVisibleSteps] = useState<number>(isLatest ? 0 : message.steps?.length || 0);
  
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: isLatest ? 0.08 : 0 } },
  };

  const stepVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 16 } },
  };

  // Show steps one by one ONLY for latest message
  useEffect(() => {
    if (isLatest && message.steps) {
      const timers = message.steps.map((_, index) =>
        setTimeout(() => {
          setVisibleSteps(prev => Math.max(prev, index + 1));
        }, index * 180)
      );

      return () => timers.forEach(clearTimeout);
    }
  }, [isLatest, message.steps]);

  return (
    <motion.section
      id="response-card"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6"
    >
      {/* Steps */}
      {message.steps?.slice(0, visibleSteps).map((step, idx) => {
        const meta = STEP_META[idx];
        const Icon = meta.icon;
        const bgColors = [
          'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700',
          'bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700',
          'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-300 dark:border-cyan-700',
        ];
        
        return (
          <motion.div
            key={step.id}
            variants={stepVariants}
            className={`relative rounded-2xl border p-6 ${bgColors[idx]}`}
          >
            {/* Step badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800">
                <Icon className={`w-5 h-5 ${meta.color}`} />
              </div>
              <span className={`font-bold text-sm ${meta.color}`}>{meta.label}</span>
              <span className="ml-auto text-xs text-gray-600 dark:text-white/35 font-mono bg-white dark:bg-white/5 px-2.5 py-1 rounded-lg">
                {message.language || 'Code'}
              </span>
            </div>

            {/* Content */}
            {step.id !== 'code' ? (
              <div className="text-gray-800 dark:text-white/80 leading-relaxed font-medium">
                {isLatest ? (
                  <TypingText text={step.content} speed={260} />
                ) : (
                  step.content
                )}
              </div>
            ) : (
              <CodeBlock code={step.content} language={step.language || message.language || 'javascript'} isLatest={isLatest} />
            )}
          </motion.div>
        );
      })}
    </motion.section>
  );
}
