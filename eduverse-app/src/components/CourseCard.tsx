"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface CourseProps {
  course: {
    _id?: string;
    title: string;
    description: string;
    rating: number;
    reviews: number;
    hours: number;
    price: number | string;
    tag: string;
    instructorName: string;
    instructorRole: string;
    instructorInitials: string;
    image: string;
  };
}

export default function CourseCard({ course }: CourseProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', desc: '' });

  const handleEnroll = () => {
    // Navigate to course details page instead of directly enrolling
    // We use a safe URL-friendly string for the ID if _id isn't present
    const courseId = course._id || course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    router.push(`/courses/${courseId}`);
  };

  const handleTakeTest = () => {
    const courseId = course._id || course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    router.push(`/test/${courseId}`);
  };

  return (
    <div className="course-card">
      <div className="course-card-img">
        <img src={course.image || course.img} alt={course.title} loading="lazy" />
        <span className="course-card-tag">{course.tag}</span>
        <span className="course-card-price">${course.price}</span>
      </div>
      <div className="course-card-body">
        <h3>{course.title}</h3>
        <p>{course.description || course.desc}</p>
        <div className="course-meta">
          <div className="course-rating">
            {'★'.repeat(Math.floor(course.rating))}{'☆'.repeat(5 - Math.floor(course.rating))}
            <span>{course.rating} ({course.reviews.toLocaleString()})</span>
          </div>
          <span>⏱ {course.hours} hours</span>
        </div>
        <div className="course-instructor">
          <div className="course-instructor-avatar">{course.instructorInitials || course.initials}</div>
          <div className="course-instructor-info">
            <h4>{course.instructorName || course.instructor}</h4>
            <p>{course.instructorRole || course.role}</p>
          </div>
        </div>
        <div className="course-btns">
          <button className="btn btn-primary" onClick={handleEnroll}>View Details</button>
          <button className="btn btn-secondary" onClick={handleTakeTest}>Take Test</button>
        </div>
      </div>
      
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
    </div>
  );
}
