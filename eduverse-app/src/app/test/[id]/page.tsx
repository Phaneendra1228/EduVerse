"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import './test.css';

// Dynamic Question Generator Helper
const generateQuestionsForCourse = (courseTag: string = '', courseTitle: string = '') => {
  const tag = courseTag.toLowerCase();
  const title = courseTitle.toLowerCase();

  if (tag.includes('web') || title.includes('web') || title.includes('react') || title.includes('full-stack')) {
    return [
      { question: "Which HTML tag is used to define an internal style sheet?", options: ["<css>", "<script>", "<style>", "<link>"], correctAnswer: 2 },
      { question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correctAnswer: 1 },
      { question: "In React, how do you pass data from a parent component to a child component?", options: ["Using state", "Using props", "Using context", "Using Redux"], correctAnswer: 1 },
      { question: "Which of the following is NOT a JavaScript data type?", options: ["String", "Boolean", "Float", "Undefined"], correctAnswer: 2 },
      { question: "What does the 'M' in MERN stack stand for?", options: ["MySQL", "MongoDB", "Mongoose", "MariaDB"], correctAnswer: 1 },
      { question: "Which CSS property is used to control the space outside an element's border?", options: ["padding", "spacing", "margin", "border-spacing"], correctAnswer: 2 },
      { question: "What is the purpose of the useState hook in React?", options: ["To fetch data from APIs", "To handle routing", "To manage state in functional components", "To manipulate the DOM directly"], correctAnswer: 2 },
      { question: "How do you create a function in JavaScript?", options: ["function myFunction()", "function = myFunction()", "create myFunction()", "def myFunction()"], correctAnswer: 0 },
      { question: "Which HTML element is used for the largest heading?", options: ["<heading>", "<h1>", "<head>", "<h6>"], correctAnswer: 1 },
      { question: "What does API stand for?", options: ["Automated Programming Interface", "Application Programming Interface", "Advanced Protocol Integration", "Application Protocol Interface"], correctAnswer: 1 }
    ];
  }

  if (tag.includes('data') || title.includes('python') || title.includes('ai') || title.includes('machine')) {
    return [
      { question: "Which of the following is a core Python library for data manipulation?", options: ["React", "Django", "Pandas", "Flask"], correctAnswer: 2 },
      { question: "What does 'ML' stand for in computer science?", options: ["Maximum Logic", "Machine Learning", "Micro Layouts", "Matrix Loading"], correctAnswer: 1 },
      { question: "Which function is used to output text to the console in Python?", options: ["console.log()", "print()", "echo()", "system.out.println()"], correctAnswer: 1 },
      { question: "What is a tuple in Python?", options: ["A mutable array", "A dictionary of key-value pairs", "An immutable sequence of elements", "A type of loop"], correctAnswer: 2 },
      { question: "Which of the following is used to train a neural network?", options: ["Bootstrap", "Backpropagation", "Binary Search", "Breadth-First Search"], correctAnswer: 1 },
      { question: "What does 'SQL' stand for?", options: ["Structured Query Language", "Standard Query Logic", "System Query Link", "Simple Question Language"], correctAnswer: 0 },
      { question: "Which keyword is used to define a function in Python?", options: ["function", "def", "func", "define"], correctAnswer: 1 },
      { question: "What is the primary purpose of a database index?", options: ["To secure data", "To speed up data retrieval", "To format tables", "To backup data"], correctAnswer: 1 },
      { question: "In machine learning, what is overfitting?", options: ["When a model learns the training data too well, failing to generalize", "When a model is too simple", "When training takes too long", "When a dataset has too many rows"], correctAnswer: 0 },
      { question: "What is a 'DataFrame' in Pandas?", options: ["A 1D array", "A 2-dimensional labeled data structure", "A 3D tensor", "A database connection object"], correctAnswer: 1 }
    ];
  }

  // Generic Questions Fallback
  return [
    { question: "Which of the following represents a boolean value?", options: ["'true'", "1", "true", "0.5"], correctAnswer: 2 },
    { question: "What is the primary purpose of version control systems like Git?", options: ["To compile code automatically", "To track changes in source code during development", "To write better algorithms", "To deploy applications to the cloud"], correctAnswer: 1 },
    { question: "What is a 'bug' in software development?", options: ["An insect inside the computer case", "A feature requested by the client", "An error, flaw, or fault in the code", "A high-performance algorithm"], correctAnswer: 2 },
    { question: "Which protocol is primarily used to transmit web pages?", options: ["FTP", "SMTP", "HTTP", "SSH"], correctAnswer: 2 },
    { question: "What does 'GUI' stand for?", options: ["General User Integration", "Graphical User Interface", "Global Universal Identifier", "Graphical Unit Interface"], correctAnswer: 1 },
    { question: "Which of the following is an example of an operating system?", options: ["Microsoft Word", "Google Chrome", "Linux", "Python"], correctAnswer: 2 },
    { question: "What is an algorithm?", options: ["A physical computer component", "A programming language", "A step-by-step set of instructions to solve a problem", "A type of database"], correctAnswer: 2 },
    { question: "What does 'IDE' stand for?", options: ["Integrated Development Environment", "Internal Design Engine", "Interactive Data Explorer", "Internet Deployment Enterprise"], correctAnswer: 0 },
    { question: "Which symbol is typically used for single-line comments in many C-style languages?", options: ["<!--", "/*", "//", "#"], correctAnswer: 2 },
    { question: "What is a variable in programming?", options: ["A mathematical equation", "A named container for storing data values", "A type of error", "A compiled program file"], correctAnswer: 1 }
  ];
};

export default function QuizInterface() {
  const params = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Timer State (3 minutes total)
  const [timeLeft, setTimeLeft] = useState(180);

  // Timer Effect
  useEffect(() => {
    if (isFinished || loading || !questions.length) return;

    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, loading, questions.length]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const courseId = params.id as string;
          const found = data.find(c => c._id === courseId || c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === courseId);
          setCourse(found);
          
          if (found) {
            setQuestions(generateQuestionsForCourse(found.tag, found.title));
          } else {
            setQuestions(generateQuestionsForCourse());
          }
        }
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Loading Test Environment...</h2></div>;
  }

  if (!questions.length) return null;

  const handleNext = () => {
    if (selectedOption === null) return;

    // Check answer
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const getLetter = (index: number) => String.fromCharCode(65 + index);
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const finalScore = Math.round((score / questions.length) * 100);
  const passed = finalScore >= 60;

  // Background Progress Update
  useEffect(() => {
    if (isFinished && course) {
      // Award 100% progress if they passed, 50% if they failed but completed it
      const progressToAward = passed ? 100 : 50;
      
      fetch('/api/users/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          courseId: course._id || params.id, 
          progressIncrement: progressToAward 
        })
      }).catch(err => console.error("Failed to update progress:", err));
    }
  }, [isFinished, course, passed, params.id]);

  if (isFinished) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1 className="quiz-title">Test Results</h1>
          <p className="quiz-subtitle">{course ? course.title : 'Course Assessment'}</p>
        </div>
        
        <div className="quiz-card results-screen">
          <div className={`score-circle ${passed ? 'pass' : 'fail'}`}>
            {finalScore}%
          </div>
          <h2 className="results-title">{passed ? 'Congratulations!' : 'Keep Practicing'}</h2>
          <p className="results-desc">
            {passed 
              ? `You successfully passed the assessment by scoring ${score} out of ${questions.length} correctly.`
              : `You scored ${score} out of ${questions.length}. Review the course materials and try again.`}
          </p>
          
          <div className="results-actions">
            {passed && (
              <button className="btn-return" onClick={() => router.push(course ? `/certificate/${course._id || params.id}` : '/dashboard')} style={{ background: 'var(--gold)', color: '#1a1a2e' }}>
                <i className="fas fa-award"></i> Claim Certificate
              </button>
            )}
            <button className="btn-return" onClick={() => router.push(course ? `/courses/${course._id || params.id}` : '/courses')}>
              Return to Course
            </button>
            <button className="btn-next" onClick={() => router.push('/dashboard')}>
              Go to Dashboard <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1 className="quiz-title">{course ? course.title : 'Course Assessment'}</h1>
        <p className="quiz-subtitle">Module Assessment Test</p>
      </div>

      <div className="quiz-card">
        <div className="quiz-progress-bar" style={{ width: `${progressPercent}%` }}></div>
        
        <div className="question-meta">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span style={{ color: timeLeft < 30 ? '#ff6b6b' : '#a0aec0', fontSize: '1rem', fontWeight: 700, transition: 'color 0.3s' }}>
            <i className="fas fa-clock"></i> {formatTime(timeLeft)}
          </span>
        </div>

        <h2 className="question-text">{currentQuestion.question}</h2>

        <div className="options-grid">
          {currentQuestion.options.map((option: string, index: number) => (
            <button 
              key={index} 
              className={`option-btn ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => setSelectedOption(index)}
            >
              <span className="option-letter">{getLetter(index)}</span>
              <span style={{ flex: 1 }}>{option}</span>
            </button>
          ))}
        </div>

        <div className="quiz-footer">
          <button 
            className="btn-next" 
            onClick={handleNext}
            disabled={selectedOption === null}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Next Question'}
            {currentQuestionIndex !== questions.length - 1 && <i className="fas fa-arrow-right"></i>}
          </button>
        </div>
      </div>
    </div>
  );
}
