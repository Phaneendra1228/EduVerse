import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Discussion } from '@/models/Discussion';

export async function GET() {
  try {
    await dbConnect();
    // Sort by createdAt descending (newest first)
    const discussions = await Discussion.find({}).sort({ createdAt: -1 });
    return NextResponse.json(discussions);
  } catch (error) {
    console.error('Failed to fetch discussions:', error);
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Basic validation
    if (!body.title || !body.preview || !body.author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newDiscussion = await Discussion.create({
      title: body.title,
      preview: body.preview,
      author: body.author,
      avatar: body.author.charAt(0).toUpperCase(), // Extract first letter for avatar
      tags: body.tags || [],
      likes: 0,
      comments: 0
    });

    return NextResponse.json(newDiscussion, { status: 201 });
  } catch (error) {
    console.error('Failed to create discussion:', error);
    return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, action } = body;
    
    if (!_id || !action) {
      return NextResponse.json({ error: 'Missing ID or action' }, { status: 400 });
    }

    let updateQuery = {};
    if (action === 'upvote') {
      updateQuery = { $inc: { likes: 1 } };
    }

    const updated = await Discussion.findByIdAndUpdate(_id, updateQuery, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update discussion:', error);
    return NextResponse.json({ error: 'Failed to update discussion' }, { status: 500 });
  }
}
