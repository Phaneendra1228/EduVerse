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
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '120px 20px 80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4a4a6a', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>

        <h1 style={{ fontFamily: 'Outfit, sans-serif', color: '#1a1a2e', fontSize: '2.5rem', marginBottom: '8px' }}>Create New Course</h1>
        <p style={{ color: '#8892b0', marginBottom: '32px' }}>Publish a new premium course directly to the catalog.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a1a2e' }}>Course Title *</label>
            <input 
              type="text" 
              name="title" 
              required 
              value={formData.title} 
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa' }}
              placeholder="e.g. Master Next.js 14"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a1a2e' }}>Course Description *</label>
            <textarea 
              name="description" 
              required 
              rows={4}
              value={formData.description} 
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa', resize: 'vertical' }}
              placeholder="Detailed description of what students will learn..."
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a1a2e' }}>Price ($) *</label>
              <input 
                type="number" 
                name="price" 
                required 
                min="0"
                step="0.01"
                value={formData.price} 
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa' }}
                placeholder="99.99"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a1a2e' }}>Category / Tag *</label>
              <select 
                name="tag" 
                value={formData.tag} 
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa' }}
              >
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a1a2e' }}>Total Hours</label>
              <input 
                type="number" 
                name="hours" 
                min="1"
                value={formData.hours} 
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a1a2e' }}>Initial Rating</label>
              <input 
                type="number" 
                name="rating" 
                min="1" 
                max="5"
                step="0.1"
                value={formData.rating} 
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1a1a2e' }}>Cover Image Template</label>
            <select 
              name="image" 
              value={formData.image} 
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d0d0e0', fontSize: '1rem', background: '#f8f9fa' }}
            >
              <option value="/images/course1.jpg">Template 1 (Purple Code)</option>
              <option value="/images/course2.jpg">Template 2 (Blue Graph)</option>
              <option value="/images/course3.jpg">Template 3 (Gold Design)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '16px',
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              padding: '16px', 
              borderRadius: '8px', 
              fontSize: '1.1rem',
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
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
