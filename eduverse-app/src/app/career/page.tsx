import React from 'react';
import { roadmapData } from '@/lib/data';

export default function CareerPage() {
  return (
    <div className="page active" id="page-career">
      <div className="page-header" style={{ backgroundImage: "url('/images/about-banner.png')" }}>
        <div className="container">
          <h1>Career Guidance</h1>
          <p>Plan your learning path, track your progress, and discover where your interests lead you.</p>
        </div>
      </div>
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <span className="tag"><i className="fas fa-route"></i> Roadmap</span>
            <h2>Learning Roadmap</h2>
            <p>A step-by-step path to grow from basics to advanced development and land your dream role.</p>
          </div>
          <div className="roadmap">
            {roadmapData.map((r) => (
              <div key={r.step} className="roadmap-step">
                <div className="roadmap-dot">{r.step}</div>
                <div className="roadmap-content">
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                  <div className="tech-tags">
                    {r.tags.map(t => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
