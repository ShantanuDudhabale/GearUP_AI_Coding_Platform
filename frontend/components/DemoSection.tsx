'use client';

import { Play } from 'lucide-react';
import '../styles/demo.css';

export default function DemoSection() {
  return (
    <section id="demo" className="demo-section">
      <div className="demo-container">
        <div className="demo-header">
          <h2>See It In Action</h2>
          <p>Watch how CodeAI transforms your learning experience</p>
        </div>

        <div className="demo-content">
          <div className="demo-video glass">
            <div className="video-placeholder">
              <div className="play-button">
                <Play size={48} fill="currentColor" />
              </div>
              <p>Interactive Demo Video</p>
            </div>
          </div>

          <div className="demo-text">
            <h3>How It Works</h3>
            <div className="demo-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div>
                  <h4>Speak Your Question</h4>
                  <p>Use your natural voice or type your coding question</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div>
                  <h4>AI Analyzes</h4>
                  <p>Our AI processes your question and understands context</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div>
                  <h4>Get Guidance</h4>
                  <p>Receive step-by-step explanations with code examples</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div>
                  <h4>Learn & Practice</h4>
                  <p>Apply the knowledge and track your progress</p>
                </div>
              </div>
            </div>

            <button className="btn-primary demo-btn">Start Learning Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
