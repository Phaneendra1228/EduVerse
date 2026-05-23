import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import { Question } from '@/models/Question';

// Fetch all questions for a specific course
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    await connectDB();
    
    // Fetch questions, sort by newest first
    const questions = await Question.find({ courseId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Fetch QA error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Post a new question
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, title, content } = await req.json();

    if (!courseId || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const newQuestion = await Question.create({
      courseId,
      user: {
        name: session.user.name || 'Anonymous Student',
        email: session.user.email
      },
      title,
      content,
      replies: []
    });

    return NextResponse.json({ message: 'Question posted successfully', question: newQuestion }, { status: 201 });
  } catch (error) {
    console.error('Post QA error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
