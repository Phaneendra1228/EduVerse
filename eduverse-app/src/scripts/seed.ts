import mongoose from 'mongoose';
import { Course } from '../models/Course';
import { User } from '../models/User';
import { coursesData } from '../lib/data';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduverse';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Seed Courses
    const coursesToInsert = coursesData.map(c => ({
      title: c.title,
      description: c.desc,
      tag: c.tag,
      price: parseInt(c.price.replace('$', '')),
      rating: c.rating,
      reviews: c.reviews,
      hours: c.hours,
      instructorName: c.instructor,
      instructorRole: c.role,
      instructorInitials: c.initials,
      image: c.img,
    }));

    await Course.insertMany(coursesToInsert);
    console.log(`Successfully seeded ${coursesToInsert.length} courses!`);

    // Ensure Admin User Exists
    const adminEmail = 'admin@eduverse.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'admin@123', // Updated to admin@123
        role: 'admin'
      });
      console.log('Created default admin user (admin@eduverse.com)');
    } else {
      console.log('Admin user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
