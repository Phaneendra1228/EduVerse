import React from 'react';
import Link from 'next/link';

interface MeetingProps {
  meeting: {
    id: number;
    title: string;
    desc: string;
    month: string;
    day: string;
    price: string;
    cat: string;
    img: string;
  };
}

export default function MeetingCard({ meeting }: MeetingProps) {
  return (
    <Link href={`/meetings/${meeting.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="meeting-card" data-cat={meeting.cat} style={{ cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
        <div className="meeting-card-img">
          <img src={meeting.img} alt={meeting.title} loading="lazy" />
          <span className="meeting-card-price">{String(meeting.price).replace(/[^0-9.]/g, '') === '0' || meeting.price === 'Free' ? 'Free' : `₹${String(meeting.price).replace(/[^0-9.]/g, '')}`}</span>
        </div>
        <div className="meeting-card-body">
          <div className="meeting-card-date">
            <div>
              <span className="month">{meeting.month}</span>
              <div className="day">{meeting.day}</div>
            </div>
            <div>
              <h3>{meeting.title}</h3>
              <p>{meeting.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
