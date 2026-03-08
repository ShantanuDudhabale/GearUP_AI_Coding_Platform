'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import '../styles/hero.css';

export default function HeroSection() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const micRef = useRef<HTMLButtonElement>(null);

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTranscript('Listening... Say your question');
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      setTranscript(textInput);
      setTextInput('');
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text animate-slide-up">
          <h1>Learn Coding with AI Voice</h1>
          <p>Speak your problem. Get instant step-by-step guidance powered by advanced AI.</p>
        </div>

        <div className="hero-mic-container animate-slide-up">
          <button
            ref={micRef}
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={toggleMic}
            title={isListening ? 'Stop Recording' : 'Start Recording'}
          >
            {isListening ? (
              <MicOff size={40} className="mic-icon" />
            ) : (
              <Mic size={40} className="mic-icon" />
            )}
          </button>

          {isListening && (
            <div className="pulse-rings">
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
              <div className="pulse-ring"></div>
            </div>
          )}
        </div>

        {transcript && (
          <div className="transcript-display animate-slide-up">
            <p className="transcript-label">Your Input</p>
            <p className="transcript-text">{transcript}</p>
          </div>
        )}

        <div className="hero-input-group animate-slide-up">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
            placeholder="Or type your coding question..."
            className="hero-input"
          />
          <button className="btn-primary input-submit" onClick={handleTextSubmit}>
            <Send size={18} />
          </button>
        </div>

        <p className="hero-cta">Press the mic or type to get started</p>
      </div>
    </section>
  );
}
