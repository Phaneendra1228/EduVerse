import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  attendees: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
