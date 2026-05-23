import React from 'react';
import Link from 'next/link';

export default function CertificatesPage() {
  const certificates = [
    { id: 1, course: 'UI/UX Design Masterclass', date: 'May 12, 2026', instructor: 'Sarah Jenkins', color: '#6c5ce7', img: '/images/course1.jpg' },
    { id: 2, course: 'Advanced React Patterns', date: 'April 28, 2026', instructor: 'Michael Chen', color: '#00cec9', img: '/images/course2.jpg' },
    { id: 3, course: 'Data Science Fundamentals', date: 'March 15, 2026', instructor: 'Dr. Emily Watson', color: '#f9ca24', img: '/images/course3.jpg' }
  ];

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '100px 20px 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6c5ce7', textDecoration: 'none', marginBottom: '16px', fontWeight: 600 }}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </Link>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e', fontSize: '2.5rem', margin: 0 }}>My Certificates</h1>
            <p style={{ color: '#8892b0', margin: '8px 0 0 0' }}>View, download, and share your earned credentials.</p>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a2e', background: 'white', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(108,92,231,0.1)' }}>
            <span style={{ color: '#6c5ce7', marginRight: '8px' }}><i className="fas fa-award"></i></span>
            3 Certificates Earned
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
          {certificates.map((cert) => (
            <div key={cert.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(108,92,231,0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              
              {/* Certificate Preview Top */}
              <div style={{ height: '180px', background: `linear-gradient(135deg, ${cert.color}, #1a1a2e)`, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', borderBottom: '4px solid #fff' }}>
                <i className="fas fa-certificate" style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.2)', position: 'absolute', top: '20px', right: '20px' }}></i>
                <h4 style={{ color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', margin: '0 0 8px 0', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{cert.course}</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>Certificate of Completion</p>
              </div>

              {/* Info Bottom */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Issued On</span>
                  <span style={{ fontSize: '0.85rem', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Instructor</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span style={{ fontSize: '1rem', color: '#1a1a2e', fontWeight: 700 }}>{cert.date}</span>
                  <span style={{ fontSize: '1rem', color: '#1a1a2e', fontWeight: 700 }}>{cert.instructor}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button style={{ padding: '10px', background: 'rgba(108,92,231,0.1)', color: '#6c5ce7', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(108,92,231,0.2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(108,92,231,0.1)'}>
                    <i className="fas fa-download"></i> PDF
                  </button>
                  <button style={{ padding: '10px', background: 'white', color: '#0077b5', border: '1px solid #0077b5', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#0077b5'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0077b5'; }}>
                    <i className="fab fa-linkedin"></i> Share
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Progress Card */}
          <div style={{ background: '#f8f9ff', borderRadius: '16px', border: '2px dashed #a29bfe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', minHeight: '350px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(108,92,231,0.1)', color: '#6c5ce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '20px' }}>
              <i className="fas fa-hourglass-half"></i>
            </div>
            <h3 style={{ color: '#1a1a2e', fontSize: '1.25rem', marginBottom: '8px' }}>Keep Learning!</h3>
            <p style={{ color: '#8892b0', fontSize: '0.95rem', marginBottom: '24px', maxWidth: '250px', lineHeight: 1.6 }}>You are 80% through the "Full-Stack Development Bootcamp". Finish it to earn your next certificate.</p>
            <Link href="/courses" style={{ padding: '10px 20px', background: '#6c5ce7', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Resume Course</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
