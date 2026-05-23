"use client";

import Link from "next/link";
import { useState } from "react";
import { meetingsData } from "@/lib/data";
import MeetingCard from "@/components/MeetingCard";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <div className="page active" id="page-home">
      {/* Hero */}
      <section className="hero" id="hero">
        <video autoPlay muted loop playsInline className="hero-video-bg">
          <source src="/videos/new-bg-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        
        <div className="hero-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge"><span className="dot"></span> Welcome to EduVerse</div>
            <h1>Shape Your Future with <span className="gradient-text">Smart Learning</span></h1>
            <p>An immersive platform connecting students with world-class education, mentorship, and career resources to unlock unlimited potential.</p>
            <div className="hero-btns">
              <Link href="/courses" className="btn btn-primary">Explore Courses <i className="fas fa-arrow-right"></i></Link>
              <Link href="/about" className="btn btn-secondary" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>Learn More</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><h3>12K<span className="accent">+</span></h3><p>Active Students</p></div>
              <div className="hero-stat"><h3>200<span className="accent">+</span></h3><p>Expert Courses</p></div>
              <div className="hero-stat"><h3>98<span className="accent">%</span></h3><p>Success Rate</p></div>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/hero-banner.png" alt="Students learning together" />
            <div className="hero-floating-card card-1">
              <div className="card-icon">🎓</div>
              <h4>150+ Mentors</h4>
              <p>Industry experts ready to guide</p>
            </div>
            <div className="hero-floating-card card-2">
              <div className="card-icon">🏆</div>
              <h4>Top Rated</h4>
              <p>4.9/5 student satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-light" id="features">
        <div className="container">
          <div className="section-header">
            <span className="tag"><i className="fas fa-star"></i> Why EduVerse</span>
            <h2>Everything You Need to Succeed</h2>
            <p>We combine the best resources, technology, and community to give you an unmatched learning experience.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Premium Education</h3>
              <p>Curated curriculum designed by industry leaders with hands-on projects and real-world applications.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Expert Mentors</h3>
              <p>Learn from professionals with years of experience who provide personalized guidance and feedback.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Live Sessions</h3>
              <p>Interactive virtual meetings and webinars connecting learners globally for real-time collaboration.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Strong Network</h3>
              <p>Build meaningful professional connections that open doors to career opportunities worldwide.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Advanced analytics and dashboards to monitor your learning journey and celebrate milestones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Home Meetings Preview */}
      <section className="section section-dark" id="home-meetings">
        <div className="container">
          <div className="section-header">
            <span className="tag"><i className="fas fa-calendar-alt"></i> Events</span>
            <h2>Upcoming Meetings</h2>
            <p>Join live sessions, workshops, and networking events to accelerate your growth.</p>
          </div>
          <div className="meetings-tabs">
            <button className="meeting-tab active">All Events</button>
            <button className="meeting-tab">Workshops</button>
            <button className="meeting-tab">Sessions</button>
            <button className="meeting-tab">Programs</button>
          </div>
          <div className="meetings-grid" id="homeMeetingsGrid">
            {meetingsData.slice(0, 4).map(meeting => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/meetings" className="btn btn-primary">View All Meetings <i className="fas fa-arrow-right"></i></Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="about-banner" style={{ backgroundImage: "url('/images/about-banner.png')" }}>
        <div className="container">
          <h2>Start Your Degree Journey Today</h2>
          <p>Join thousands of students who have transformed their careers through our accredited programs and industry partnerships.</p>
          <Link href="/courses" className="btn btn-gold">Apply Now <i className="fas fa-graduation-cap"></i></Link>
        </div>
      </section>

      {/* Accordion / FAQ */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-header">
            <span className="tag"><i className="fas fa-question-circle"></i> FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to the most common questions about our platform and programs.</p>
          </div>
          <div style={{ maxWidth: "750px", margin: "0 auto" }}>
            {[
              { q: "How do I enroll in a course?", a: 'Simply browse our course catalog, select the program you\'re interested in, and click "Enroll Now." You\'ll be guided through a quick registration process to get started immediately.' },
              { q: "Are the courses self-paced?", a: "Yes! All our courses are designed to fit your schedule. Learn at your own pace with lifetime access to course materials, recordings, and resources." },
              { q: "Do I get a certificate after completion?", a: "Absolutely. Upon successful completion of any course, you'll receive a verified digital certificate recognized by industry partners worldwide." },
              { q: "What support is available for students?", a: "We offer 24/7 support through our AI assistant, mentor office hours, community forums, and dedicated student success coordinators." }
            ].map((faq, idx) => (
              <div className={`accordion-item ${openFaq === idx ? "open" : ""}`} key={idx}>
                <div className="accordion-header" onClick={() => toggleFaq(idx)}>
                  {faq.q} <span className="accordion-arrow"><i className="fas fa-chevron-down"></i></span>
                </div>
                <div className="accordion-body"><p>{faq.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta">
        <div className="container">
          <h2>Ready to Transform Your Future?</h2>
          <p>Join 12,000+ students already learning on EduVerse. Start your journey today.</p>
          <Link href="/courses" className="btn btn-gold">Get Started Free <i className="fas fa-rocket"></i></Link>
        </div>
      </section>
    </div>
  );
}
