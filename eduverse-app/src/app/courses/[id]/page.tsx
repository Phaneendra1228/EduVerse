"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import './course-detail.css';

export default function CourseDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', desc: '' });
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState('');

  // Q&A State
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [postingQA, setPostingQA] = useState(false);

  // Quiz State
  const [quizData, setQuizData] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  React.useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const courseId = params.id as string;
          const found = data.find(c => c._id === courseId || c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === courseId);
          setCourse(found);
          if (found) setCurrentVideoId(getVideoId(found));
        }
        setLoading(false);
      });
  }, [params.id]);

  // Fetch Q&A when tab is active
  React.useEffect(() => {
    if (activeTab === 'qa' && course) {
      fetch(`/api/courses/qa?courseId=${course._id || params.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.questions) setQuestions(data.questions);
        })
        .catch(err => console.error("Failed to load QA:", err));
    }
    
    if (activeTab === 'assessment' && course && !quizData) {
      fetch(`/api/courses/quiz?courseId=${course._id || params.id}`)
        .then(res => res.json())
        .then(data => {
          setQuizData(data);
        })
        .catch(err => console.error("Failed to load Quiz:", err));
    }
  }, [activeTab, course, params.id, quizData]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e' }}><h2>Loading course details...</h2></div>;
  }

  if (!course) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e' }}><h2>Course Not Found</h2></div>;
  }

  const handleEnroll = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Redirect to checkout if course is paid
    if (course.price && course.price > 0) {
      router.push(`/checkout/${course._id || params.id}`);
      return;
    }
    
    try {
      const res = await fetch('/api/users/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: params.id })
      });
      
      if (!res.ok) {
        throw new Error('Failed to enroll');
      }

      setToastMessage({
        title: 'Successfully Enrolled!',
        desc: `Redirecting to your Dashboard...`
      });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        router.push('/dashboard#enrolled-courses');
      }, 1500);
    } catch (err) {
      console.error(err);
      setToastMessage({
        title: 'Enrollment Failed',
        desc: 'Please try again later.'
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }
    setPostingQA(true);
    try {
      const res = await fetch('/api/courses/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course._id || params.id,
          title: newQuestionTitle,
          content: newQuestionContent
        })
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions([data.question, ...questions]);
        setNewQuestionTitle('');
        setNewQuestionContent('');
        setToastMessage({ title: 'Question Posted', desc: 'Your question is now live.' });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPostingQA(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quizData) return;
    
    let score = 0;
    quizData.questions.forEach((q: any, index: number) => {
      if (quizAnswers[index] === q.correctAnswer) {
        score += 1;
      }
    });
    
    const percentage = Math.round((score / quizData.questions.length) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);
    
    if (percentage >= 60) {
      setToastMessage({ title: 'Assessment Passed! 🏆', desc: `You scored ${percentage}%. Your certificate is unlocked!` });
      // In a real app, we'd hit /api/users/complete to mark the course done
    } else {
      setToastMessage({ title: 'Assessment Failed', desc: `You scored ${percentage}%. You need 60% to pass. Try again!` });
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleWishlist = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    setToastMessage({
      title: !isWishlisted ? 'Added to Wishlist!' : 'Removed from Wishlist',
      desc: !isWishlisted ? `${course.title} has been saved.` : `${course.title} has been removed.`
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  function getVideoId(courseData: any) {
    if (!courseData) return 'Q33KBiDriJY';
    if (courseData.videoId) return courseData.videoId;
    
    const tag = (courseData.tag || '').toLowerCase();
    const title = (courseData.title || '').toLowerCase();
    
    if (title.includes('mobile')) return 'jtK3RYjEH2I';
    if (title.includes('cloud') || title.includes('devops')) return 'hQcFE0RD0cQ';
    if (title.includes('cyber') || title.includes('security')) return 'lpa8uy4DyMo';
    if (tag.includes('web') || title.includes('web') || title.includes('full-stack') || title.includes('react')) return 'F4zr1aMevB4';
    if (tag.includes('design') || title.includes('ui/ux') || title.includes('figma')) return 'c9Wg6Cb_YlU';
    if (tag.includes('data') || title.includes('python') || title.includes('machine') || title.includes('ai')) return 'xPh5ihBWang';
    if (tag.includes('market') || title.includes('seo') || title.includes('digital') || title.includes('social')) return 'bixR-KIJKYM';
    if (tag.includes('business') || title.includes('finance') || title.includes('manage') || title.includes('startup')) return '8nJzBq0Hq20';
    
    // Default fallback
    return 'Q33KBiDriJY'; 
  };

  const handlePlayContent = (name: string, isLocked: boolean, index: number = 0) => {
    if (isLocked) {
      setToastMessage({
        title: 'Content Locked',
        desc: 'Please enroll in the course to unlock this section.'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Simulate switching videos for unlocked modules
      const demoVideos = [getVideoId(course), 'c9Wg6Cb_YlU', 'xPh5ihBWang'];
      setCurrentVideoId(demoVideos[index % demoVideos.length]);

      setToastMessage({
        title: 'Module Loaded',
        desc: `Now playing: ${name}`
      });
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="page active" id="page-course-detail">
      {/* Hero Section */}
      <section className="course-detail-hero">
        <div className="container">
          <Link href="/courses" style={{ color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', opacity: 0.8, fontSize: '0.9rem' }}>
            <i className="fas fa-arrow-left"></i> Back to Courses
          </Link>
          <div className="course-header">
            <h1 className="course-title">{course.title}</h1>
            <p className="course-subtitle">{course.description || course.desc || 'Master this topic with our comprehensive course designed for both beginners and professionals.'}</p>
            <div className="course-stats">
              <div className="stat-item">
                <i className="fas fa-star stat-icon"></i>
                <span style={{ fontWeight: 700 }}>{course.rating || 4.7}</span>
              </div>
              <div className="stat-item">
                <span>{(course.reviews || Math.floor(Math.random() * 1000) + 500).toLocaleString('en-US')} ratings</span>
              </div>
              <div className="stat-item">
                <span>{(course.students || Math.floor(Math.random() * 5000) + 1000).toLocaleString('en-US')} Students</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-clock stat-icon"></i>
                <span>{course.hours || 40} hours Total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="course-detail-content">
        <div className="container">
          <div className="course-detail-grid">
            
            {/* Left Column */}
            <div className="left-column">
              {/* Video Player */}
              <div className="video-section">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#0a0a1a' }}>
                  <iframe 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&showinfo=0&controls=1`}
                    title={`Preview - ${course.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="video-info">
                  <h3 className="video-title">Introduction to {course.title}</h3>
                  <div className="video-meta">
                    <span><i className="fas fa-clock"></i> 15:30</span>
                    <span><i className="fas fa-eye"></i> 1,234 views</span>
                  </div>
                </div>
              </div>

              {/* Course Tabs */}
              <div className="course-tabs">
                <div className="tab-navigation">
                  <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                  <button className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Course Content</button>
                  <button className={`tab-btn ${activeTab === 'assessment' ? 'active' : ''}`} onClick={() => setActiveTab('assessment')}>Assessment</button>
                  <button className={`tab-btn ${activeTab === 'qa' ? 'active' : ''}`} onClick={() => setActiveTab('qa')}>Q&A</button>
                  <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
                </div>

                <div className="tab-content">
                  {activeTab === 'overview' && (
                    <div id="overview">
                      <div className="course-description">
                        <p>This comprehensive course will take you from a complete beginner to a professional full-stack web developer. You'll learn the most in-demand technologies including <strong>HTML, CSS, JavaScript, Node.js, React, MongoDB</strong>, and much more.</p>
                        <p>By the end of this course, you'll be able to build real-world applications, understand modern development practices, and have a portfolio of projects that will impress potential employers.</p>
                      </div>

                      <div className="course-features">
                        <div className="feature-item">
                          <div className="feature-icon"><i className="fas fa-code"></i></div>
                          <div>
                            <h5 style={{ margin: '0 0 4px', color: '#1a1a2e', fontSize: '1rem', fontWeight: 600 }}>Hands-on Projects</h5>
                            <p style={{ margin: 0, color: '#8892b0', fontSize: '0.85rem' }}>Build 10+ real-world projects</p>
                          </div>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon" style={{ background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(253, 121, 168, 0.1))', color: '#ff6b6b' }}><i className="fas fa-certificate"></i></div>
                          <div>
                            <h5 style={{ margin: '0 0 4px', color: '#1a1a2e', fontSize: '1rem', fontWeight: 600 }}>Certificate</h5>
                            <p style={{ margin: 0, color: '#8892b0', fontSize: '0.85rem' }}>Get a completion certificate</p>
                          </div>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon" style={{ background: 'linear-gradient(135deg, rgba(0, 206, 201, 0.1), rgba(0, 184, 148, 0.1))', color: '#00cec9' }}><i className="fas fa-mobile-alt"></i></div>
                          <div>
                            <h5 style={{ margin: '0 0 4px', color: '#1a1a2e', fontSize: '1rem', fontWeight: 600 }}>Mobile Friendly</h5>
                            <p style={{ margin: 0, color: '#8892b0', fontSize: '0.85rem' }}>Learn on any device</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'content' && (
                    <div id="content">
                      <div className="content-list">
                        <div className="content-item" style={{ cursor: 'pointer' }} onClick={() => handlePlayContent('1. Introduction to the Course', false, 0)}>
                          <div className="content-icon"><i className="fas fa-play"></i></div>
                          <div className="content-info">
                            <div className="content-name">1. Introduction to the Course</div>
                            <div className="content-duration">16 min</div>
                          </div>
                        </div>
                        <div className="content-item" style={{ cursor: 'pointer' }} onClick={() => handlePlayContent('2. Setting up your Development Environment', false, 1)}>
                          <div className="content-icon"><i className="fas fa-play"></i></div>
                          <div className="content-info">
                            <div className="content-name">2. Setting up your Development Environment</div>
                            <div className="content-duration">22 min</div>
                          </div>
                        </div>
                        <div className="content-item" style={{ cursor: 'pointer' }} onClick={() => handlePlayContent('3. Downloadable Resources & Cheatsheets', false, 2)}>
                          <div className="content-icon"><i className="fas fa-file-alt"></i></div>
                          <div className="content-info">
                            <div className="content-name">3. Downloadable Resources & Cheatsheets</div>
                            <div className="content-duration">1 file</div>
                          </div>
                        </div>
                        <div className="content-item" style={{ cursor: 'pointer' }} onClick={() => handlePlayContent('Section 2: HTML 5 Fundamentals', true)}>
                          <div className="content-icon"><i className="fas fa-lock" style={{ color: '#a0aec0', background: '#f0f0f8' }}></i></div>
                          <div className="content-info">
                            <div className="content-name" style={{ color: '#a0aec0' }}>Section 2: HTML 5 Fundamentals</div>
                            <div className="content-duration">0/8 | 2hr 1min</div>
                          </div>
                        </div>
                        <div className="content-item" style={{ cursor: 'pointer' }} onClick={() => handlePlayContent('Section 3: CSS Styling', true)}>
                          <div className="content-icon"><i className="fas fa-lock" style={{ color: '#a0aec0', background: '#f0f0f8' }}></i></div>
                          <div className="content-info">
                            <div className="content-name" style={{ color: '#a0aec0' }}>Section 3: CSS Styling</div>
                            <div className="content-duration">0/12 | 3hr 45min</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'qa' && (
                    <div id="qa">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h4 style={{ color: '#1a1a2e', fontSize: '1.4rem' }}>Course Q&A</h4>
                      </div>
                      
                      <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px', marginBottom: '32px', border: '1px solid #eaeef2' }}>
                        <h5 style={{ marginBottom: '16px', color: '#1a1a2e' }}>Ask a new question</h5>
                        <form onSubmit={handlePostQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <input type="text" placeholder="Question Title (e.g., Error on line 42)" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d0d0e0', width: '100%', fontFamily: 'inherit' }} value={newQuestionTitle} onChange={e => setNewQuestionTitle(e.target.value)} />
                          <textarea placeholder="Describe your problem in detail..." required rows={3} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d0d0e0', width: '100%', resize: 'vertical', fontFamily: 'inherit' }} value={newQuestionContent} onChange={e => setNewQuestionContent(e.target.value)}></textarea>
                          <button type="submit" disabled={postingQA} style={{ alignSelf: 'flex-start', background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: postingQA ? 'not-allowed' : 'pointer' }}>{postingQA ? 'Posting...' : 'Post Question'}</button>
                        </form>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {questions.length === 0 ? (
                          <p style={{ color: '#8892b0', textAlign: 'center', padding: '20px' }}>No questions yet. Be the first to ask!</p>
                        ) : (
                          questions.map((q: any) => (
                            <div key={q._id} style={{ padding: '20px', border: '1px solid #eaeef2', borderRadius: '12px' }}>
                              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                                  {q.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h5 style={{ margin: '0 0 4px', color: '#1a1a2e', fontSize: '1.1rem' }}>{q.title}</h5>
                                  <p style={{ margin: '0 0 12px', color: '#4a4a6a', fontSize: '0.95rem', lineHeight: 1.5 }}>{q.content}</p>
                                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#a0aec0' }}>
                                    <span><i className="far fa-user"></i> {q.user.name}</span>
                                    <span><i className="far fa-clock"></i> {new Date(q.createdAt).toLocaleDateString()}</span>
                                    <span><i className="far fa-comment"></i> {q.replies.length} replies</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'assessment' && (
                    <div id="assessment">
                      <h4 style={{ color: '#1a1a2e', fontSize: '1.4rem', marginBottom: '8px' }}>Final Assessment</h4>
                      <p style={{ color: '#8892b0', marginBottom: '24px' }}>Test your knowledge to complete the course and unlock your certificate. You need at least 60% to pass.</p>
                      
                      {!quizData ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading assessment...</div>
                      ) : (
                        <div style={{ background: '#f8f9fa', padding: '32px', borderRadius: '16px', border: '1px solid #eaeef2' }}>
                          <h5 style={{ fontSize: '1.2rem', color: '#6c5ce7', marginBottom: '24px', borderBottom: '2px solid rgba(108,92,231,0.1)', paddingBottom: '12px' }}>
                            {quizData.title}
                          </h5>
                          
                          {quizData.questions.map((q: any, qIndex: number) => (
                            <div key={q.id} style={{ marginBottom: '32px' }}>
                              <h6 style={{ fontSize: '1.05rem', color: '#1a1a2e', marginBottom: '16px', lineHeight: 1.4 }}>
                                {qIndex + 1}. {q.question}
                              </h6>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {q.options.map((opt: string, oIndex: number) => {
                                  const isSelected = quizAnswers[qIndex] === oIndex;
                                  let optionStyle = {
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: isSelected ? '2px solid #6c5ce7' : '1px solid #d0d0e0',
                                    background: isSelected ? 'rgba(108,92,231,0.05)' : 'white',
                                    cursor: quizSubmitted ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'all 0.2s ease',
                                    color: '#4a4a6a'
                                  };
                                  
                                  if (quizSubmitted) {
                                    if (q.correctAnswer === oIndex) {
                                      optionStyle.background = 'rgba(0,184,148,0.1)';
                                      optionStyle.border = '2px solid #00b894';
                                      optionStyle.color = '#00b894';
                                    } else if (isSelected && q.correctAnswer !== oIndex) {
                                      optionStyle.background = 'rgba(255,107,107,0.1)';
                                      optionStyle.border = '2px solid #ff6b6b';
                                      optionStyle.color = '#ff6b6b';
                                    }
                                  }
                                  
                                  return (
                                    <div 
                                      key={oIndex} 
                                      style={optionStyle}
                                      onClick={() => {
                                        if (!quizSubmitted) {
                                          setQuizAnswers({...quizAnswers, [qIndex]: oIndex});
                                        }
                                      }}
                                    >
                                      <div style={{ 
                                        width: '20px', height: '20px', borderRadius: '50%', 
                                        border: isSelected ? (quizSubmitted ? (q.correctAnswer === oIndex ? '6px solid #00b894' : '6px solid #ff6b6b') : '6px solid #6c5ce7') : '2px solid #a0aec0',
                                        background: 'white', flexShrink: 0
                                      }}></div>
                                      <span>{opt}</span>
                                      
                                      {quizSubmitted && q.correctAnswer === oIndex && (
                                        <i className="fas fa-check-circle" style={{ marginLeft: 'auto', color: '#00b894', fontSize: '18px' }}></i>
                                      )}
                                      {quizSubmitted && isSelected && q.correctAnswer !== oIndex && (
                                        <i className="fas fa-times-circle" style={{ marginLeft: 'auto', color: '#ff6b6b', fontSize: '18px' }}></i>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          
                          {quizSubmitted ? (
                            <div style={{ 
                              padding: '24px', 
                              borderRadius: '12px', 
                              background: quizScore >= 60 ? 'linear-gradient(135deg, rgba(0,184,148,0.1), rgba(0,206,201,0.1))' : 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(253,121,168,0.1))',
                              border: quizScore >= 60 ? '1px solid #00b894' : '1px solid #ff6b6b',
                              textAlign: 'center'
                            }}>
                              <h3 style={{ margin: '0 0 8px', color: quizScore >= 60 ? '#00b894' : '#ff6b6b' }}>
                                {quizScore >= 60 ? '🎉 Passed!' : '❌ Failed'}
                              </h3>
                              <p style={{ margin: 0, color: '#1a1a2e', fontSize: '1.1rem', fontWeight: 600 }}>Your Score: {quizScore}%</p>
                              <button 
                                onClick={() => {
                                  setQuizSubmitted(false);
                                  setQuizAnswers({});
                                }}
                                style={{ marginTop: '16px', padding: '8px 24px', background: 'transparent', border: `2px solid ${quizScore >= 60 ? '#00b894' : '#ff6b6b'}`, color: quizScore >= 60 ? '#00b894' : '#ff6b6b', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                Retake Assessment
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={handleSubmitQuiz}
                              disabled={Object.keys(quizAnswers).length < quizData.questions.length}
                              style={{ 
                                width: '100%', padding: '16px', background: 'linear-gradient(135deg, #6c5ce7, #4a3dc7)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700,
                                cursor: Object.keys(quizAnswers).length < quizData.questions.length ? 'not-allowed' : 'pointer',
                                opacity: Object.keys(quizAnswers).length < quizData.questions.length ? 0.5 : 1
                              }}
                            >
                              Submit Assessment
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div id="reviews">
                      <h4 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Student Reviews</h4>
                      <p style={{ color: '#8892b0' }}>Read what other students say about this course.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="right-column">
              <div className="detail-sidebar">
                <div className="enroll-section">
                  <div className="course-price">
                    <span className="original-price">₹{(course.price * 1.5).toFixed(0)}</span>
                    ₹{course.price}
                  </div>
                  <button className="btn-enroll-lg" onClick={handleEnroll}>
                    {!session ? 'Sign in to Enroll' : (course.price && course.price > 0 ? `Buy for ₹${course.price}` : 'Enroll Now')}
                  </button>
                  <button className="btn-wishlist" onClick={handleWishlist} style={{ color: isWishlisted ? '#ff6b6b' : '', borderColor: isWishlisted ? 'rgba(255, 107, 107, 0.3)' : '', background: isWishlisted ? 'rgba(255, 107, 107, 0.05)' : '' }}>
                    <i className={isWishlisted ? "fas fa-heart" : "far fa-heart"}></i> 
                    {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>

                <div className="course-includes">
                  <h5 className="includes-title">This course includes:</h5>
                  <ul className="includes-list">
                    <li className="includes-item">
                      <i className="fas fa-play-circle includes-icon"></i>
                      <span>{course.hours || 40} hours on-demand video</span>
                    </li>
                    <li className="includes-item">
                      <i className="fas fa-file-download includes-icon"></i>
                      <span>50+ downloadable resources</span>
                    </li>
                    <li className="includes-item">
                      <i className="fas fa-mobile-alt includes-icon"></i>
                      <span>Access on mobile and TV</span>
                    </li>
                    <li className="includes-item">
                      <i className="fas fa-infinity includes-icon"></i>
                      <span>Full lifetime access</span>
                    </li>
                    <li className="includes-item">
                      <i className="fas fa-award includes-icon"></i>
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>

                <div className="instructor-card">
                  <h5 className="includes-title" style={{ marginBottom: '20px' }}>Instructor</h5>
                  <div className="instructor-info">
                    <div className="instructor-avatar">{course.instructorInitials || 'IN'}</div>
                    <div className="instructor-details">
                      <h5>{course.instructorName || course.instructor || 'Expert Instructor'}</h5>
                      <p>{course.instructorRole || course.role || 'Senior Industry Professional'}</p>
                    </div>
                  </div>
                  <p className="instructor-bio">
                    {course.instructorName || course.instructor || 'Our instructor'} is an experienced professional with years of industry experience, dedicated to helping you master the material.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a1a2e',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 9999,
          animation: 'modalPopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <div style={{ background: '#00cec9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fas fa-info" style={{ fontSize: '14px', color: '#1a1a2e' }}></i>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>{toastMessage.title}</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#a0aec0' }}>{toastMessage.desc}</p>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .course-detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (min-width: 992px) {
          .course-detail-grid {
            grid-template-columns: 2.2fr 1fr;
          }
        }
      `}} />
    </div>
  );
}
