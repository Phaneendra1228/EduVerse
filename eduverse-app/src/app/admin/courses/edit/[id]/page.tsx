"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
    price: '',
    hours: '',
    instructorName: '',
    instructorRole: '',
    instructorInitials: '',
    image: ''
  });

  useEffect(() => {
    if (!id) return;
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const course = data.find(c => c._id === id);
          if (course) {
            setFormData({
              title: course.title || '',
              description: course.description || '',
              tag: course.tag || '',
              price: course.price?.toString() || '',
              hours: course.hours?.toString() || '',
              instructorName: course.instructorName || '',
              instructorRole: course.instructorRole || '',
              instructorInitials: course.instructorInitials || '',
              image: course.image || ''
            });
          }
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: id,
          ...formData,
          price: Number(formData.price),
          hours: Number(formData.hours),
        })
      });
      if (res.ok) {
        router.push('/admin/courses');
      } else {
        alert("Failed to update course.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="admin-overview-wrapper" style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: '#6c5ce7' }}></i>
      </div>
    );
  }

  return (
    <div className="admin-overview-wrapper">
      <div className="admin-courses-header">
        <div>
          <Link href="/admin/courses" style={{ color: '#a0aec0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <i className="fas fa-arrow-left"></i> Back to Courses
          </Link>
          <h1>Edit Course</h1>
          <p>Update the details of this existing course.</p>
        </div>
      </div>

      <div className="admin-panel">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Course Title *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="admin-input" placeholder="e.g. Advanced React Patterns" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Category Tag *</label>
              <input required type="text" name="tag" value={formData.tag} onChange={handleChange} className="admin-input" placeholder="e.g. Web Development" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold' }}>Description *</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="admin-input" rows={4} placeholder="Describe what students will learn..."></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Price ($) *</label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="admin-input" placeholder="e.g. 199" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Duration (Hours) *</label>
              <input required type="number" name="hours" value={formData.hours} onChange={handleChange} className="admin-input" placeholder="e.g. 40" />
            </div>
          </div>

          <h3 style={{ marginTop: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Instructor Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Name *</label>
              <input required type="text" name="instructorName" value={formData.instructorName} onChange={handleChange} className="admin-input" placeholder="e.g. Jane Doe" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Role *</label>
              <input required type="text" name="instructorRole" value={formData.instructorRole} onChange={handleChange} className="admin-input" placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>Initials (Avatar) *</label>
              <input required type="text" name="instructorInitials" value={formData.instructorInitials} onChange={handleChange} className="admin-input" placeholder="e.g. JD" maxLength={2} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 'bold' }}>Thumbnail Image URL</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} className="admin-input" placeholder="https://..." />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link href="/admin/courses" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Cancel</Link>
            <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: '#6c5ce7', color: 'white', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Saving...' : 'Update Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
