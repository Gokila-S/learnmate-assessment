import React, { useState } from 'react';
import AssessmentDashboard from './components/AssessmentDashboard';
import AssessmentList from './components/learner/AssessmentList';
import AssessmentInstructions from './components/learner/AssessmentInstructions';
import TakeAssessment from './components/learner/TakeAssessment';
import AssessmentResult from './components/learner/AssessmentResult';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('admin'); // 'admin' | 'student'
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentPage, setCurrentPage] = useState('list'); // 'list' | 'instructions' | 'take' | 'result'
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Mock user data
  const [user] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student'
  });

  // Mock assessments data
  const [assessments] = useState([
    {
      id: 1,
      title: 'Final Exam – Web Development',
      courseName: 'React Development Bootcamp',
      duration: 60,
      totalMarks: 10,
      passingMarks: 5,
      attemptsAllowed: 2,
      attemptsUsed: 0,
      status: 'not_started',
      description: 'Comprehensive assessment covering React fundamentals, hooks, and component lifecycle.',
      instructions: 'This is a comprehensive test of your React knowledge. Please read each question carefully and select the best answer. You have 60 minutes to complete all questions. Once you start, you cannot pause the assessment. Good luck!',
      questions: [
        {
          id: 1,
          text: 'What is React?',
          type: 'MCQ',
          options: ['A library', 'A framework', 'A language', 'A database'],
          correctAnswer: 0,
          marks: 5
        },
        {
          id: 2,
          text: 'Which hook is used for state management in functional components?',
          type: 'MCQ',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correctAnswer: 1,
          marks: 5
        }
      ]
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals Quiz',
      courseName: 'JavaScript Fundamentals',
      duration: 45,
      totalMarks: 10,
      passingMarks: 5,
      attemptsAllowed: 3,
      attemptsUsed: 1,
      status: 'in_progress',
      description: 'Test your knowledge of JavaScript basics, ES6 features, and DOM manipulation.',
      lastScore: 6
    }
  ]);

  const handleViewChange = (view) => {
    setCurrentView(view);
    setCurrentPage('list');
    setSelectedAssessment(null);
  };

  const handleStartAssessment = (assessmentId) => {
    const assessment = assessments.find(a => a.id === assessmentId);
    setSelectedAssessment(assessment);
    setCurrentPage('instructions');
  };

  const handleBeginAssessment = () => {
    setCurrentPage('take');
  };

  const handleSubmitAssessment = (result) => {
    // Store the assessment result
    console.log('Assessment completed:', result);
    setAssessmentResult(result);
    setCurrentPage('result');
  };

  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedAssessment(null);
    setAssessmentResult(null);
  };

  const renderNavigation = () => (
    <div className="app-navigation">
      <div className="nav-header">
        <h2>🎓 LearnMate Assessment System</h2>
      </div>
      <div className="nav-buttons">
        <button 
          className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
          onClick={() => handleViewChange('admin')}
        >
          👨‍💼 Admin Panel
        </button>
        <button 
          className={`nav-btn ${currentView === 'student' ? 'active' : ''}`}
          onClick={() => handleViewChange('student')}
        >
          👨‍🎓 Student Portal
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (currentView === 'admin') {
      return <AssessmentDashboard />;
    }

    // Student views
    switch (currentPage) {
      case 'instructions':
        return (
          <AssessmentInstructions
            assessment={selectedAssessment}
            user={user}
            onBeginAssessment={handleBeginAssessment}
            onBack={handleBackToList}
          />
        );
      case 'take':
        return (
          <TakeAssessment
            assessment={selectedAssessment}
            user={user}
            onComplete={handleSubmitAssessment}
            onBack={handleBackToList}
          />
        );
      case 'result':
        return (
          <AssessmentResult
            result={assessmentResult}
            assessment={selectedAssessment}
            user={user}
            onReturnToList={handleBackToList}
          />
        );
      default:
        return (
          <AssessmentList
            assessments={assessments}
            user={user}
            onStartAssessment={handleStartAssessment}
          />
        );
    }
  };

  return (
    <div className="app">
      {renderNavigation()}
      <div className="dashboard-container">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;