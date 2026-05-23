import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, progressIncrement } = await req.json();
    if (!courseId || typeof progressIncrement !== 'number') {
      return NextResponse.json({ error: 'Valid courseId and progressIncrement are required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize map if it doesn't exist
    if (!user.courseProgress) {
      user.courseProgress = new Map();
    }

    // Calculate new progress safely
    const currentProgress = user.courseProgress.get(courseId) || 0;
    const newProgress = Math.min(100, currentProgress + progressIncrement); // Cap at 100%
    
    // Update and save
    user.courseProgress.set(courseId, newProgress);
    await user.save();

    return NextResponse.json({ 
      message: 'Progress updated successfully', 
      courseId,
      newProgress 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
