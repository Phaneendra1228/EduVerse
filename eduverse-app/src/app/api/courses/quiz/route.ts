import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  // We serve a dynamic, generic 3-question quiz for the course
  // In a real production app, this would query a Quiz database model
  const quiz = {
    title: "Final Course Assessment",
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of the technologies taught in this course?",
        options: [
          "To build scalable, modern applications",
          "To repair hardware components",
          "To write low-level assembly code",
          "To design 3D animations"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Which of the following is considered a best practice when writing code for this stack?",
        options: [
          "Putting all logic into a single massive file",
          "Using descriptive variable names and modular components",
          "Ignoring errors and warnings",
          "Hardcoding API keys into the frontend"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "How do you deploy the final application to a production environment?",
        options: [
          "Copying files manually via USB drive",
          "Printing the code and faxing it to a server",
          "Using a CI/CD pipeline and cloud hosting (e.g. Vercel, AWS)",
          "Leaving it on localhost permanently"
        ],
        correctAnswer: 2
      }
    ]
  };

  return NextResponse.json(quiz);
}
