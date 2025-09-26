import React, { useState, useEffect } from 'react';
import AssessmentList from './learner/AssessmentList';
import AssessmentInstructions from './learner/AssessmentInstructions';
import TakeAssessment from './learner/TakeAssessment';
import AssessmentResult from './learner/AssessmentResult';
import CertificateGeneration from './learner/CertificateGeneration';
import './LearnerDashboard.css';

const LearnerDashboard = () => {
  const [user] = useState({ 
    name: 'John Student',
    id: 'student_123',
    enrolledCourses: [
      { id: 1, name: 'React Development Bootcamp' },
      { id: 2, name: 'Node.js Backend Development' },
      { id: 3, name: 'JavaScript Fundamentals' }
    ]
  });

  const [currentView, setCurrentView] = useState('list');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [attemptData, setAttemptData] = useState(null);

  // Mock assessments data
  const [assessments] = useState([
    {
      id: 1,
      courseId: 1,
      courseName: 'React Development Bootcamp',
      title: 'Final Exam – React Fundamentals',
      duration: 60,
      totalMarks: 100,
      passingMarks: 40,
      attemptsAllowed: 2,
      attemptsUsed: 0,
      status: 'not_started',
      instructions: 'Do not refresh or close the tab once started. Make sure you have a stable internet connection.',
      questions: [
        {
          id: 1,
          type: 'MCQ',
          text: 'Which method is used to create components in React?',
          options: ['React.createComponent()', 'React.createElement()', 'createReactComponent()', 'React.component()'],
          correctAnswer: 1,
          marks: 10
        },
        {
          id: 2,
          type: 'MCQ',
          text: 'What is JSX?',
          options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'JSON XML'],
          correctAnswer: 0,
          marks: 10
        },
        {
          id: 3,
          type: 'MCQ',
          text: 'Which hook is used for state management in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correctAnswer: 1,
          marks: 10
        }
      ]
    },
    {
      id: 2,
      courseId: 2,
      courseName: 'Node.js Backend Development',
      title: 'Node.js Fundamentals Assessment',
      duration: 45,
      totalMarks: 50,
      passingMarks: 25,
      attemptsAllowed: 1,
      attemptsUsed: 1,
      status: 'completed',
      score: 45,
      passed: true,
      instructions: 'Focus on core Node.js concepts and best practices.',
      questions: [
        {
          id: 4,
          type: 'MCQ',
          text: 'What is Node.js?',
          options: ['A web browser', 'A JavaScript runtime', 'A database', 'A CSS framework'],
          correctAnswer: 1,
          marks: 10
        }
      ]
    },
    {
      id: 3,
      courseId: 1,
      courseName: 'React Development Bootcamp',
      title: 'React Hooks Deep Dive',
      duration: 30,
      totalMarks: 60,
      passingMarks: 30,
      attemptsAllowed: 3,
      attemptsUsed: 1,
      status: 'in_progress',
      instructions: 'This assessment covers advanced React hooks concepts.',
      questions: [
        {
          id: 5,
          type: 'MCQ',
          text: 'Which hook is used for side effects?',
          options: ['useState', 'useEffect', 'useContext', 'useMemo'],
          correctAnswer: 1,
          marks: 20
        }
      ]
    }
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleStartAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentView('instructions');
  };

  const handleBeginAssessment = () => {
    setCurrentView('taking');
  };

  const handleCompleteAssessment = (result) => {
    setAssessmentResult(result);
    setCurrentView('result');
  };

  const handleGenerateCertificate = (result) => {
    setAssessmentResult(result);
    setCurrentView('certificate');
  };

  const handleReturnToList = () => {
    setCurrentView('list');
    setSelectedAssessment(null);
    setAssessmentResult(null);
    setAttemptData(null);
  };

  const handleRetakeAssessment = () => {
    setCurrentView('instructions');
    setAssessmentResult(null);
  };

  return (
    <div className="learner-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {getGreeting()}, {user?.name}! 📚
          </h1>
          <p className="dashboard-subtitle">
            Ready to test your knowledge? Take your assessments and track your progress.
          </p>
        </div>

        {/* Content based on current view */}
        {currentView === 'list' && (
          <AssessmentList 
            assessments={assessments}
            user={user}
            onStartAssessment={handleStartAssessment}
          />
        )}

        {currentView === 'instructions' && selectedAssessment && (
          <AssessmentInstructions 
            assessment={selectedAssessment}
            onBeginAssessment={handleBeginAssessment}
            onBack={handleReturnToList}
          />
        )}

        {currentView === 'taking' && selectedAssessment && (
          <TakeAssessment 
            assessment={selectedAssessment}
            onComplete={handleCompleteAssessment}
            onBack={handleReturnToList}
          />
        )}

        {currentView === 'result' && assessmentResult && (
          <AssessmentResult 
            result={assessmentResult}
            assessment={selectedAssessment}
            onReturnToList={handleReturnToList}
            onRetake={handleRetakeAssessment}
            onGenerateCertificate={handleGenerateCertificate}
          />
        )}

        {currentView === 'certificate' && assessmentResult && (
          <CertificateGeneration 
            result={assessmentResult}
            assessment={selectedAssessment}
            user={user}
            onReturnToList={handleReturnToList}
          />
        )}
      </div>
    </div>
  );
};

export default LearnerDashboard;