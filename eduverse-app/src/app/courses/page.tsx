"use client";
import React, { useState } from 'react';
import { coursesData } from '@/lib/data';
import CourseCard from '@/components/CourseCard';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
        setLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.tag.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page active" id="page-courses">
      <div className="page-header" style={{ backgroundImage: "url('/images/course-webdev.png')" }}>
        <div className="container">
          <h1>Our Courses</h1>
          <p>Explore our comprehensive catalog of industry-leading courses.</p>
        </div>
      </div>
      <section className="section section-light">
        <div className="container">
          <div className="courses-search">
            <i className="fas fa-search search-icon"></i>
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <CourseCard key={course._id || course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
