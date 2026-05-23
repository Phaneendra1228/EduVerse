"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Notification State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session) {
      fetch('/api/users/notifications')
        .then(res => res.json())
        .then(data => {
          if (data.notifications) setNotifications(data.notifications);
        })
        .catch(err => console.error(err));
    }
  }, [session]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut({ callbackUrl: '/login' });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    // In a real app, hit an API to update database
  };

  return (
    <>
      {/* ========== Top Bar ========== */}
      <div className="top-bar">
        <div className="container">
          <span>📧 contact@eduverse.com &nbsp;|&nbsp; 📞 +91 98765 43210</span>
          <div className="top-bar-social">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      {/* ========== Navbar ========== */}
      <nav className="navbar" id="navbar">
        <div className="container">
          <Link href="/" className="nav-logo">Edu<span>Verse</span></Link>
          <div className={`nav-links ${isOpen ? "open" : ""}`} id="navLinks">
            <Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link>
            <Link href="/meetings" className={pathname === "/meetings" ? "active" : ""}>Meetings</Link>
            <Link href="/about" className={pathname === "/about" ? "active" : ""}>About Us</Link>
            <Link href="/courses" className={pathname === "/courses" ? "active" : ""}>Courses</Link>
            <Link href="/career" className={pathname === "/career" ? "active" : ""}>Career Guidance</Link>
            <Link href="/resume" className={pathname === "/resume" ? "active" : ""}>Resume Builder</Link>
            <Link href="/dossier" className={pathname === "/dossier" ? "active" : ""}>Dossier</Link>
            <Link href="/profile" className={pathname === "/profile" ? "active" : ""}>Profile</Link>
            
            <div className="nav-actions-group">
              <Link href="/dashboard" className="nav-action-link accent"><i className="fas fa-th-large"></i> Dashboard</Link>

              {/* Notification Bell */}
              {session && (
                <div className="nav-notif-container" ref={notifRef}>
                  <button 
                    onClick={() => setShowNotifs(!showNotifs)} 
                    aria-label="Notifications"
                    className="nav-bell-btn"
                  >
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                      <span className="nav-bell-badge">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showNotifs && (
                    <div className="notif-dropdown">
                      <div className="notif-dropdown-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="notif-mark-read">Mark all read</button>
                        )}
                      </div>
                      
                      <div className="notif-dropdown-body">
                        {notifications.length === 0 ? (
                          <div style={{ padding: '32px 20px', textAlign: 'center', color: '#8892b0' }}>No notifications yet.</div>
                        ) : (
                          notifications.map(notif => (
                            <Link href={notif.link} key={notif.id} className={`notif-item ${!notif.isRead ? 'unread' : ''}`} onClick={() => setShowNotifs(false)}>
                              <div className="notif-item-icon" style={{ background: notif.type === 'course_update' ? 'rgba(0,184,148,0.1)' : notif.type === 'qa_reply' ? 'rgba(108,92,231,0.1)' : 'rgba(56,189,248,0.1)', color: notif.type === 'course_update' ? '#00b894' : notif.type === 'qa_reply' ? '#6c5ce7' : '#38bdf8' }}>
                                <i className={notif.type === 'course_update' ? 'fas fa-book' : notif.type === 'qa_reply' ? 'fas fa-comment-dots' : 'fas fa-info-circle'}></i>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <h5 style={{ margin: 0, color: '#1a1a2e', fontSize: '0.9rem', fontWeight: notif.isRead ? 500 : 700 }}>{notif.title}</h5>
                                  {!notif.isRead && <div className="notif-unread-dot"></div>}
                                </div>
                                <p style={{ margin: '0 0 6px', color: '#4a4a6a', fontSize: '0.8rem', lineHeight: 1.4 }}>{notif.message}</p>
                                <span style={{ fontSize: '0.7rem', color: '#a0aec0' }}>{new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(notif.timestamp).toLocaleDateString()}</span>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {session ? (
                <a href="#" onClick={handleLogout} className="nav-action-link accent"><i className="fas fa-sign-out-alt"></i> Logout</a>
              ) : (
                <Link href="/login" className="nav-action-link accent"><i className="fas fa-sign-in-alt"></i> Login</Link>
              )}
            </div>
          </div>
          <button 
            className="hamburger" 
            id="hamburger" 
            aria-label="Toggle menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </>
  );
}
