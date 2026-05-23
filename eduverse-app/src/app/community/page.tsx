import React from 'react';
import Link from 'next/link';

export default function CommunityPage() {
  const posts = [
    { id: 1, author: 'Sarah Chen', avatar: 'S', time: '2 hours ago', title: 'React Hooks vs Context API for state management?', preview: 'I am building a large scale dashboard and wondering if I should stick to Context API or bring in Redux/Zustand. What are your thoughts?', likes: 24, comments: 12, tags: ['React', 'Web Dev'] },
    { id: 2, author: 'Alex Miller', avatar: 'A', time: '5 hours ago', title: 'Just passed the AWS Solutions Architect exam!', preview: 'Thanks to the EduVerse cloud computing track, I finally passed my certification today. Here are my study notes for anyone interested...', likes: 89, comments: 34, tags: ['Cloud', 'Success'] },
    { id: 3, author: 'Priya Patel', avatar: 'P', time: '1 day ago', title: 'Struggling with advanced CSS Grid layouts', preview: 'Can someone explain how grid-template-areas work in real-world responsive design? I keep breaking my layouts on mobile.', likes: 15, comments: 8, tags: ['CSS', 'Design'] },
    { id: 4, author: 'David Kim', avatar: 'D', time: '2 days ago', title: 'Best resources for learning Python data structures?', preview: 'Moving from JS to Python and finding lists/tuples/dictionaries a bit confusing. Any good visual tutorials?', likes: 42, comments: 19, tags: ['Python', 'Data'] }
  ];

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '100px 20px 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6c5ce7', textDecoration: 'none', marginBottom: '16px', fontWeight: 600 }}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </Link>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e', fontSize: '2.5rem', margin: 0 }}>Community Hub</h1>
            <p style={{ color: '#8892b0', margin: '8px 0 0 0' }}>Join the discussion with fellow students and mentors.</p>
          </div>
          <button style={{ padding: '12px 24px', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(108,92,231,0.3)' }}>
            <i className="fas fa-plus"></i> New Discussion
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }}>
          
          {/* Sidebar */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid rgba(108,92,231,0.08)' }}>
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
            {posts.map(post => (
              <div key={post.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid rgba(108,92,231,0.08)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c5ce7, #00cec9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {post.avatar}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1a1a2e' }}>{post.author}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>{post.time}</span>
                  </div>
                </div>
                <h2 style={{ fontSize: '1.25rem', color: '#1a1a2e', margin: '0 0 8px 0' }}>{post.title}</h2>
                <p style={{ color: '#4a4a6a', fontSize: '0.95rem', margin: '0 0 16px 0', lineHeight: 1.6 }}>{post.preview}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{ padding: '4px 10px', background: 'rgba(108,92,231,0.05)', color: '#6c5ce7', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', color: '#8892b0', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-arrow-up"></i> {post.likes}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-comment"></i> {post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
