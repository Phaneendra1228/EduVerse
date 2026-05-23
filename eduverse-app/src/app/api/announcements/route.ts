import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Announcement } from '@/models/Announcement';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const announcement = await Announcement.create(body);
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error('Failed to create announcement:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
