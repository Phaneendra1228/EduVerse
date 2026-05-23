"use client";
import React, { useState } from 'react';
import { meetingsData } from '@/lib/data';
import MeetingCard from '@/components/MeetingCard';

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState('All Events');

  const tabs = ['All Events', 'Workshops', 'Seminars', 'Conferences', 'Webinars', 'Sessions', 'Programs'];

  const filteredMeetings = activeTab === 'All Events' 
    ? meetingsData 
    : meetingsData.filter(m => m.cat === activeTab);

  return (
    <div className="page active" id="page-meetings">
      <div className="page-header" style={{ backgroundImage: "url('/images/meeting-banner.png')" }}>
        <div className="container">
          <h1>Meetings & Events</h1>
          <p>Connect, collaborate, and grow through our curated live sessions and workshops.</p>
        </div>
      </div>
      <section className="section section-dark">
        <div className="container">
          <div className="meetings-tabs">
            {tabs.map(tab => (
              <button 
                key={tab}
                className={`meeting-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="meetings-grid">
            {filteredMeetings.map(meeting => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
