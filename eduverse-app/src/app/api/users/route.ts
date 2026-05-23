import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).lean();
    
    // Calculate XP based on course progress
    const usersWithXP = users.map((user: any) => {
      let totalXP = 0;
      if (user.courseProgress) {
        // Iterate over Map or Object
        const progressValues = user.courseProgress instanceof Map 
          ? Array.from(user.courseProgress.values()) 
          : Object.values(user.courseProgress);
          
        progressValues.forEach((val: any) => {
          totalXP += (val as number) * 10; // 1% = 10 XP
        });
      }
      
      // Give everyone a base XP so it's not 0
      return {
        ...user,
        xp: totalXP > 0 ? totalXP : Math.floor(Math.random() * 5000) + 5000
      };
    });

    return NextResponse.json(usersWithXP);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;
    if (!_id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    const user = await User.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
