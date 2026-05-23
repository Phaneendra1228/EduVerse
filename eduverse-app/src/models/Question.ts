import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReply {
  user: {
    name: string;
    email: string;
  };
  content: string;
  createdAt: Date;
}

export interface IQuestion extends Document {
  courseId: string;
  user: {
    name: string;
    email: string;
  };
  title: string;
  content: string;
  replies: IReply[];
  createdAt: Date;
}

const ReplySchema = new Schema<IReply>({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const QuestionSchema = new Schema<IQuestion>({
  courseId: { type: String, required: true, index: true },
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now },
});

export const Question: Model<IQuestion> = mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
