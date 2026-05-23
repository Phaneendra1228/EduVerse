"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminCourseCreation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    rating: '4.5',
    hours: '20',
    tag: 'Web Development',
    image: '/images/course1.jpg'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          rating: Number(formData.rating),
          hours: Number(formData.hours),
          tag: formData.tag,
          image: formData.image
        })
      });

      if (res.ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          router.push('/courses'); // Redirect to courses page to see the new course
        }, 2000);
      } else {
        alert("Failed to create course");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.03)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#a0aec0', textDecoration: 'none', marginBottom: '24px', fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}>
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>

        <h1 style={{ fontFamily: 'Outfit, sans-serif', color: 'white', fontSize: '2.5rem', margin: '0 0 8px 0' }}>Create New Course</h1>
        <p style={{ color: '#a0aec0', margin: '0 0 32px 0' }}>Publish a new premium course directly to the catalog.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>Course Title *</label>
            <input 
              type="text" 
              name="title" 
              required 
              value={formData.title} 
              onChange={handleChange}
              className="admin-input"
              placeholder="e.g. Master Next.js 14"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>Course Description *</label>
            <textarea 
              name="description" 
              required 
              rows={4}
              value={formData.description} 
              onChange={handleChange}
              className="admin-input"
              style={{ resize: 'vertical' }}
              placeholder="Detailed description of what students will learn..."
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>Price ($) *</label>
              <input 
                type="number" 
                name="price" 
                required 
                min="0"
                step="0.01"
                value={formData.price} 
                onChange={handleChange}
                className="admin-input"
                placeholder="99.99"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>Category / Tag *</label>
              <select 
                name="tag" 
                value={formData.tag} 
                onChange={handleChange}
                className="admin-input"
              >
                <option style={{ background: '#111126' }} value="Web Development">Web Development</option>
                <option style={{ background: '#111126' }} value="Data Science">Data Science</option>
                <option style={{ background: '#111126' }} value="UI/UX Design">UI/UX Design</option>
                <option style={{ background: '#111126' }} value="Mobile Development">Mobile Development</option>
                <option style={{ background: '#111126' }} value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>Total Hours</label>
              <input 
                type="number" 
                name="hours" 
                min="1"
                value={formData.hours} 
                onChange={handleChange}
                className="admin-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>Initial Rating</label>
              <input 
                type="number" 
                name="rating" 
                min="1" 
                max="5"
                step="0.1"
                value={formData.rating} 
                onChange={handleChange}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#e2e8f0' }}>Cover Image URL</label>
            <input 
              type="text" 
              name="image" 
              value={formData.image} 
              onChange={handleChange}
              className="admin-input"
              placeholder="/images/course.jpg"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '16px', 
              padding: '16px', 
              background: loading ? '#a0aec0' : 'linear-gradient(to right, #6c5ce7, #00cec9)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '1.1rem', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 15px rgba(108, 92, 231, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Publishing...' : <><i className="fas fa-upload"></i> Publish Course</>}
          </button>
        </form>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div style={{
          position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a2e', color: 'white', padding: '16px 24px', borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '16px',
          zIndex: 9999, animation: 'modalPopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <div style={{ background: '#00b894', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="fas fa-check" style={{ fontSize: '14px', color: 'white' }}></i>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Course Published!</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#a0aec0' }}>Redirecting to catalog...</p>
          </div>
        </div>
      )}
    </div>
  );
}
