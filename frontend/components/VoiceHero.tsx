'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';

interface VoiceHeroProps {
  onSubmit: (query: string) => Promise<void>;
  compact?: boolean;
}

// Local type declarations for Web Speech API
interface ISpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: { length: number;[i: number]: { isFinal: boolean;[j: number]: { transcript: string } } };
}
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: ISpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export default function VoiceHero({ onSubmit, compact = false }: VoiceHeroProps) {
  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as unknown as { SpeechRecognition?: new () => ISpeechRecognition; webkitSpeechRecognition?: new () => ISpeechRecognition }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: new () => ISpeechRecognition }).webkitSpeechRecognition;
    if (!SR) {
      setHasSpeechSupport(false);
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (e: ISpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const handleSubmit = useCallback(async (query: string) => {
    const finalQuery = query.trim() || textInput.trim();
    if (!finalQuery || isProcessing) return;

    setIsProcessing(true);
    try {
      await onSubmit(finalQuery);
    } finally {
      setIsProcessing(false);
      setTextInput('');
      setTranscript('');
    }
  }, [textInput, isProcessing, onSubmit]);

  const toggleMic = useCallback(() => {
    if (isProcessing) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim()) {
        handleSubmit(transcript.trim());
      }
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  }, [isListening, isProcessing, transcript, handleSubmit]);

  const handleTextSubmit = () => {
    handleSubmit(textInput);
  };

  // Compact mode for chat footer
  if (compact) {
    return (
      <div className="w-full flex items-center gap-2 p-3 bg-white/5 dark:bg-black/20 rounded-2xl border border-blue-500/20 dark:border-blue-400/20 hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
          placeholder="Type your question here…"
          className="flex-1 bg-transparent text-gray-900 dark:text-white/80 placeholder-gray-500 dark:placeholder-white/30 outline-none text-sm px-2 font-medium"
          disabled={isProcessing}
        />
        <button
          onClick={() => toggleMic()}
          className="p-2 rounded-full bg-blue-500/80 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-all disabled:opacity-50"
          title="Use voice input"
          disabled={isProcessing}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        <button
          onClick={handleTextSubmit}
          disabled={!(textInput.trim() || transcript.trim()) || isProcessing}
          className="p-2.5 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-30 text-white rounded-xl transition-all"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden py-12">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-400/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8 px-4 max-w-3xl w-full">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Learn Coding
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              With AI
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-white/60 font-medium">
            Speak or type your coding question — get instant AI guidance
          </p>
        </motion.div>

        {/* Mic Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <AnimatePresence>
            {isListening && (
              <>
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute rounded-full border-2 border-red-500/40 dark:border-red-400/30"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1 + ring * 0.5, opacity: 0 }}
                    transition={{ duration: 2, delay: ring * 0.4, repeat: Infinity }}
                    style={{ width: 120, height: 120 }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <motion.button
            onClick={toggleMic}
            disabled={isProcessing}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.07 }}
            className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-5xl select-none z-10 transition-all duration-300 ${isListening
              ? 'bg-gradient-to-br from-red-500 to-red-600 dark:from-red-500 dark:to-red-600 shadow-2xl shadow-red-500/50'
              : 'bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 shadow-2xl shadow-blue-500/50'
              } ${isProcessing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isProcessing ? (
              <Loader2 className="w-12 h-12 animate-spin" />
            ) : isListening ? (
              <MicOff className="w-12 h-12" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </motion.button>
        </motion.div>

        {/* Status */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 dark:text-white/50 text-sm font-medium"
        >
          {isListening
            ? '🔴 Listening… tap to stop'
            : isProcessing
              ? '⏳ Processing…'
              : hasSpeechSupport
                ? 'Tap the mic or type below'
                : 'Voice not supported in this browser'}
        </motion.p>

        {/* Live transcript */}
        <AnimatePresence>
          {(isListening || transcript) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-300 dark:border-blue-700"
            >
              <p className="text-gray-900 dark:text-white font-medium">
                {transcript || 'Listening…'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-xl flex items-center gap-3"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Or type your question…"
            className="flex-1 px-6 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            disabled={isProcessing}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!(textInput.trim() || transcript.trim()) || isProcessing}
            className="p-4 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 disabled:opacity-30 text-white rounded-2xl transition-all"
          >
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
