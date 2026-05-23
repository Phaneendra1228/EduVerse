"use client";
import React, { useEffect, useRef, useState } from 'react';

export default function AboutPage() {
  const [stats, setStats] = useState({ students: 0, instructors: 0, courses: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue('students', 12000, 2000);
          animateValue('instructors', 150, 2000);
          animateValue('courses', 200, 2000);
        }
      });
    }, { threshold: 0.3 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateValue = (key: keyof typeof stats, end: number, duration: number) => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setStats(prev => ({ ...prev, [key]: Math.floor(progress * end) }));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  return (
    <div className="page active" id="page-about">
      <div className="page-header" style={{ backgroundImage: "url('/images/about-banner.png')" }}>
        <div className="container">
          <h1>About EduVerse</h1>
          <p>Empowering the next generation of learners through innovation, technology, and personalized experiences.</p>
        </div>
      </div>
      <section className="section section-light" ref={sectionRef}>
        <div className="container">
          <div className="stats-row">
            <div className="stat-card" style={{ background: "rgba(108,92,231,0.06)", borderColor: "rgba(108,92,231,0.12)" }}>
              <h3 style={{ color: "var(--primary)" }}>{stats.students.toLocaleString()}+</h3>
              <p style={{ color: "var(--text-body)" }}>Students Enrolled</p>
            </div>
            <div className="stat-card" style={{ background: "rgba(0,206,201,0.06)", borderColor: "rgba(0,206,201,0.12)" }}>
              <h3 style={{ color: "var(--accent)" }}>{stats.instructors.toLocaleString()}+</h3>
              <p style={{ color: "var(--text-body)" }}>Expert Instructors</p>
            </div>
            <div className="stat-card" style={{ background: "rgba(249,202,36,0.06)", borderColor: "rgba(249,202,36,0.12)" }}>
              <h3 style={{ color: "var(--gold-dark)" }}>{stats.courses.toLocaleString()}+</h3>
              <p style={{ color: "var(--text-body)" }}>Courses Available</p>
            </div>
            <div className="stat-card" style={{ background: "rgba(108,92,231,0.06)", borderColor: "rgba(108,92,231,0.12)" }}>
              <h3 style={{ color: "var(--primary)" }}>98%</h3>
              <p style={{ color: "var(--text-body)" }}>Success Rate</p>
            </div>
          </div>
          <div style={{ maxWidth: "800px", margin: "64px auto 0", textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>Our Mission</h2>
            <p style={{ fontSize: "1.05rem", color: "var(--text-body)", lineHeight: 1.9 }}>
              At EduVerse, we believe education is the foundation of progress. Our mission is to democratize world-class learning by providing accessible, engaging, and industry-relevant courses that empower students to build successful careers. We combine cutting-edge technology with expert instruction to create a learning environment that inspires curiosity and drives results.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
