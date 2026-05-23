"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch('/api/users/enroll')
        .then(res => res.json())
        .then(data => {
          if (data.enrolledCourses) {
            setEnrolledCourses(data.enrolledCourses);
          }
          if (data.courseProgress) {
            setCourseProgress(data.courseProgress);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    // Animate progress bars
    document.querySelectorAll('.progress-fill').forEach((bar: Element) => {
      const htmlBar = bar as HTMLElement;
      const w = htmlBar.style.width;
      htmlBar.style.width = '0';
      setTimeout(() => { htmlBar.style.width = w; }, 300);
    });

    // Animate chart bars
    document.querySelectorAll('.chart-bar').forEach((bar: Element) => {
      const htmlBar = bar as HTMLElement;
      const h = htmlBar.style.height;
      htmlBar.style.height = '0';
      setTimeout(() => { htmlBar.style.height = h; }, 500);
    });
  }, []);

  return (
    <>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-book-open"></i></div>
          <h3>{enrolledCourses.length}</h3><p>Enrolled Courses</p>
          <span className="stat-trend up"><i className="fas fa-arrow-up"></i> +2 this month</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-clock"></i></div>
          <h3>48h</h3><p>Learning Hours</p>
          <span className="stat-trend up"><i className="fas fa-arrow-up"></i> +12h this week</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-trophy"></i></div>
          <h3>3</h3><p>Certificates Earned</p>
          <span className="stat-trend up"><i className="fas fa-arrow-up"></i> +1 recently</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-fire"></i></div>
          <h3>14</h3><p>Day Streak</p>
          <span className="stat-trend up"><i className="fas fa-arrow-up"></i> Keep going!</span>
        </div>
      </div>

      {/* Grid: Progress + Schedule */}
      <div className="dashboard-grid">
        <div className="panel" id="enrolled-courses" style={{ scrollMarginTop: '100px' }}>
          <div className="panel-header">
            <h3>Course Progress</h3>
            <Link href="/courses">Explore Courses</Link>
          </div>
          
          {loading ? (
            <p style={{ padding: '20px', color: '#8892b0' }}>Loading courses...</p>
          ) : enrolledCourses.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', background: '#fafaff', borderRadius: '12px', border: '1px dashed #d0d0e0' }}>
              <p style={{ color: '#4a4a6a', marginBottom: '16px' }}>You haven't enrolled in any courses yet.</p>
              <Link href="/courses" style={{ display: 'inline-block', padding: '10px 24px', background: 'var(--primary)', color: '#fff', borderRadius: '8px', fontWeight: 600 }}>Browse Courses</Link>
            </div>
          ) : (
            enrolledCourses.map((course, index) => {
              // Get actual live progress from database
              const progress = courseProgress[course._id] || 0;
              const colors = ['var(--primary)', 'var(--accent)', 'var(--gold-dark)', '#ff6b6b'];
              const bgs = ['rgba(108,92,231,0.1)', 'rgba(0,206,201,0.1)', 'rgba(249,202,36,0.1)', 'rgba(255,107,107,0.1)'];
              const iconColor = colors[index % colors.length];
              const iconBg = bgs[index % bgs.length];

              return (
                <Link href={`/courses/${course._id}`} key={course._id} style={{ display: 'block', textDecoration: 'none' }}>
                  <div className="progress-card">
                    <div className="progress-card-icon" style={{ background: iconBg, color: iconColor }}>
                      <i className="fas fa-laptop-code"></i>
                    </div>
                    <div className="progress-card-info">
                      <h4 style={{ color: '#1a1a2e' }}>{course.title}</h4>
                      <p>{course.tag}</p>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
                    </div>
                    <div className="progress-card-percent">
                      {progress === 100 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span>100%</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gold-dark)', fontWeight: 700 }}><i className="fas fa-award"></i> Certificate</span>
                        </div>
                      ) : (
                        `${progress}%`
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Today&apos;s Schedule</h3>
            <Link href="/meetings">Full Calendar</Link>
          </div>
          <div className="schedule-item">
            <div className="schedule-time"><div className="time">9:00</div><div className="period">AM</div></div>
            <div className="schedule-dot" style={{ background: 'var(--primary)' }}></div>
            <div className="schedule-info"><h4>Web Dev Live Session</h4><p>React Hooks & Context API</p></div>
          </div>
          <div className="schedule-item">
            <div className="schedule-time"><div className="time">11:30</div><div className="period">AM</div></div>
            <div className="schedule-dot" style={{ background: 'var(--accent)' }}></div>
            <div className="schedule-info"><h4>ML Workshop</h4><p>Neural Networks Fundamentals</p></div>
          </div>
          <div className="schedule-item">
            <div className="schedule-time"><div className="time">2:00</div><div className="period">PM</div></div>
            <div className="schedule-dot" style={{ background: 'var(--gold)' }}></div>
            <div className="schedule-info"><h4>Group Project Meeting</h4><p>E-commerce app sprint review</p></div>
          </div>
          <div className="schedule-item">
            <div className="schedule-time"><div className="time">4:30</div><div className="period">PM</div></div>
            <div className="schedule-dot" style={{ background: '#ff6b6b' }}></div>
            <div className="schedule-info"><h4>Career Mentoring</h4><p>1-on-1 with Sarah Chen</p></div>
          </div>
          <div className="schedule-item">
            <div className="schedule-time"><div className="time">6:00</div><div className="period">PM</div></div>
            <div className="schedule-dot" style={{ background: 'var(--primary-light)' }}></div>
            <div className="schedule-info"><h4>Cyber Security Quiz</h4><p>Module 15 assessment</p></div>
          </div>
        </div>
      </div>

      {/* Grid: Chart + Activity */}
      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Weekly Study Hours</h3>
            <Link href="#">This Week</Link>
          </div>
          <div className="chart-area" id="weeklyChart">
            <div className="chart-bar" style={{ height: '40%' }} data-label="Mon"></div>
            <div className="chart-bar" style={{ height: '65%' }} data-label="Tue"></div>
            <div className="chart-bar" style={{ height: '50%' }} data-label="Wed"></div>
            <div className="chart-bar" style={{ height: '80%' }} data-label="Thu"></div>
            <div className="chart-bar" style={{ height: '45%' }} data-label="Fri"></div>
            <div className="chart-bar" style={{ height: '90%' }} data-label="Sat"></div>
            <div className="chart-bar" style={{ height: '70%' }} data-label="Sun"></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Recent Activity</h3>
            <Link href="#">View All</Link>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'rgba(85,239,196,0.1)', color: '#00b894' }}><i className="fas fa-check"></i></div>
            <div className="activity-info"><h4>Completed Module 12 — React Hooks</h4><p>2 hours ago</p></div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'rgba(108,92,231,0.1)', color: 'var(--primary)' }}><i className="fas fa-star"></i></div>
            <div className="activity-info"><h4>Earned &quot;Python Pro&quot; certificate</h4><p>Yesterday</p></div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'rgba(249,202,36,0.1)', color: 'var(--gold-dark)' }}><i className="fas fa-fire"></i></div>
            <div className="activity-info"><h4>14-day learning streak achieved</h4><p>Today</p></div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'rgba(0,206,201,0.1)', color: 'var(--accent)' }}><i className="fas fa-users"></i></div>
            <div className="activity-info"><h4>Joined AI Workshop group</h4><p>2 days ago</p></div>
          </div>
          <div className="activity-item">
            <div className="activity-icon" style={{ background: 'rgba(255,107,107,0.1)', color: '#ff6b6b' }}><i className="fas fa-clipboard-check"></i></div>
            <div className="activity-info"><h4>Scored 92% on ML Quiz</h4><p>3 days ago</p></div>
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div className="panel" style={{ marginBottom: '32px' }}>
        <div className="panel-header">
          <h3>Certificates</h3>
          <Link href="#">View All</Link>
        </div>
        <div className="cert-card">
          <div className="cert-icon">🎖️</div>
          <div className="cert-info"><h4>Python Programming Fundamentals</h4><p>Completed on May 2, 2026</p></div>
          <span className="cert-badge">Verified</span>
        </div>
        <div className="cert-card">
          <div className="cert-icon">🏆</div>
          <div className="cert-info"><h4>HTML & CSS Mastery</h4><p>Completed on April 18, 2026</p></div>
          <span className="cert-badge">Verified</span>
        </div>
        <div className="cert-card">
          <div className="cert-icon">🥇</div>
          <div className="cert-info"><h4>Git & GitHub Essentials</h4><p>Completed on March 10, 2026</p></div>
          <span className="cert-badge">Verified</span>
        </div>
      </div>
    </>
  );
}
