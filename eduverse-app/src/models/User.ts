import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  bio?: string;
  phone?: string;
  role: 'student' | 'mentor' | 'admin';
  enrolledCourses: mongoose.Types.ObjectId[];
  courseProgress: Map<string, number>;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  courseProgress: { type: Map, of: Number, default: {} },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model recompilation error in Next.js
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
