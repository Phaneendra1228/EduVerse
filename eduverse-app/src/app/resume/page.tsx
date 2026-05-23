"use client";
import React, { useState } from 'react';

export default function ResumePage() {
  const [resumeData, setResumeData] = useState({
    name: '', phone: '', email: '', linkedin: '', degree: '', college: '', year: '', skills: '', exp: '', objective: ''
  });
  const [isFlashing, setIsFlashing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const generateResume = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 1500);
  };

  return (
    <div className="page active" id="page-resume">
      <div className="page-header" style={{ backgroundImage: "url('/images/meeting-banner.png')" }}>
        <div className="container">
          <h1>Resume Builder</h1>
          <p>Create a professional resume with our intelligent form builder.</p>
        </div>
      </div>
      <section className="section section-light">
        <div className="container">
          <div className="resume-builder">
            <div className="resume-form">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="Your full name" value={resumeData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Mobile Number</label>
                <input type="tel" id="phone" name="phone" placeholder="e.g. +91 98765 43210" value={resumeData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="your.email@gmail.com" value={resumeData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn URL</label>
                <input type="url" id="linkedin" name="linkedin" placeholder="https://linkedin.com/in/yourprofile" value={resumeData.linkedin} onChange={handleChange} />
              </div>
              
              <h3 style={{ marginTop: "32px" }}>Education</h3>
              <div className="form-group">
                <label htmlFor="degree">Degree</label>
                <input type="text" id="degree" name="degree" placeholder="e.g. B.Tech Computer Science" value={resumeData.degree} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="college">College/University</label>
                <input type="text" id="college" name="college" placeholder="e.g. KL University" value={resumeData.college} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="year">Graduation Year</label>
                <input type="text" id="year" name="year" placeholder="e.g. 2026" value={resumeData.year} onChange={handleChange} />
              </div>
              
              <h3 style={{ marginTop: "32px" }}>Skills & Experience</h3>
              <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <input type="text" id="skills" name="skills" placeholder="e.g. Python, React, Machine Learning" value={resumeData.skills} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="exp">Experience / Projects</label>
                <textarea id="exp" name="exp" placeholder="Describe your key projects and experience..." value={resumeData.exp} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="objective">Career Objective</label>
                <textarea id="objective" name="objective" placeholder="Write a brief career objective..." value={resumeData.objective} onChange={handleChange}></textarea>
              </div>
              <button className="btn btn-primary" onClick={generateResume} style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                Generate Resume <i className="fas fa-file-alt"></i>
              </button>
            </div>
            
            <div className="resume-preview" style={isFlashing ? { boxShadow: "0 0 40px rgba(108,92,231,0.4)" } : {}}>
              <h3>{resumeData.name || 'Your Name'}</h3>
              <p className="preview-subtitle">
                {resumeData.email || 'Email'} • {resumeData.phone || 'Phone'} • {resumeData.linkedin || 'LinkedIn'}
              </p>
              <div className="resume-preview-section">
                <h4>Objective</h4>
                <p>{resumeData.objective || 'Your career objective will appear here...'}</p>
              </div>
              <div className="resume-preview-section">
                <h4>Education</h4>
                <p>
                  {(resumeData.degree || resumeData.college) 
                    ? `${resumeData.degree} — ${resumeData.college} (${resumeData.year})` 
                    : 'Your education details will appear here...'}
                </p>
              </div>
              <div className="resume-preview-section">
                <h4>Skills</h4>
                <p>{resumeData.skills || 'Your skills will appear here...'}</p>
              </div>
              <div className="resume-preview-section">
                <h4>Experience & Projects</h4>
                <p>{resumeData.exp || 'Your experience will appear here...'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
