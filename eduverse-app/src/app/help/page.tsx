"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const allCategories = [
    { icon: 'fa-user-cog', title: 'Account Settings', desc: 'Password, profile, preferences' },
    { icon: 'fa-book-reader', title: 'Course Access', desc: 'Enrollments, materials, videos' },
    { icon: 'fa-credit-card', title: 'Billing & Payments', desc: 'Invoices, refunds, subscriptions' },
    { icon: 'fa-laptop-code', title: 'Technical Support', desc: 'Bugs, video player, loading issues' },
  ];

  const allFaqs = [
    { id: 1, q: 'How do I access my certificates after completing a course?', a: 'Once you reach 100% completion in a course, the certificate is automatically generated. You can find all your earned credentials in the "My Certificates" tab on your dashboard, where you can download them as PDFs or share them directly to LinkedIn.' },
    { id: 2, q: 'Can I download course videos for offline viewing?', a: 'Currently, offline viewing is only available on our iOS and Android mobile apps. Desktop users must have an active internet connection to stream course content to ensure copyright protection.' },
    { id: 3, q: 'How does the XP and Leaderboard system work?', a: 'You earn XP (Experience Points) by completing video modules, passing quizzes, and participating in the Community Hub. The leaderboard ranks students globally based on their XP, and resets every 30 days for a new season.' },
    { id: 4, q: 'What is the refund policy for premium courses?', a: 'We offer a 14-day money-back guarantee for all individual premium courses, provided you have watched less than 20% of the video content. Subscription plans can be cancelled at any time but are not eligible for partial refunds.' },
  ];

  const categories = allCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqs = allFaqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '100px 20px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6c5ce7', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>

        {/* Header & Search */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e', fontSize: '3rem', margin: '0 0 16px 0' }}>How can we help you?</h1>
          <p style={{ color: '#8892b0', fontSize: '1.1rem', margin: '0 0 32px 0' }}>Search our knowledge base or browse categories below.</p>
          
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: '1.2rem' }}></i>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles, tutorials, or FAQs..." 
              style={{ width: '100%', padding: '20px 20px 20px 56px', borderRadius: '50px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '1.1rem', outline: 'none' }}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <h3 style={{ fontSize: '1.25rem', color: '#1a1a2e', marginBottom: '20px' }}>Quick Categories</h3>
        {categories.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#8892b0', marginBottom: '48px' }}>No categories found matching your search.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px' }}>
            {categories.map((cat, i) => (
              <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(108,92,231,0.08)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(108,92,231,0.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(108,92,231,0.1)', color: '#6c5ce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '16px' }}>
                  <i className={`fas ${cat.icon}`}></i>
                </div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#1a1a2e' }}>{cat.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#8892b0', lineHeight: 1.5 }}>{cat.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* FAQs */}
        <h3 style={{ fontSize: '1.25rem', color: '#1a1a2e', marginBottom: '20px' }}>Frequently Asked Questions</h3>
        {faqs.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#8892b0', marginBottom: '48px' }}>No FAQs found matching your search.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
            {faqs.map((faq) => (
              <div key={faq.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid rgba(108,92,231,0.08)', overflow: 'hidden' }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 600, color: openFaq === faq.id ? '#6c5ce7' : '#1a1a2e', transition: 'color 0.2s' }}>{faq.q}</span>
                  <i className={`fas fa-chevron-${openFaq === faq.id ? 'up' : 'down'}`} style={{ color: '#a0aec0', transition: 'transform 0.2s' }}></i>
                </button>
                {openFaq === faq.id && (
                  <div style={{ padding: '0 24px 24px 24px', color: '#4a4a6a', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #111126)', borderRadius: '20px', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 20px 40px rgba(26,26,46,0.2)' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 8px 0', fontFamily: 'Outfit, sans-serif' }}>Still need help?</h3>
            <p style={{ color: '#a0aec0', margin: 0 }}>Our support team usually responds within 2 hours.</p>
          </div>
          <button onClick={() => alert("Support ticket opened! An agent will reach out shortly.")} style={{ padding: '14px 28px', background: 'linear-gradient(to right, #6c5ce7, #00cec9)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(108, 92, 231, 0.4)' }}>
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
}
