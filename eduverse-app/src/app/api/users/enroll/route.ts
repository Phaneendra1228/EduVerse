import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import { User } from '@/models/User';
import { Course } from '@/models/Course';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Add course to user's enrolledCourses if not already there
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      
      // Initialize progress for this course to 0
      if (!user.courseProgress) {
        user.courseProgress = new Map();
      }
      user.courseProgress.set(courseId.toString(), 0);
      
      await user.save();
    }

    return NextResponse.json({ 
      message: 'Successfully enrolled', 
      enrolledCourses: user.enrolledCourses,
      courseProgress: user.courseProgress 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).populate('enrolledCourses');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      enrolledCourses: user.enrolledCourses,
      courseProgress: user.courseProgress || {}
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch enrollment error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
