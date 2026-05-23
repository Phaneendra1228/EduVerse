"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./login.css";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const colors = [
      "rgba(108,92,231,0.4)",
      "rgba(0,206,201,0.35)",
      "rgba(249,202,36,0.3)",
      "rgba(162,155,254,0.3)",
      "rgba(85,239,196,0.25)",
    ];
    const newParticles = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 20,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  // Prefetch dashboard JS bundle while user types credentials
  useEffect(() => {
    router.prefetch('/dashboard');
    router.prefetch('/admin');
  }, [router]);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (mode === "login" || mode === "signup") {
      setLoading(true);
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // Mark this browser session as authenticated (for auto-logout on browser close)
        sessionStorage.setItem('eduverse_browser_session', 'active');
        
        // Hard navigation is faster than client-side routing for post-login redirect.
        if (email === 'admin@eduverse.com') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        alert("Authentication failed. Please check your credentials.");
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotStatus(null);
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      setForgotStatus(data.message || 'Password reset requested.');
    } catch (err) {
      setForgotStatus('An error occurred. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* ===== Left Panel ===== */}
        <div className="login-left">
          <div className="login-grid-pattern"></div>
          <div className="login-particles">
            {particles.map((p) => (
              <div
                key={p.id}
                className="login-particle"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  left: `${p.left}%`,
                  background: p.color,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `-${p.delay}s`,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                }}
              />
            ))}
          </div>

          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>

          <div className="login-left-content">
            <div className="login-brand">
              <div className="login-brand-logo">
                <i className="fas fa-graduation-cap"></i> EduVerse
              </div>
              <div className="login-brand-tagline">Learn Without Limits</div>
            </div>

            <div className="login-left-hero">
              <h2>
                Unlock Your <span>Full Potential</span> With World-Class Courses
              </h2>
              <p>
                Join thousands of learners who&apos;ve transformed their careers
                through expert-led, interactive education.
              </p>
            </div>

            <div className="login-stats">
              <div className="login-stat">
                <span className="login-stat-icon">👨‍🎓</span>
                <h4>12K+</h4>
                <p>Active Students</p>
              </div>
              <div className="login-stat">
                <span className="login-stat-icon">📚</span>
                <h4>200+</h4>
                <p>Expert Courses</p>
              </div>
              <div className="login-stat">
                <span className="login-stat-icon">🏆</span>
                <h4>98%</h4>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Right Panel ===== */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <div className="mobile-logo">
                <i className="fas fa-graduation-cap"></i> EduVerse
              </div>
              <h1>{mode === "login" ? "Welcome Back 👋" : "Create Account ✨"}</h1>
              <p>
                {mode === "login"
                  ? "Enter your credentials to access your account"
                  : "Start your learning journey today"}
              </p>
            </div>

            <div className="auth-toggle">
              <button
                className={`auth-toggle-btn ${mode === "login" ? "active" : ""}`}
                onClick={() => setMode("login")}
                type="button"
              >
                <i className="fas fa-sign-in-alt"></i>&nbsp; Login
              </button>
              <button
                className={`auth-toggle-btn ${mode === "signup" ? "active" : ""}`}
                onClick={() => setMode("signup")}
                type="button"
              >
                <i className="fas fa-user-plus"></i>&nbsp; Sign Up
              </button>
            </div>

            <form
              className="login-form"
              onSubmit={handleAuth}
            >
              <div className={`signup-fields ${mode === "signup" ? "show" : ""}`}>
                <div className="input-group">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-field-wrap">
                    <input type="text" id="fullName" placeholder="Phaneendra" />
                    <i className="fas fa-user field-icon"></i>
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-field-wrap">
                  <input type="email" id="email" name="email" placeholder="you@example.com" required />
                  <i className="fas fa-envelope field-icon"></i>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-field-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                  />
                  <i className="fas fa-lock field-icon"></i>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              <div className={`signup-fields ${mode === "signup" ? "show" : ""}`}>
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-field-wrap">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="••••••••"
                    />
                    <i className="fas fa-shield-halved field-icon"></i>
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                </div>
              </div>

              {mode === "login" && (
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span className="custom-checkbox">
                      <i className="fas fa-check"></i>
                    </span>
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="forgot-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setForgotStatus(null);
                      setForgotEmail('');
                      setShowForgotModal(true);
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                <span className="btn-text">
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Please wait...</>
                  ) : (
                    mode === "login" ? "Login to Account" : "Create Account"
                  )}
                </span>
              </button>
            </form>

            <div className="form-divider">or continue with</div>

            <div className="social-login">
              <button
                type="button"
                className="social-btn"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                <span className="social-icon google">
                  <i className="fab fa-google"></i>
                </span>
                Google
              </button>
              <button
                type="button"
                className="social-btn"
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              >
                <span className="social-icon github">
                  <i className="fab fa-github"></i>
                </span>
                GitHub
              </button>
            </div>

            <div className="form-footer">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode("signup");
                    }}
                  >
                    Create Account
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode("login");
                    }}
                  >
                    Login
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <div className="login-modal-header">
              <h2>Reset Password</h2>
              <button type="button" className="login-modal-close" onClick={() => setShowForgotModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            {!forgotStatus ? (
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <p style={{ color: '#8892b0', fontSize: '0.95rem' }}>Enter your email address and we will send you a reset link.</p>
                <div>
                  <input required type="email" className="login-modal-input" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowForgotModal(false)} style={{ padding: '12px 24px', borderRadius: '12px', background: '#f0f0f8', color: '#4a4a6a', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Outfit' }}>Cancel</button>
                  <button type="submit" disabled={forgotLoading} style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #6c5ce7, #4a3dc7)', color: 'white', border: 'none', fontWeight: 'bold', cursor: forgotLoading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit' }}>
                    {forgotLoading ? 'Sending...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '3.5rem', color: '#00cec9', marginBottom: '1rem' }}></i>
                <p style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '1.1rem' }}>{forgotStatus}</p>
                <button type="button" onClick={() => setShowForgotModal(false)} style={{ marginTop: '1.5rem', padding: '14px', width: '100%', borderRadius: '12px', background: 'linear-gradient(135deg, #6c5ce7, #4a3dc7)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Outfit' }}>
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
