import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist for security reasons (standard practice)
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
    }

    // For this demo, we'll actually reset the password to a standard one
    user.password = 'password123';
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "For this demo environment, your password has been instantly reset to: password123",
      demoPassword: "password123"
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
