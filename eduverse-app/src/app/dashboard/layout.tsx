"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './dashboard.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState("Phaneendra");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('eduverse_user') || '{}');
    if (user.name) {
      setUserName(user.name);
    }
  }, []);

  const handleLogout = async () => {
    // Also clear localStorage just in case, but rely on NextAuth to sign out
    localStorage.removeItem('eduverse_user');
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="dashboard-body">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
        <Link href="/" className="sidebar-logo">Edu<span>Verse</span></Link>
        <nav className="sidebar-nav">
          <div className="nav-section">Main</div>
          <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}><i className="fas fa-th-large"></i> Dashboard</Link>
          <Link href="/courses"><i className="fas fa-book-open"></i> My Courses</Link>
          <Link href="/meetings"><i className="fas fa-calendar-alt"></i> Meetings</Link>
          <Link href="/career"><i className="fas fa-route"></i> Career Path</Link>
          <div className="nav-section">Tools</div>
          <Link href="/resume"><i className="fas fa-file-alt"></i> Resume Builder</Link>
          <Link href="/dossier"><i className="fas fa-chart-bar"></i> Dossier</Link>
          <div className="nav-section">Account</div>
          <Link href="/profile"><i className="fas fa-user-circle"></i> Profile</Link>
          <Link href="/settings"><i className="fas fa-cog"></i> Settings</Link>
        </nav>
        <button className="logout-btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <h4>{userName}</h4>
            <p>CS Student</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your learning summary.</p>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search courses, topics..." />
            </div>
            <div style={{ position: 'relative' }}>
              <button 
                className="topbar-icon" 
                onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); }}
              >
                <i className="fas fa-bell"></i><span className="badge"></span>
              </button>
              {showNotifications && (
                <div className="topbar-dropdown">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <span className="clear-btn">Mark all read</span>
                  </div>
                  <div className="dropdown-list">
                    <div className="dropdown-item unread">
                      <div className="item-icon" style={{ background: 'rgba(108,92,231,0.1)', color: '#6c5ce7' }}><i className="fas fa-book"></i></div>
                      <div className="item-content">
                        <p><strong>New Course Available:</strong> Advanced React Patterns</p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="item-icon" style={{ background: 'rgba(0,206,201,0.1)', color: '#00cec9' }}><i className="fas fa-trophy"></i></div>
                      <div className="item-content">
                        <p><strong>Achievement:</strong> 14-day learning streak!</p>
                        <span>Yesterday</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-footer">View All Notifications</div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <button 
                className="topbar-icon" 
                onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); }}
              >
                <i className="fas fa-envelope"></i>
              </button>
              {showMessages && (
                <div className="topbar-dropdown">
                  <div className="dropdown-header">
                    <h4>Messages</h4>
                    <span className="clear-btn">New Message</span>
                  </div>
                  <div className="dropdown-list">
                    <div className="dropdown-item unread">
                      <div className="item-avatar">S</div>
                      <div className="item-content">
                        <p><strong>Sarah Chen:</strong> Don't forget our mentoring session tomorrow!</p>
                        <span>1 hour ago</span>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="item-avatar" style={{ background: '#00cec9' }}>M</div>
                      <div className="item-content">
                        <p><strong>Mike Ross:</strong> I shared the project files with you.</p>
                        <span>3 days ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-footer">View All Messages</div>
                </div>
              )}
            </div>

            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><i className="fas fa-bars"></i></button>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
