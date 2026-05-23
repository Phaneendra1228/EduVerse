'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const isActive = (path: string) => pathname === path ? 'active' : '';

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link href="/" className="admin-logo">
            <i className="fas fa-graduation-cap"></i>
            <span className="admin-logo-text">EduVerse</span>
            <span className="admin-badge">ADMIN</span>
          </Link>
          <button className="admin-mobile-close" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <nav className="admin-nav">
          <Link href="/admin" className={`admin-nav-link ${isActive('/admin')}`} onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-chart-pie"></i> Dashboard
          </Link>
          <Link href="/admin/courses" className={`admin-nav-link ${isActive('/admin/courses')}`} onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-book"></i> Manage Courses
          </Link>
          <Link href="/admin/users" className={`admin-nav-link ${isActive('/admin/users')}`} onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-users"></i> Manage Users
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="admin-logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-hamburger" onClick={() => setIsSidebarOpen(true)}>
              <i className="fas fa-bars"></i>
            </button>
            <h2>Admin Portal</h2>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-icon-btn">
              <i className="fas fa-bell"></i>
            </button>
            <div className="admin-avatar">
              AD
            </div>
          </div>
        </header>
        
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
