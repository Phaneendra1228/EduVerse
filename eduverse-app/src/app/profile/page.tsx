"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './profile.css';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    role: 'student'
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetch('/api/users/profile')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setFormData({
              name: data.user.name || '',
              email: data.user.email || '',
              phone: data.user.phone || '',
              bio: data.user.bio || '',
              role: data.user.role || 'student'
            });
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio
        })
      });
      
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === 'loading') {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Loading Profile...</h2></div>;
  }

  const initials = formData.name ? formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {initials}
              <div className="profile-avatar-edit">
                <i className="fas fa-camera"></i>
              </div>
            </div>
            <h3 className="profile-name">{formData.name}</h3>
            <p className="profile-role">{formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Account</p>
          </div>

          <nav className="profile-nav">
            <button 
              className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="far fa-user"></i> Personal Details
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-shield-alt"></i> Security & Password
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <i className="fas fa-trophy"></i> Trophy Room
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <i className="far fa-bell"></i> Notifications
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="profile-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave}>
              <h2>Personal Details</h2>
              <p className="subtitle">Update your photo and personal details here.</p>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" className="form-input" value={formData.email} disabled title="Email cannot be changed" />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea 
                  name="bio" 
                  className="form-input form-textarea" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  placeholder="Tell us a little bit about yourself..."
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'} <i className="fas fa-check"></i>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div>
              <h2>Security Settings</h2>
              <p className="subtitle">Manage your password and security preferences.</p>
              
              <div className="form-group" style={{ marginTop: '32px' }}>
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" className="form-input" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="form-input" />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                <button type="button" className="btn-save" onClick={() => alert('Password updated successfully!')}>
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-section fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 style={{ margin: 0 }}>Trophy Room</h2>
                <span style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.1), rgba(74,61,199,0.1))', color: '#6c5ce7', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>Level 3 Scholar</span>
              </div>
              <p className="subtitle" style={{ marginBottom: '32px' }}>Complete courses and engage with the community to unlock badges.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
                {/* Unlocked Badge */}
                <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '2px solid #00b894', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#00b894', color: 'white', width: '40px', height: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', padding: '4px', transform: 'rotate(45deg)' }}></div>
                  <i className="fas fa-check" style={{ position: 'absolute', top: '6px', right: '6px', color: 'white', fontSize: '10px', zIndex: 2 }}></i>
                  
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 16px', background: 'linear-gradient(135deg, #00b894, #00cec9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,184,148,0.3)' }}>
                    <i className="fas fa-rocket" style={{ fontSize: '32px', color: 'white' }}></i>
                  </div>
                  <h4 style={{ margin: '0 0 8px', color: '#1a1a2e', fontSize: '1.1rem' }}>Early Adopter</h4>
                  <p style={{ margin: 0, color: '#8892b0', fontSize: '0.85rem' }}>Joined EduVerse in the first year.</p>
                </div>

                {/* Unlocked Badge */}
                <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '2px solid #6c5ce7', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#6c5ce7', color: 'white', width: '40px', height: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', padding: '4px', transform: 'rotate(45deg)' }}></div>
                  <i className="fas fa-check" style={{ position: 'absolute', top: '6px', right: '6px', color: 'white', fontSize: '10px', zIndex: 2 }}></i>
                  
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 16px', background: 'linear-gradient(135deg, #6c5ce7, #4a3dc7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(108,92,231,0.3)' }}>
                    <i className="fas fa-brain" style={{ fontSize: '32px', color: 'white' }}></i>
                  </div>
                  <h4 style={{ margin: '0 0 8px', color: '#1a1a2e', fontSize: '1.1rem' }}>Fast Learner</h4>
                  <p style={{ margin: 0, color: '#8892b0', fontSize: '0.85rem' }}>Passed a final assessment with 100%.</p>
                </div>

                {/* Locked Badge */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '1px dashed #d0d0e0', opacity: 0.6, filter: 'grayscale(100%)' }}>
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 16px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-comments" style={{ fontSize: '32px', color: '#a0aec0' }}></i>
                  </div>
                  <h4 style={{ margin: '0 0 8px', color: '#4a4a6a', fontSize: '1.1rem' }}>Top Contributor</h4>
                  <p style={{ margin: 0, color: '#8892b0', fontSize: '0.85rem' }}>Answer 5 questions in the Q&A forum.</p>
                  <div style={{ marginTop: '12px', background: '#eaeef2', borderRadius: '10px', height: '6px', width: '100%', overflow: 'hidden' }}>
                    <div style={{ background: '#a0aec0', width: '20%', height: '100%' }}></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#8892b0', marginTop: '4px', display: 'block' }}>1 / 5 Answers</span>
                </div>

                {/* Locked Badge */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '1px dashed #d0d0e0', opacity: 0.6, filter: 'grayscale(100%)' }}>
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 16px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-graduation-cap" style={{ fontSize: '32px', color: '#a0aec0' }}></i>
                  </div>
                  <h4 style={{ margin: '0 0 8px', color: '#4a4a6a', fontSize: '1.1rem' }}>Course Master</h4>
                  <p style={{ margin: 0, color: '#8892b0', fontSize: '0.85rem' }}>Complete 3 different courses.</p>
                  <div style={{ marginTop: '12px', background: '#eaeef2', borderRadius: '10px', height: '6px', width: '100%', overflow: 'hidden' }}>
                    <div style={{ background: '#a0aec0', width: '33%', height: '100%' }}></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#8892b0', marginTop: '4px', display: 'block' }}>1 / 3 Courses</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2>Notification Preferences</h2>
              <p className="subtitle">Choose what alerts you want to receive.</p>
              
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #eaeef2' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', color: '#1a1a2e' }}>Course Updates</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#a0aec0' }}>Get notified when a new module is added to your enrolled courses.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #eaeef2' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', color: '#1a1a2e' }}>Meeting Reminders</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#a0aec0' }}>Receive an email 1 hour before a scheduled meeting starts.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div style={{
          position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a2e', color: 'white', padding: '16px 24px', borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '16px',
          zIndex: 9999, animation: 'modalPopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <div style={{ background: '#00b894', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fas fa-check" style={{ fontSize: '14px', color: 'white' }}></i>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Profile Updated!</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#a0aec0' }}>Your personal details have been saved.</p>
          </div>
        </div>
      )}
    </div>
  );
}
