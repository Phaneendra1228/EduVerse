"use client";
import React, { useEffect, useState } from 'react';

export default function DossierPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="page active" id="page-dossier">
      <div className="page-header" style={{ backgroundImage: "url('/images/about-banner.png')" }}>
        <div className="container">
          <h1>My Dossier</h1>
          <p>ATS tips and recommended skills tailored to company requirements.</p>
        </div>
      </div>
      <section className="section section-light">
        <div className="container">
          <div className="dossier-grid">
            <div className="ats-guide">
              <h3>ATS (Applicant Tracking System) Guide</h3>
              <p>Optimize your resume so it passes company applicant tracking systems.</p>
              <div className="ats-meter">
                <svg viewBox="0 0 200 120">
                  <defs>
                    <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff6b6b" />
                      <stop offset="33%" stopColor="#f9ca24" />
                      <stop offset="66%" stopColor="#55efc4" />
                      <stop offset="100%" stopColor="#00cec9" />
                    </linearGradient>
                  </defs>
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(108,92,231,0.1)" strokeWidth="14" strokeLinecap="round" />
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#atsGrad)" strokeWidth="14" strokeLinecap="round"
                    strokeDasharray="251" strokeDashoffset="63" id="atsArc" />
                </svg>
                <div className="ats-score">75%</div>
              </div>
              <ul className="ats-criteria">
                <li><span className="label"><span className="dot" style={{ background: "#55efc4" }}></span> Length</span><span className="value">80%</span></li>
                <li><span className="label"><span className="dot" style={{ background: "#00cec9" }}></span> Keyword Optimization</span><span className="value">80%</span></li>
                <li><span className="label"><span className="dot" style={{ background: "#f9ca24" }}></span> Content Quality</span><span className="value">60%</span></li>
                <li><span className="label"><span className="dot" style={{ background: "#6c5ce7" }}></span> Formatting</span><span className="value">70%</span></li>
                <li><span className="label"><span className="dot" style={{ background: "#ff6b6b" }}></span> Impact Verbs</span><span className="value">55%</span></li>
              </ul>
            </div>
            <div className="skills-panel">
              <h3>Recommended Skills</h3>
              <SkillBar name="JavaScript" percent={90} isClient={isClient} />
              <SkillBar name="Python" percent={85} isClient={isClient} />
              <SkillBar name="React / Next.js" percent={82} isClient={isClient} />
              <SkillBar name="Data Structures" percent={78} isClient={isClient} />
              <SkillBar name="Machine Learning" percent={70} isClient={isClient} />
              <SkillBar name="Cloud & DevOps" percent={65} isClient={isClient} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SkillBar({ name, percent, isClient }: { name: string, percent: number, isClient: boolean }) {
  return (
    <div className="skill-bar">
      <div className="skill-bar-header"><span>{name}</span><span>{percent}%</span></div>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" style={{ width: isClient ? `${percent}%` : '0', transition: 'width 1s ease 0.2s' }}></div>
      </div>
    </div>
  );
}
