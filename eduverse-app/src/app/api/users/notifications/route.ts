import { NextResponse } from 'next/server';

export async function GET() {
  const notifications = [
    {
      id: "notif-1",
      type: "course_update",
      title: "New Course Published!",
      message: "Admin just published 'Mastering AI Development'. Check it out now!",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
      link: "/courses/mastering-ai"
    },
    {
      id: "notif-2",
      type: "qa_reply",
      title: "New Reply in Q&A",
      message: "An instructor replied to your question about React Hooks.",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      link: "/courses"
    },
    {
      id: "notif-3",
      type: "system",
      title: "Welcome to EduVerse",
      message: "Thanks for joining! Set up your profile to get started.",
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      link: "/profile"
    }
  ];

  return NextResponse.json({ notifications });
}
