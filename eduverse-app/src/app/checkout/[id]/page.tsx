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
  
  // Payment Gateway State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processingState, setProcessingState] = useState<'idle' | 'redirecting' | 'otp' | 'upi_await' | 'success'>('idle');
  
  // Form State
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (params?.id) {
      fetch('/api/courses')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const courseId = params.id as string;
            const found = data.find(c => c._id === courseId || (c.title && c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === courseId));
            setCourse(found);
          }
          setLoading(false);
        });
    }
  }, [params?.id]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingState('redirecting');

    // Simulate gateway redirection
    setTimeout(() => {
      if (paymentMethod === 'card' || paymentMethod === 'netbanking') {
        setProcessingState('otp');
      } else {
        setProcessingState('upi_await');
      }
    }, 1500);
  };

  const completePayment = async () => {
    setProcessingState('success');

    try {
      const res = await fetch('/api/users/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id || params?.id })
      });
      
      if (!res.ok) throw new Error('Payment or enrollment failed');

      setTimeout(() => {
        router.push('/dashboard#enrolled-courses');
      }, 2500);
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
      setProcessingState('idle');
    }
  };

  if (loading || status === 'loading') {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}><div className="gateway-loader"></div></div>;
  }

  if (!course) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Course Not Found</h2></div>;
  }

  const price = 4000; // Enforced uniform price
  const gst = price * 0.18;
  const total = price + gst;

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '100px 20px 80px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Column: Indian Payment Gateway Mock */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', overflow: 'hidden', position: 'relative' }}>
          
          {/* Gateway Header */}
          <div style={{ background: '#0a192f', padding: '24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#8892b0', marginBottom: '4px' }}>Paying to</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'Outfit' }}>EduVerse Technologies Pvt. Ltd.</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>₹{total.toFixed(2)}</div>
              <div style={{ fontSize: '0.8rem', color: '#00cec9' }}>View Details <i className="fas fa-chevron-down"></i></div>
            </div>
          </div>

          <div style={{ display: 'flex', minHeight: '400px' }}>
            {/* Sidebar Methods */}
            <div style={{ width: '160px', background: '#f8f9fa', borderRight: '1px solid #eaeef2' }}>
              <div 
                onClick={() => setPaymentMethod('upi')}
                style={{ padding: '20px 16px', borderBottom: '1px solid #eaeef2', cursor: 'pointer', background: paymentMethod === 'upi' ? 'white' : 'transparent', borderLeft: paymentMethod === 'upi' ? '4px solid #6c5ce7' : '4px solid transparent', fontWeight: paymentMethod === 'upi' ? 600 : 400, color: paymentMethod === 'upi' ? '#6c5ce7' : '#4a4a6a' }}
              >
                <i className="fas fa-qrcode" style={{ width: '24px' }}></i> UPI / QR
              </div>
              <div 
                onClick={() => setPaymentMethod('card')}
                style={{ padding: '20px 16px', borderBottom: '1px solid #eaeef2', cursor: 'pointer', background: paymentMethod === 'card' ? 'white' : 'transparent', borderLeft: paymentMethod === 'card' ? '4px solid #6c5ce7' : '4px solid transparent', fontWeight: paymentMethod === 'card' ? 600 : 400, color: paymentMethod === 'card' ? '#6c5ce7' : '#4a4a6a' }}
              >
                <i className="far fa-credit-card" style={{ width: '24px' }}></i> Card
              </div>
              <div 
                onClick={() => setPaymentMethod('netbanking')}
                style={{ padding: '20px 16px', borderBottom: '1px solid #eaeef2', cursor: 'pointer', background: paymentMethod === 'netbanking' ? 'white' : 'transparent', borderLeft: paymentMethod === 'netbanking' ? '4px solid #6c5ce7' : '4px solid transparent', fontWeight: paymentMethod === 'netbanking' ? 600 : 400, color: paymentMethod === 'netbanking' ? '#6c5ce7' : '#4a4a6a' }}
              >
                <i className="fas fa-university" style={{ width: '24px' }}></i> Netbanking
              </div>
            </div>

            {/* Payment Content */}
            <div style={{ flex: 1, padding: '32px' }}>
              
              {paymentMethod === 'upi' && (
                <form onSubmit={handleCheckout}>
                  <h3 style={{ margin: '0 0 24px', fontSize: '1.2rem', color: '#1a1a2e' }}>Pay using UPI</h3>
                  
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '150px', height: '150px', margin: '0 auto', border: '1px solid #d0d0e0', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                      <i className="fas fa-qrcode" style={{ fontSize: '100px', color: '#a0aec0' }}></i>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#8892b0', marginTop: '12px' }}>Scan QR Code using any UPI app</p>
                  </div>

                  <div style={{ textAlign: 'center', color: '#8892b0', marginBottom: '16px', fontWeight: 600 }}>OR</div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#4a4a6a', fontWeight: 600 }}>Enter UPI ID / VPA</label>
                    <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="username@upi" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem' }} />
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '16px', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)' }}>
                    Pay ₹{total.toFixed(2)}
                  </button>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', opacity: 0.5 }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ height: '16px' }} />
                  </div>
                </form>
              )}

              {paymentMethod === 'card' && (
                <form onSubmit={handleCheckout}>
                  <h3 style={{ margin: '0 0 24px', fontSize: '1.2rem', color: '#1a1a2e' }}>Add New Card</h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#4a4a6a', fontWeight: 600 }}>Card Number</label>
                    <div style={{ position: 'relative' }}>
                      <input type="text" required value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" maxLength={19} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem' }} />
                      <i className="far fa-credit-card" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }}></i>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#4a4a6a', fontWeight: 600 }}>Expiry</label>
                      <input type="text" required value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#4a4a6a', fontWeight: 600 }}>CVV</label>
                      <input type="password" required value={cvc} onChange={e => setCvc(e.target.value)} placeholder="123" maxLength={4} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#4a4a6a', fontWeight: 600 }}>Cardholder Name</label>
                    <input type="text" required defaultValue={session?.user?.name || ""} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem' }} />
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '16px', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)' }}>
                    Pay ₹{total.toFixed(2)}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8892b0', marginTop: '16px' }}>
                    <i className="fas fa-lock"></i> Secured by 256-bit encryption
                  </p>
                </form>
              )}

              {paymentMethod === 'netbanking' && (
                <form onSubmit={handleCheckout}>
                  <h3 style={{ margin: '0 0 24px', fontSize: '1.2rem', color: '#1a1a2e' }}>Netbanking</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    {['HDFC', 'SBI', 'ICICI', 'Axis'].map(bank => (
                      <div key={bank} style={{ padding: '16px', border: '1px solid #d0d0e0', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
                        <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{bank}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', color: '#4a4a6a' }}>
                      <option>Select other bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Yes Bank</option>
                      <option>Bank of Baroda</option>
                    </select>
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '16px', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)' }}>
                    Pay ₹{total.toFixed(2)}
                  </button>
                </form>
              )}

            </div>
          </div>

          {/* Gateway Footer */}
          <div style={{ background: '#f8f9fa', padding: '12px 24px', borderTop: '1px solid #eaeef2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#a0aec0' }}>
            <div>English</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-shield-check"></i> 100% Secure Payments
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div style={{ padding: '32px', borderRadius: '12px', background: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', color: '#1a1a2e' }}>
          <Link href={`/courses/${params?.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6c5ce7', textDecoration: 'none', marginBottom: '24px', fontWeight: 600, fontSize: '0.9rem' }}>
            <i className="fas fa-arrow-left"></i> Cancel Payment
          </Link>

          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', marginBottom: '24px' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px dashed #d0d0e0' }}>
            <img src={course.image || course.img || '/images/course1.jpg'} alt={course.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600, lineHeight: 1.3 }}>{course.title}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#8892b0' }}>Lifetime Access</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#4a4a6a', fontSize: '0.95rem' }}>
            <span>Base Price</span>
            <span>₹{price.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#00cec9', fontSize: '0.95rem' }}>
            <span>Discount (Limited Time)</span>
            <span>-₹0.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#4a4a6a', fontSize: '0.95rem' }}>
            <span>GST (18%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #eaeef2', fontSize: '1.3rem', fontWeight: 700 }}>
            <span>Total Amount</span>
            <span style={{ color: '#6c5ce7' }}>₹{total.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* OVERLAYS & MODALS */}
      
      {/* 1. Redirecting Loader */}
      {processingState === 'redirecting' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="gateway-loader" style={{ marginBottom: '24px' }}></div>
          <h2 style={{ fontFamily: 'Outfit', color: '#1a1a2e', fontSize: '1.5rem', marginBottom: '8px' }}>Processing Payment...</h2>
          <p style={{ color: '#8892b0' }}>Please do not refresh or close this window</p>
        </div>
      )}

      {/* 2. Bank OTP Verification (For Cards/Netbanking) */}
      {processingState === 'otp' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '0', borderRadius: '12px', width: '100%', maxWidth: '450px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ background: '#f4f6f8', padding: '20px', borderBottom: '1px solid #eaeef2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, color: '#1a1a2e' }}>Bank Verification</div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg" alt="Bank" style={{ height: '24px' }} />
            </div>
            <div style={{ padding: '32px 24px' }}>
              <p style={{ margin: '0 0 24px', color: '#4a4a6a', fontSize: '0.95rem', lineHeight: 1.5 }}>
                An OTP has been sent to your registered mobile number ending in <strong>******8892</strong>.
              </p>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#1a1a2e', fontWeight: 600 }}>Enter OTP</label>
                <input type="text" autoFocus value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength={6} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '8px' }} />
              </div>
              <button 
                onClick={completePayment}
                disabled={otp.length !== 6}
                style={{ width: '100%', padding: '16px', background: otp.length === 6 ? '#00b894' : '#b2bec3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: otp.length === 6 ? 'pointer' : 'not-allowed', transition: 'background 0.3s' }}
              >
                Verify & Pay ₹{total.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. UPI Await App (For UPI) */}
      {processingState === 'upi_await' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
            <div style={{ width: '80px', height: '80px', background: '#f4f6f8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ height: '30px' }} />
            </div>
            <h3 style={{ margin: '0 0 16px', color: '#1a1a2e', fontSize: '1.3rem' }}>Approve Payment</h3>
            <p style={{ color: '#4a4a6a', marginBottom: '32px', fontSize: '0.95rem' }}>
              We have sent a payment request to your UPI App. Please open the app and approve the payment of <strong>₹{total.toFixed(2)}</strong>.
            </p>
            <div style={{ position: 'relative', width: '100%', height: '6px', background: '#eaeef2', borderRadius: '3px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#6c5ce7', width: '60%', animation: 'upiProgress 30s linear forwards' }}></div>
            </div>
            <button 
              onClick={completePayment}
              style={{ padding: '12px 32px', background: 'transparent', color: '#6c5ce7', border: '1px solid #6c5ce7', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Simulate App Approval (Demo)
            </button>
          </div>
        </div>
      )}

      {/* 4. Success Toast */}
      {processingState === 'success' && (
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

      {/* Global Styles for Gateway Loader & Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .gateway-loader {
          width: 50px;
          height: 50px;
          border: 4px solid #eaeef2;
          border-top: 4px solid #6c5ce7;
          border-radius: 50%;
          animation: gatewaySpin 1s linear infinite;
        }
        @keyframes gatewaySpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes upiProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="display: flex; min-height: 400px"] {
            flex-direction: column;
          }
          div[style*="width: 160px"] {
            width: 100% !important;
            display: flex;
            border-right: none !important;
            border-bottom: 1px solid #eaeef2;
          }
          div[style*="padding: 20px 16px"] {
            flex: 1;
            text-align: center;
            border-bottom: none !important;
            border-left: none !important;
          }
        }
      `}} />
    </div>
  );
}
