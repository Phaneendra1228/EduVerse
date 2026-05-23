import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiscussion extends Document {
  title: string;
  preview: string;
  author: string;
  avatar: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: Date;
}

const DiscussionSchema: Schema<IDiscussion> = new Schema({
  title: { type: String, required: true },
  preview: { type: String, required: true },
  author: { type: String, required: true },
  avatar: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Prevent model recompilation error in Next.js
export const Discussion: Model<IDiscussion> = mongoose.models.Discussion || mongoose.model<IDiscussion>('Discussion', DiscussionSchema);
