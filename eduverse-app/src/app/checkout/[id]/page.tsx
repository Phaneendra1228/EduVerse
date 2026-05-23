"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (params.id) {
      fetch('/api/courses')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const found = data.find(c => c._id === params.id || c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.id);
            setCourse(found);
          }
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate network latency for payment gateway
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const res = await fetch('/api/users/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id || params.id })
      });
      
      if (!res.ok) throw new Error('Payment or enrollment failed');

      setShowToast(true);
      setTimeout(() => {
        router.push('/dashboard#enrolled-courses');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading || status === 'loading') {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Loading Checkout...</h2></div>;
  }

  if (!course) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Course Not Found</h2></div>;
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '120px 20px 80px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Left Column: Checkout Form */}
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <Link href={`/courses/${params.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4a4a6a', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
            <i className="fas fa-arrow-left"></i> Back
          </Link>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e', fontSize: '2rem', marginBottom: '24px' }}>Payment Details</h2>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, padding: '16px', border: '2px solid #6c5ce7', borderRadius: '12px', background: 'rgba(108, 92, 231, 0.05)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', color: '#6c5ce7' }}><i className="fas fa-check-circle"></i></div>
              <i className="far fa-credit-card" style={{ fontSize: '24px', color: '#6c5ce7', marginBottom: '8px' }}></i>
              <div style={{ fontWeight: 600, color: '#1a1a2e' }}>Credit Card</div>
            </div>
            <div style={{ flex: 1, padding: '16px', border: '1px solid #eaeef2', borderRadius: '12px', opacity: 0.6, cursor: 'not-allowed' }}>
              <i className="fab fa-paypal" style={{ fontSize: '24px', color: '#1a1a2e', marginBottom: '8px' }}></i>
              <div style={{ fontWeight: 600, color: '#1a1a2e' }}>PayPal</div>
            </div>
          </div>

          <form onSubmit={handleCheckout}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem' }}>Cardholder Name</label>
              <input type="text" required defaultValue={session?.user?.name || ""} style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem' }}>Card Number</label>
              <div style={{ position: 'relative' }}>
                <input type="text" required placeholder="0000 0000 0000 0000" maxLength={19} style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa', letterSpacing: '2px' }} />
                <i className="fab fa-cc-visa" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px', color: '#a0aec0' }}></i>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem' }}>Expiry Date</label>
                <input type="text" required placeholder="MM/YY" maxLength={5} style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem' }}>CVC</label>
                <input type="password" required placeholder="***" maxLength={4} style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa' }} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={processing}
              style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #6c5ce7, #4a3dc7)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', boxShadow: '0 8px 20px rgba(108, 92, 231, 0.3)' }}
            >
              {processing ? (
                <>Processing Payment <i className="fas fa-circle-notch fa-spin"></i></>
              ) : (
                <>Pay ${(course.price || 0).toFixed(2)} <i className="fas fa-lock"></i></>
              )}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#8892b0', marginTop: '16px' }}>
              <i className="fas fa-shield-alt"></i> Payments are secure and encrypted.
            </p>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div style={{ padding: '32px', borderRadius: '16px', background: '#1a1a2e', color: 'white' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', marginBottom: '24px' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={course.image || '/images/course1.jpg'} alt={course.title} style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
            <div>
              <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 600 }}>{course.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#a0aec0' }}><i className="fas fa-clock"></i> {course.hours || 40} Hours • Lifetime Access</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#a0aec0' }}>
            <span>Original Price</span>
            <span style={{ textDecoration: 'line-through' }}>${((course.price || 0) * 1.5).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#00cec9' }}>
            <span>Discount (33% OFF)</span>
            <span>-${((course.price || 0) * 0.5).toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '1.4rem', fontWeight: 700 }}>
            <span>Total</span>
            <span>${(course.price || 0).toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Success Toast Overlay */}
      {showToast && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(26,26,46,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '400px', width: '90%', animation: 'modalPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <div style={{ width: '80px', height: '80px', background: '#00b894', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 20px rgba(0,184,148,0.3)' }}>
              <i className="fas fa-check" style={{ fontSize: '36px', color: 'white' }}></i>
            </div>
            <h2 style={{ fontFamily: 'Outfit', color: '#1a1a2e', marginBottom: '12px' }}>Payment Successful!</h2>
            <p style={{ color: '#4a4a6a', marginBottom: '0' }}>Welcome to <strong>{course.title}</strong>. Redirecting you to the learning portal...</p>
          </div>
        </div>
      )}

      {/* Responsive media query embedded */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
}
