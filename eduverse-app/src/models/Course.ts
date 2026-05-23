import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  tag: string;
  price: number;
  rating: number;
  reviews: number;
  hours: number;
  instructorName: string;
  instructorRole: string;
  instructorInitials: string;
  image: string;
  videoId?: string;
  createdAt: Date;
}

const CourseSchema: Schema<ICourse> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  hours: { type: Number, required: true },
  instructorName: { type: String, required: true },
  instructorRole: { type: String, required: true },
  instructorInitials: { type: String, required: true },
  image: { type: String, required: true },
  videoId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
