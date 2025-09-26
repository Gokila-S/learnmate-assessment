# Assessment System Integration Guide

## Overview
This guide shows how to integrate the LearnMate Assessment System into your existing React project that runs with `npm run dev`.

## Option 1: Copy Components Integration (Recommended)

### Step 1: Install Dependencies
In your existing project, install these required dependencies:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-hook-form uuid
```

### Step 2: Copy Assessment Files
Copy these files from this project to your existing project:

```
src/components/learner/
├── AssessmentList.js
├── AssessmentList.css
├── AssessmentInstructions.js
├── AssessmentInstructions.css
├── TakeAssessment.js
├── TakeAssessment.css
├── AssessmentResult.js
└── AssessmentResult.css
```

Optionally, if you want assessment creation functionality:
```
src/components/
├── AssessmentCreationForm.js
├── AssessmentCreationForm.css
├── AssessmentDashboard.js
├── AssessmentDashboard.css
├── LearnerDashboard.js
├── LearnerDashboard.css
├── QuestionBuilder.js
└── QuestionBuilder.css
```

### Step 3: Create Assessment Integration Component

Create `src/components/AssessmentSystem.js` in your existing project:

```javascript
import React, { useState } from 'react';
import AssessmentList from './learner/AssessmentList';
import AssessmentInstructions from './learner/AssessmentInstructions';
import TakeAssessment from './learner/TakeAssessment';
import AssessmentResult from './learner/AssessmentResult';

const AssessmentSystem = ({ user, onClose }) => {
  const [currentPage, setCurrentPage] = useState('list');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Mock assessments data - replace with your actual data source
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
    }
  ]);

  const handleStartAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentPage('instructions');
  };

  const handleBeginAssessment = () => {
    setCurrentPage('taking');
  };

  const handleSubmitAssessment = (result) => {
    // Calculate result
    const totalScore = result.reduce((sum, answer) => {
      const question = selectedAssessment.questions.find(q => q.id === answer.questionId);
      return sum + (answer.selectedOption === question.correctAnswer ? question.marks : 0);
    }, 0);

    const assessmentResult = {
      assessmentId: selectedAssessment.id,
      assessmentTitle: selectedAssessment.title,
      courseName: selectedAssessment.courseName,
      score: totalScore,
      totalMarks: selectedAssessment.totalMarks,
      percentage: ((totalScore / selectedAssessment.totalMarks) * 100).toFixed(1),
      passed: totalScore >= selectedAssessment.passingMarks,
      submittedAt: new Date().toISOString(),
      answers: result
    };

    setAssessmentResult(assessmentResult);
    setCurrentPage('result');
  };

  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedAssessment(null);
    setAssessmentResult(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'list':
        return (
          <AssessmentList
            assessments={assessments}
            user={user}
            onStartAssessment={handleStartAssessment}
            onClose={onClose}
          />
        );
      case 'instructions':
        return (
          <AssessmentInstructions
            assessment={selectedAssessment}
            user={user}
            onBegin={handleBeginAssessment}
            onBack={handleBackToList}
          />
        );
      case 'taking':
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
        return null;
    }
  };

  return (
    <div className="assessment-system">
      <div className="assessment-header">
        <h1>Assessment System</h1>
        <button onClick={onClose} className="close-btn">× Close</button>
      </div>
      {renderCurrentPage()}
    </div>
  );
};

export default AssessmentSystem;
```

### Step 4: Integrate into Your Main App

In your existing app component (e.g., `App.js`), add the assessment system:

```javascript
import React, { useState } from 'react';
import AssessmentSystem from './components/AssessmentSystem';
// ... your existing imports

function App() {
  const [showAssessments, setShowAssessments] = useState(false);
  
  // Your existing user data
  const user = {
    id: 1,
    name: 'John Doe', // Replace with actual user data
    email: 'john@example.com',
    role: 'student'
  };

  return (
    <div className="App">
      {/* Your existing app content */}
      <div className="your-existing-content">
        {/* Add a button to open assessments */}
        <button onClick={() => setShowAssessments(true)}>
          Open Assessments
        </button>
        
        {/* Your existing components */}
      </div>

      {/* Assessment System Modal/Overlay */}
      {showAssessments && (
        <div className="assessment-overlay">
          <AssessmentSystem
            user={user}
            onClose={() => setShowAssessments(false)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
```

### Step 5: Add Styling

Add this CSS to your main CSS file or create `AssessmentSystem.css`:

```css
.assessment-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assessment-system {
  background: white;
  border-radius: 8px;
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  overflow: auto;
  position: relative;
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.close-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
```

## Option 2: Package Integration

If you want to create a reusable package:

### Step 1: Build as npm package
```bash
# In assessment project
npm run build
npm pack
```

### Step 2: Install in your project
```bash
# In your existing project
npm install /path/to/learnmate-assessment-1.0.0.tgz
```

## Data Integration

### Using External Data Sources
Replace the mock data in `AssessmentSystem.js` with:

1. **API calls** to your backend
2. **Props from parent component**
3. **Context/Redux store**
4. **Local Storage** for persistence

Example with API:
```javascript
const [assessments, setAssessments] = useState([]);

useEffect(() => {
  // Fetch assessments from your API
  fetch('/api/assessments')
    .then(res => res.json())
    .then(data => setAssessments(data));
}, []);
```

## Customization

### Styling
- Modify the CSS files to match your existing design system
- Use CSS variables for consistent theming
- Override Material-UI theme if needed

### Functionality
- Add your authentication system
- Integrate with your user management
- Connect to your backend APIs
- Add analytics/tracking

## Testing Integration

1. Start your existing project: `npm run dev`
2. Add the assessment button to test
3. Verify all components load correctly
4. Test the complete assessment flow
5. Check certificate download functionality

## Notes
- Make sure your existing project supports the React version (18+)
- The certificate generation uses Canvas API - ensure it's supported in your target browsers
- Consider code splitting if the assessment system is large