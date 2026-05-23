"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import './certificate.css';
import { coursesData } from '@/lib/data';

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [course, setCourse] = useState<any>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      // Find course details
      const cId = params.courseId as string;
      const foundCourse = coursesData.find(
        c => c.id.toString() === cId || c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cId
      );
      setCourse(foundCourse);

      // Verify progress is 100%
      fetch('/api/users/enroll')
        .then(res => res.json())
        .then(data => {
          if (data.courseProgress) {
            const currentProgress = data.courseProgress[cId] || 0;
            setProgress(currentProgress);
          } else {
            setProgress(0);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [status, params.courseId, router]);

  if (loading || status === 'loading') {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Verifying Credentials...</h2></div>;
  }

  if (progress !== null && progress < 100) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafaff' }}>
        <i className="fas fa-lock" style={{ fontSize: '4rem', color: '#ff6b6b', marginBottom: '24px' }}></i>
        <h2 style={{ color: '#1a1a2e', marginBottom: '16px' }}>Certificate Locked</h2>
        <p style={{ color: '#4a4a6a', marginBottom: '24px' }}>You must complete 100% of the course and pass the final assessment to unlock this certificate.</p>
        <Link href={`/courses/${params.courseId}`} style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Return to Course
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="cert-page-wrapper">
      <div className="cert-actions">
        <Link href="/dashboard" className="btn-back">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
        <button onClick={handlePrint} className="btn-print">
          <i className="fas fa-print"></i> Print / Save as PDF
        </button>
      </div>

      <div className="certificate-container" id="certificate-print-area">
        <div className="certificate-border">
          <div className="cert-corner tl"></div>
          <div className="cert-corner tr"></div>
          <div className="cert-corner bl"></div>
          <div className="cert-corner br"></div>

          <div className="cert-content">
            <h1 className="cert-header">Certificate of Completion</h1>
            <div className="cert-subheader">EduVerse Learning Platform</div>
            
            <p className="cert-text">This is to proudly certify that</p>
            <h2 className="cert-name">{session?.user?.name || 'Student Name'}</h2>
            
            <p className="cert-text">has successfully completed the online course</p>
            <h3 className="cert-course">{course ? course.title : 'Premium Course Content'}</h3>
            
            <p className="cert-text">demonstrating a strong understanding of the core concepts, methodologies, and practical applications required to achieve a perfect score in the final assessment.</p>

            <div className="cert-footer">
              <div className="cert-signature">
                <div className="cert-line"></div>
                <p>Date of Issue</p>
                <strong>{today}</strong>
              </div>

              <div className="cert-seal">
                <i className="fas fa-award"></i>
              </div>

              <div className="cert-signature">
                <img src="/images/logo.svg" alt="EduVerse" style={{ filter: 'brightness(0)' }} />
                <div className="cert-line"></div>
                <p>EduVerse Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
