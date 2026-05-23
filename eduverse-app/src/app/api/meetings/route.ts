import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Meeting } from '@/models/Meeting';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const meeting = await Meeting.create(body);
    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error('Failed to create meeting:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}
