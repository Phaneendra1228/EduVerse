import { NextResponse } from 'next/server';

export async function GET() {
  // Simulated analytics data for the Admin Revenue Dashboard
  const monthlyRevenue = [
    { month: 'Jan', revenue: 4200, enrollments: 85 },
    { month: 'Feb', revenue: 5800, enrollments: 112 },
    { month: 'Mar', revenue: 7100, enrollments: 143 },
    { month: 'Apr', revenue: 6500, enrollments: 128 },
    { month: 'May', revenue: 9200, enrollments: 195 },
    { month: 'Jun', revenue: 8700, enrollments: 172 },
    { month: 'Jul', revenue: 10500, enrollments: 210 },
    { month: 'Aug', revenue: 11200, enrollments: 238 },
    { month: 'Sep', revenue: 9800, enrollments: 201 },
    { month: 'Oct', revenue: 12400, enrollments: 265 },
    { month: 'Nov', revenue: 13100, enrollments: 280 },
    { month: 'Dec', revenue: 14800, enrollments: 312 },
  ];

  const topCourses = [
    { name: 'Full-Stack Web Development', revenue: 18500, students: 420, rating: 4.9 },
    { name: 'AI & Machine Learning', revenue: 15200, students: 380, rating: 4.8 },
    { name: 'UI/UX Design Masterclass', revenue: 12800, students: 310, rating: 4.7 },
    { name: 'Cybersecurity Fundamentals', revenue: 9600, students: 245, rating: 4.6 },
    { name: 'Cloud & DevOps Engineering', revenue: 8400, students: 198, rating: 4.5 },
  ];

  const categoryBreakdown = [
    { name: 'Web Development', value: 35 },
    { name: 'Data Science', value: 25 },
    { name: 'Design', value: 18 },
    { name: 'Business', value: 12 },
    { name: 'Marketing', value: 10 },
  ];

  const kpis = {
    totalRevenue: 113300,
    totalStudents: 2341,
    totalCourses: 24,
    avgRating: 4.7,
    revenueGrowth: 18.4,
    studentGrowth: 22.1,
  };

  return NextResponse.json({
    monthlyRevenue,
    topCourses,
    categoryBreakdown,
    kpis,
  });
}
