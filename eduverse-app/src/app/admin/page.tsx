"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [meetingData, setMeetingData] = useState({ title: '', date: '', link: '' });
  const [announcementData, setAnnouncementData] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingData)
    });
    setLoading(false);
    if (res.ok) {
      setShowMeetingModal(false);
      setMeetingData({ title: '', date: '', link: '' });
      alert("Meeting scheduled successfully!");
    } else alert("Failed to schedule meeting.");
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcementData)
    });
    setLoading(false);
    if (res.ok) {
      setShowAnnouncementModal(false);
      setAnnouncementData({ title: '', message: '' });
      alert("Announcement sent successfully!");
    } else alert("Failed to send announcement.");
  };

  return (
    <div className="admin-overview-wrapper">
      <div className="admin-overview-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back to the EduVerse admin portal.</p>
      </div>

      <div className="admin-stats-grid">
        {[
          { title: 'Total Students', value: '12,450', icon: 'fa-users', color: 'blue' },
          { title: 'Active Courses', value: '24', icon: 'fa-book', color: 'teal' },
          { title: 'Upcoming Meetings', value: '8', icon: 'fa-calendar', color: 'orange' },
          { title: 'Revenue (MTD)', value: '$45,200', icon: 'fa-dollar-sign', color: 'purple' }
        ].map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-info">
              <p>{stat.title}</p>
              <h3>{stat.value}</h3>
            </div>
            <div className={`admin-stat-icon ${stat.color}`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-bottom-grid">
        <div className="admin-panel">
          <h3>Recent Enrollments</h3>
          <div className="admin-list">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="admin-list-item">
                <div className="admin-list-item-left">
                  <div className="admin-list-avatar">
                    S{i}
                  </div>
                  <div className="admin-list-info">
                    <h4>Student {i}</h4>
                    <p>Enrolled in: Full Stack Web Development</p>
                  </div>
                </div>
                <div className="admin-list-right">
                  <span>+$249</span>
                  <p>2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <h3>Quick Actions</h3>
          <div className="admin-actions">
            <Link href="/admin/courses" className="admin-action-btn" style={{ textDecoration: 'none' }}>
              <span><i className="fas fa-plus" style={{color: '#818cf8', marginRight: '8px'}}></i> Add New Course</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <button onClick={() => setShowMeetingModal(true)} className="admin-action-btn">
              <span><i className="fas fa-calendar-plus" style={{color: '#2dd4bf', marginRight: '8px'}}></i> Schedule Meeting</span>
              <i className="fas fa-chevron-right"></i>
            </button>
            <button onClick={() => setShowAnnouncementModal(true)} className="admin-action-btn">
              <span><i className="fas fa-bullhorn" style={{color: '#fb7185', marginRight: '8px'}}></i> Send Announcement</span>
              <i className="fas fa-chevron-right"></i>
            </button>
            <Link href="/admin/analytics" className="admin-action-btn" style={{ textDecoration: 'none' }}>
              <span><i className="fas fa-chart-line" style={{color: '#f59e0b', marginRight: '8px'}}></i> Revenue Analytics</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Meeting Modal */}
      {showMeetingModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Schedule Meeting</h2>
              <button className="admin-modal-close" onClick={() => setShowMeetingModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleMeetingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Meeting Topic *</label>
                <input required type="text" className="admin-input" value={meetingData.title} onChange={e => setMeetingData({...meetingData, title: e.target.value})} placeholder="e.g. Weekly Mentorship Call" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Date & Time *</label>
                <input required type="datetime-local" className="admin-input" value={meetingData.date} onChange={e => setMeetingData({...meetingData, date: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Meeting Link (Zoom/Meet) *</label>
                <input required type="url" className="admin-input" value={meetingData.link} onChange={e => setMeetingData({...meetingData, link: e.target.value})} placeholder="https://..." />
              </div>
              <button type="submit" disabled={loading} style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.5rem', background: '#2dd4bf', color: '#111126', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Scheduling...' : 'Schedule Now'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Send Announcement</h2>
              <button className="admin-modal-close" onClick={() => setShowAnnouncementModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleAnnouncementSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Announcement Title *</label>
                <input required type="text" className="admin-input" value={announcementData.title} onChange={e => setAnnouncementData({...announcementData, title: e.target.value})} placeholder="e.g. New Course Dropped!" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Message Body *</label>
                <textarea required className="admin-input" rows={4} value={announcementData.message} onChange={e => setAnnouncementData({...announcementData, message: e.target.value})} placeholder="Write your announcement here..."></textarea>
              </div>
              <button type="submit" disabled={loading} style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.5rem', background: '#fb7185', color: '#111126', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending...' : 'Blast Announcement'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
