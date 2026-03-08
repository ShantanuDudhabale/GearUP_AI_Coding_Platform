'use client';

import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Play, BookOpen, Lightbulb, Code2 } from 'lucide-react';
import { ChatMessage } from '@/store/useAppStore';

interface AIResponseCardProps {
  message: ChatMessage;
}

const STEP_META = [
  { icon: Lightbulb, label: 'Step 1 — Explanation', color: 'text-amber-600 dark:text-amber-400' },
  { icon: BookOpen, label: 'Step 2 — Simple Example', color: 'text-blue-600 dark:text-blue-400' },
  { icon: Code2, label: 'Step 3 — Full Code', color: 'text-cyan-600 dark:text-cyan-400' },
];

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
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
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 transition-all">
            <Play className="w-3 h-3" /> Run
          </button>
        </div>
      </div>
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
    </div>
  );
}

export default function AIResponseCard({ message }: AIResponseCardProps) {
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const stepVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 16 } },
  };

  return (
    <motion.section
      id="response-card"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6"
    >
      {/* Steps */}
      {message.steps?.map((step, idx) => {
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
              <div className="text-gray-800 dark:text-white/80 leading-relaxed whitespace-pre-wrap font-medium">
                {step.content}
              </div>
            ) : (
              <CodeBlock code={step.content} language={step.language || message.language || 'javascript'} />
            )}
          </motion.div>
        );
      })}
    </motion.section>
  );
}
