"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="page active" id="page-settings">
      <div className="page-header" style={{ backgroundImage: "url('/images/hero-banner.png')" }}>
        <div className="container">
          <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px', opacity: 0.8 }}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </Link>
          <h1>Account Settings</h1>
          <p>Manage your preferences and application settings.</p>
        </div>
      </div>
      <section className="section section-light">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="profile-card" style={{ marginBottom: '24px', textAlign: 'left', padding: '32px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '24px' }}>General Preferences</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', color: '#1a1a2e' }}>Push Notifications</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8892b0' }}>Receive alerts about new courses and assignments.</p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: notifications ? '#6c5ce7' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: notifications ? '26px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', color: '#1a1a2e' }}>Email Updates</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8892b0' }}>Weekly newsletter and marketing emails.</p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
                <input type="checkbox" checked={emailUpdates} onChange={() => setEmailUpdates(!emailUpdates)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: emailUpdates ? '#6c5ce7' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: emailUpdates ? '26px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', color: '#1a1a2e' }}>Dark Mode Theme</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8892b0' }}>Toggle dark mode interface.</p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: darkMode ? '#6c5ce7' : '#ccc', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: darkMode ? '26px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                </span>
              </label>
            </div>
          </div>

          <div className="profile-card" style={{ textAlign: 'left', padding: '32px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '24px', color: '#e74c3c' }}>Danger Zone</h3>
            <p style={{ fontSize: '0.9rem', color: '#8892b0', marginBottom: '16px' }}>Once you delete your account, there is no going back. Please be certain.</p>
            <button style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.2)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Delete Account
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
