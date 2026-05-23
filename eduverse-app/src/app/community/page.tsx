"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPreview, setNewPreview] = useState('');
  const [newTags, setNewTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic UI update
    setPosts(posts.map(p => p._id === id ? { ...p, likes: p.likes + 1 } : p));
    try {
      await fetch('/api/community', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, action: 'upvote' })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPreview) return;
    
    setSubmitting(true);
    try {
      // Parse comma separated tags
      const parsedTags = newTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          preview: newPreview,
          author: JSON.parse(localStorage.getItem('eduverse_user') || '{}').name || 'Anonymous Student',
          tags: parsedTags
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewTitle('');
        setNewPreview('');
        setNewTags('');
        fetchPosts(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to format date
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    
    if (diffMins < 60) return `${diffMins || 1} mins ago`;
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '100px 20px 40px', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6c5ce7', textDecoration: 'none', marginBottom: '16px', fontWeight: 600 }}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </Link>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e', fontSize: '2.5rem', margin: 0 }}>Community Hub</h1>
            <p style={{ color: '#8892b0', margin: '8px 0 0 0' }}>Join the discussion with fellow students and mentors.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} style={{ padding: '12px 24px', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(108,92,231,0.3)' }}>
            <i className="fas fa-plus"></i> New Discussion
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }}>
          
          {/* Sidebar */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid rgba(108,92,231,0.08)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '16px' }}>Topics</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'rgba(108,92,231,0.1)', color: '#6c5ce7', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}><i className="fas fa-globe"></i> All Discussions</a></li>
              <li><a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', color: '#4a4a6a', borderRadius: '8px', textDecoration: 'none' }}><i className="fas fa-code"></i> Web Development</a></li>
              <li><a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', color: '#4a4a6a', borderRadius: '8px', textDecoration: 'none' }}><i className="fas fa-database"></i> Data Science</a></li>
              <li><a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', color: '#4a4a6a', borderRadius: '8px', textDecoration: 'none' }}><i className="fas fa-paint-brush"></i> UI/UX Design</a></li>
              <li><a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', color: '#4a4a6a', borderRadius: '8px', textDecoration: 'none' }}><i className="fas fa-briefcase"></i> Career Advice</a></li>
            </ul>
          </div>

          {/* Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#8892b0' }}>Loading discussions...</div>
            ) : posts.length === 0 ? (
              <div style={{ background: 'white', padding: '40px', textAlign: 'center', borderRadius: '16px', border: '1px solid rgba(108,92,231,0.08)' }}>
                <i className="fas fa-comments" style={{ fontSize: '3rem', color: '#dcdde1', marginBottom: '16px' }}></i>
                <h3 style={{ margin: '0 0 8px 0', color: '#1a1a2e' }}>No discussions yet</h3>
                <p style={{ margin: 0, color: '#8892b0' }}>Be the first to start a conversation!</p>
              </div>
            ) : posts.map(post => (
              <div key={post._id} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid rgba(108,92,231,0.08)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c5ce7, #00cec9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {post.avatar}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1a1a2e' }}>{post.author}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>{formatTime(post.createdAt)}</span>
                  </div>
                </div>
                <h2 style={{ fontSize: '1.25rem', color: '#1a1a2e', margin: '0 0 8px 0' }}>{post.title}</h2>
                <p style={{ color: '#4a4a6a', fontSize: '0.95rem', margin: '0 0 16px 0', lineHeight: 1.6 }}>{post.preview}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(post.tags || []).map((tag: string) => (
                      <span key={tag} style={{ padding: '4px 10px', background: 'rgba(108,92,231,0.05)', color: '#6c5ce7', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: '#8892b0', fontSize: '0.9rem' }}>
                    <button onClick={(e) => handleUpvote(post._id, e)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(108,92,231,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                      <i className="fas fa-arrow-up"></i> {post.likes}
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px' }}><i className="fas fa-comment"></i> {post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,10,26,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', color: '#1a1a2e', fontSize: '1.8rem' }}>Create Discussion</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#8892b0', cursor: 'pointer' }}><i className="fas fa-times"></i></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a4a6a', fontWeight: 600, fontSize: '0.95rem' }}>Discussion Title</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What's on your mind?"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a4a6a', fontWeight: 600, fontSize: '0.95rem' }}>Details</label>
                <textarea 
                  required
                  value={newPreview}
                  onChange={(e) => setNewPreview(e.target.value)}
                  placeholder="Provide more context..."
                  rows={4}
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#4a4a6a', fontWeight: 600, fontSize: '0.95rem' }}>Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="React, Design, Help..."
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #dcdde1', fontSize: '1rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px', background: 'transparent', color: '#4a4a6a', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: '12px 24px', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Posting...' : 'Post Discussion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
