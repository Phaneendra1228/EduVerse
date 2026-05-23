import React from 'react';
import Link from 'next/link';

export default function CertificatesPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff', padding: '20px' }}>
      <i className="fas fa-certificate" style={{ fontSize: '4rem', color: '#ff6b6b', marginBottom: '24px' }}></i>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e', fontSize: '3rem', marginBottom: '16px' }}>My Certificates</h1>
      <p style={{ color: '#8892b0', fontSize: '1.2rem', marginBottom: '32px' }}>You haven't earned any certificates yet!</p>
      <Link href="/dashboard" style={{ padding: '12px 24px', background: '#6c5ce7', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Back to Dashboard</Link>
    </div>
  );
}
