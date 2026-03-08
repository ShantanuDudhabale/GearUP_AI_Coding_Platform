'use client';

import '../styles/stats.css';

const stats = [
  { value: '1M+', label: 'Lines of Code Explained', icon: '📝' },
  { value: '500K+', label: 'Happy Learners', icon: '🎓' },
  { value: '50+', label: 'Programming Languages', icon: '💻' },
  { value: '24/7', label: 'Available Support', icon: '⚡' },
];

export default function StatsSection() {
  return (
    <section id="stats" className="stats-section">
      <div className="stats-container">
        <h2>By The Numbers</h2>
        <p>CodeAI is trusted by developers worldwide</p>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card glass">
              <div className="stat-icon">{stat.icon}</div>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
