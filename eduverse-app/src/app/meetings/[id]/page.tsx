"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { meetingsData } from '@/lib/data';
import './meeting-detail.css';

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [meeting, setMeeting] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const meetingId = parseInt(params.id as string);
    const found = meetingsData.find(m => m.id === meetingId);
    if (found) {
      setMeeting(found);
    }
  }, [params.id]);

  if (!meeting) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Loading Meeting Details...</h2></div>;
  }

  const handleRSVP = () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsRegistered(true);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="page active" id="page-meeting-detail">
      {/* Hero Banner */}
      <section className="meeting-detail-hero" style={{ backgroundImage: `url(${meeting.img})` }}>
        <div className="container">
          <Link href="/meetings" style={{ color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', opacity: 0.8, fontSize: '0.9rem' }}>
            <i className="fas fa-arrow-left"></i> Back to Meetings
          </Link>
          
          <div className="meeting-tag">{meeting.cat}</div>
          <h1 className="meeting-detail-title">{meeting.title}</h1>
          
          <div className="meeting-meta-bar">
            <div className="meta-item">
              <div className="meta-icon"><i className="far fa-calendar-alt"></i></div>
              <span>{meeting.month} {meeting.day}, 2024</span>
            </div>
            <div className="meta-item">
              <div className="meta-icon"><i className="far fa-clock"></i></div>
              <span>10:00 AM - 2:00 PM EST</span>
            </div>
            <div className="meta-item">
              <div className="meta-icon"><i className="fas fa-map-marker-alt"></i></div>
              <span>Virtual Live Stream</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="meeting-detail-content">
        <div className="container">
          <div className="meeting-grid">
            
            {/* Left Content */}
            <div className="meeting-about">
              <h2>About This Event</h2>
              <p>{meeting.desc}</p>
              <p>Join us for an exclusive, highly interactive session designed for professionals and learners aiming to stay ahead of the curve. This event brings together industry experts, thought leaders, and passionate individuals to share insights, strategies, and real-world applications.</p>
              <p>Whether you're looking to network, build new skills, or get your questions answered live by the speakers, this meeting will provide you with actionable takeaways.</p>
              
              <h2 style={{ marginTop: '40px' }}>What to Expect</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
                <li style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <i className="fas fa-check-circle" style={{ color: '#00cec9', fontSize: '1.2rem' }}></i>
                  <span style={{ fontSize: '1.1rem', color: '#4a4a6a' }}>Live Q&A sessions with the host</span>
                </li>
                <li style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <i className="fas fa-check-circle" style={{ color: '#00cec9', fontSize: '1.2rem' }}></i>
                  <span style={{ fontSize: '1.1rem', color: '#4a4a6a' }}>Downloadable slides and resources</span>
                </li>
                <li style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <i className="fas fa-check-circle" style={{ color: '#00cec9', fontSize: '1.2rem' }}></i>
                  <span style={{ fontSize: '1.1rem', color: '#4a4a6a' }}>Access to the event recording for 30 days</span>
                </li>
              </ul>
            </div>

            {/* Right Sidebar */}
            <div className="meeting-sidebar">
              <div className="rsvp-card">
                <div className="rsvp-price">{meeting.price === '₹0' || meeting.price === 'Free' || String(meeting.price).replace(/[^0-9.]/g, '') === '0' ? 'Free' : `₹${String(meeting.price).replace(/[^0-9.]/g, '')}`}</div>
                
                <button 
                  className={`btn-rsvp ${isRegistered ? 'registered' : ''}`} 
                  onClick={handleRSVP}
                >
                  {isRegistered ? 'Successfully Registered ✓' : 'RSVP Now'}
                </button>
                
                <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.85rem', marginBottom: 0 }}>
                  Limited virtual seats available.
                </p>

                <div className="meeting-includes">
                  <h4>This event includes:</h4>
                  <div className="include-item">
                    <i className="fas fa-video include-icon"></i>
                    <span>HD Live Streaming</span>
                  </div>
                  <div className="include-item">
                    <i className="far fa-comments include-icon"></i>
                    <span>Interactive Chat & Networking</span>
                  </div>
                  <div className="include-item">
                    <i className="fas fa-certificate include-icon"></i>
                    <span>Certificate of Attendance</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Success Toast */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a1a2e',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 9999,
          animation: 'modalPopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <div style={{ background: '#00b894', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fas fa-check" style={{ fontSize: '14px', color: 'white' }}></i>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Registration Confirmed!</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#a0aec0' }}>We've sent the meeting link to your email.</p>
          </div>
        </div>
      )}
    </div>
  );
}
