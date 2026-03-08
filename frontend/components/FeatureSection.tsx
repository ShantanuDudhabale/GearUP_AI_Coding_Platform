'use client';

import { Zap, Brain, Code, Shield, Sparkles, Mic } from 'lucide-react';
import '../styles/features.css';

const features = [
  {
    icon: Mic,
    title: 'Voice Commands',
    description: 'Speak naturally and get instant responses. Our AI understands context and nuance.',
  },
  {
    icon: Code,
    title: 'Code Examples',
    description: 'Get ready-to-use code snippets in multiple languages with detailed explanations.',
  },
  {
    icon: Brain,
    title: 'Smart Learning',
    description: 'AI adapts to your learning style and provides personalized guidance.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get answers in seconds with our optimized inference engine.',
  },
  {
    icon: Sparkles,
    title: 'Step-by-Step',
    description: 'Learn progressively with structured explanations and examples.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your code and conversations remain completely private and secure.',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to learn coding faster with AI assistance</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card glass">
                <div className="feature-icon">
                  <Icon size={28} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
