import React, { useState, useEffect, useCallback, useRef } from 'react';
import './TakeAssessment.css';

const TakeAssessment = ({ assessment, onComplete, onBack }) => {
  const [timeLeft, setTimeLeft] = useState(assessment.duration * 60); // Convert to seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0])); // Track visited questions
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [warningType, setWarningType] = useState(''); // '5min', '1min'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenViolations, setFullScreenViolations] = useState(0);
  
  const autoSaveIntervalRef = useRef(null);
  const assessmentStartTime = useRef(Date.now());

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(`assessment_${assessment.id}_${assessmentStartTime.current}`);
    if (savedData) {
      const { answers: savedAnswers, markedForReview: savedMarked, visitedQuestions: savedVisited, currentQuestion } = JSON.parse(savedData);
      setAnswers(savedAnswers || {});
      setMarkedForReview(new Set(savedMarked || []));
      setVisitedQuestions(new Set(savedVisited || [0]));
      setCurrentQuestionIndex(currentQuestion || 0);
    }

    // Auto-save every 10 seconds
    autoSaveIntervalRef.current = setInterval(() => {
      saveToLocalStorage();
    }, 10000);

    // Force fullscreen mode on assessment start
    setTimeout(() => {
      enterFullScreen();
    }, 500);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, []);

  // Timer effect with warnings
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    // Show warnings
    if (timeLeft === 300 && !showTimeWarning) { // 5 minutes
      setWarningType('5min');
      setShowTimeWarning(true);
    } else if (timeLeft === 60 && warningType !== '1min') { // 1 minute
      setWarningType('1min');
      setShowTimeWarning(true);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showTimeWarning, warningType]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync cached data when back online
      saveToBackend();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Tab switch/page visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            // Auto-submit after 3 violations
            handleAutoSubmit('Tab switching violations exceeded');
          } else {
            setShowTabWarning(true);
          }
          return newCount;
        });
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Listen for fullscreen changes and handle violations
  useEffect(() => {
    const handleFullScreenChange = () => {
      const wasFullScreen = isFullScreen;
      const isCurrentlyFullScreen = !!(document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement);
      
      setIsFullScreen(isCurrentlyFullScreen);
      
      // If user exited fullscreen (was fullscreen, now not)
      if (wasFullScreen && !isCurrentlyFullScreen && !isSubmitting) {
        setFullScreenViolations(prev => {
          const newCount = prev + 1;
          console.log(`Fullscreen violation ${newCount}/3`);
          
          if (newCount >= 3) {
            alert('Maximum fullscreen violations reached. Submitting assessment...');
            setTimeout(() => handleSubmit(), 500);
            return newCount;
          } else {
            // Silently try to re-enter fullscreen immediately
            setTimeout(() => {
              console.log('Re-entering fullscreen...');
              enterFullScreen().catch(err => {
                console.error('Failed to re-enter fullscreen:', err);
              });
            }, 100);
            
            return newCount;
          }
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('msfullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('msfullscreenchange', handleFullScreenChange);
    };
  }, []); // Remove dependencies to prevent re-rendering issues

  // Security measures and keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Disable F11 (user cannot exit fullscreen manually)
      if (e.key === 'F11') {
        e.preventDefault();
        return false;
      }
      
      // Disable Escape key (prevent fullscreen exit)
      if (e.key === 'Escape') {
        e.preventDefault();
        return false;
      }
      
      // Disable copy/paste shortcuts
      if (e.ctrlKey || e.metaKey) {
        const disabledKeys = ['c', 'v', 'x', 'a', 's', 'z', 'y', 'p', 'r', 'u', 'i', 'f', 'h'];
        if (disabledKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
        
        // Disable Ctrl+Shift combinations (dev tools)
        if (e.shiftKey) {
          e.preventDefault();
          return false;
        }
      }
      
      // Disable F12 (developer tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Disable other function keys that might open dev tools
      if (['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    const handleContextMenu = (e) => {
      // Disable right-click context menu
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e) => {
      // Disable text selection
      e.preventDefault();
      return false;
    };

    const handleDragStart = (e) => {
      // Disable drag and drop
      e.preventDefault();
      return false;
    };

    // Add all security event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    
    // Disable right-click on images and other elements
    document.addEventListener('mousedown', (e) => {
      if (e.button === 2) { // Right click
        e.preventDefault();
        return false;
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Save to localStorage
  const saveToLocalStorage = () => {
    const data = {
      answers,
      markedForReview: Array.from(markedForReview),
      visitedQuestions: Array.from(visitedQuestions),
      currentQuestion: currentQuestionIndex,
      timestamp: Date.now()
    };
    localStorage.setItem(`assessment_${assessment.id}_${assessmentStartTime.current}`, JSON.stringify(data));
  };

  // Save to backend (mock function)
  const saveToBackend = async () => {
    if (!isOnline) return;
    
    try {
      // Mock API call
      console.log('Saving to backend:', {
        assessmentId: assessment.id,
        answers,
        markedForReview: Array.from(markedForReview),
        timestamp: Date.now()
      });
      // In real implementation: await api.saveProgress(...)
    } catch (error) {
      console.error('Failed to save to backend:', error);
    }
  };

  // Get question status for styling
  const getQuestionStatus = (questionId, index) => {
    const isAnswered = answers.hasOwnProperty(questionId);
    const isMarked = markedForReview.has(questionId);
    const isVisited = visitedQuestions.has(index);
    const isCurrent = index === currentQuestionIndex;

    if (isCurrent) return 'current';
    if (isMarked) return 'review';
    if (isAnswered) return 'answered';
    if (isVisited) return 'visited';
    return 'not-visited';
  };

  // Full screen functions
  const enterFullScreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        await document.documentElement.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      // If fullscreen fails, just log the error
    }
  };

  const exitFullScreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullScreen(false);
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };



  // Handle answer selection
  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
    
    // Auto-save after answer selection
    setTimeout(() => {
      saveToLocalStorage();
      saveToBackend();
    }, 500);
  };

  // Navigate questions
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    // Mark question as visited
    setVisitedQuestions(prev => new Set([...prev, index]));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setVisitedQuestions(prev => new Set([...prev, nextIndex]));
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setVisitedQuestions(prev => new Set([...prev, prevIndex]));
    }
  };

  // Mark for review
  const toggleMarkForReview = (questionId) => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Submit assessment
  const handleSubmit = useCallback((reason = 'manual') => {
    setIsSubmitting(true);
    setShowConfirmSubmit(false);
    
    // Clear localStorage
    localStorage.removeItem(`assessment_${assessment.id}_${assessmentStartTime.current}`);
    
    // Calculate score
    let correctAnswers = 0;
    let totalScore = 0;
    
    assessment.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
        correctAnswers++;
        totalScore += question.marks;
      }
    });

    const result = {
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      courseName: assessment.courseName,
      totalQuestions: assessment.questions.length,
      correctAnswers,
      totalMarks: assessment.totalMarks,
      score: totalScore,
      percentage: ((totalScore / assessment.totalMarks) * 100).toFixed(1),
      passed: totalScore >= assessment.passingMarks,
      timeSpent: (assessment.duration * 60 - timeLeft),
      submittedAt: new Date().toISOString(),
      answers: answers,
      submissionReason: reason,
      tabSwitchViolations: tabSwitchCount
    };

    // Simulate API call
    setTimeout(() => {
      onComplete(result);
    }, 1500);
  }, [answers, assessment, timeLeft, onComplete, tabSwitchCount]);

  const handleAutoSubmit = useCallback((reason = 'timeout') => {
    if (!isSubmitting) {
      handleSubmit(reason);
    }
  }, [handleSubmit, isSubmitting]);



  const currentQuestion = assessment.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const reviewCount = markedForReview.size;

  // Prevent page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (isSubmitting) {
    return (
      <div className="assessment-container">
        <div className="submitting-overlay">
          <div className="submitting-content">
            <div className="spinner"></div>
            <h2>Submitting Assessment...</h2>
            <p>Please wait while we process your submission.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      {/* Header with Timer */}
      <div className="assessment-header">
        <div className="header-left">
          <h1 className="assessment-title">{assessment.title}</h1>
          <p className="course-name">{assessment.courseName}</p>
        </div>
        <div className="header-right">
          <div className="status-indicators">
            <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
              <div className="status-dot"></div>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            {tabSwitchCount > 0 && (
              <div className="violation-count">
                <span>⚠️ Tab switches: {tabSwitchCount}/3</span>
              </div>
            )}
            {fullScreenViolations > 0 && (
              <div className="violation-count fullscreen-violations">
                <span>⚠️ Fullscreen exits: {fullScreenViolations}/3</span>
              </div>
            )}
          </div>
          <div className={`timer ${timeLeft <= 300 ? 'warning' : ''} ${timeLeft <= 60 ? 'critical' : ''}`}>
            <div className="timer-icon">⏰</div>
            <div className="timer-text">
              <div className="time-display">{formatTime(timeLeft)}</div>
              <div className="time-label">Time Left</div>
            </div>
          </div>
        </div>
      </div>

      <div className="assessment-content">
        {/* Question Navigation Sidebar */}
        <div className="question-nav">
          <div className="nav-header">
            <h3>Questions</h3>
            <div className="progress-info">
              <span>{answeredCount}/{assessment.questions.length} answered</span>
              {reviewCount > 0 && <span>{reviewCount} marked for review</span>}
            </div>
          </div>
          
          <div className="question-grid">
            {assessment.questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => goToQuestion(index)}
                className={`question-nav-btn ${getQuestionStatus(question.id, index)}`}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="legend">
            <div className="legend-item">
              <div className="legend-color current"></div>
              <span>Current</span>
            </div>
            <div className="legend-item">
              <div className="legend-color answered"></div>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <div className="legend-color review"></div>
              <span>Review</span>
            </div>
            <div className="legend-item">
              <div className="legend-color visited"></div>
              <span>Visited</span>
            </div>
            <div className="legend-item">
              <div className="legend-color not-visited"></div>
              <span>Not Visited</span>
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="question-area">
          <div className="question-header">
            <div className="question-info">
              <span className="question-number">Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
              <span className="question-marks">{currentQuestion.marks} mark{currentQuestion.marks !== 1 ? 's' : ''}</span>
            </div>
            <button
              onClick={() => toggleMarkForReview(currentQuestion.id)}
              className={`mark-review-btn ${markedForReview.has(currentQuestion.id) ? 'active' : ''}`}
            >
              {markedForReview.has(currentQuestion.id) ? '🏷️ Marked for Review' : '🏷️ Mark for Review'}
            </button>
          </div>

          <div className="question-content">
            <div className="question-text">
              {currentQuestion.text}
            </div>

            <div className="options-list">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="option-label">
                  <input
                    type="radio"
                    name={`question_${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                    className="option-input"
                  />
                  <div className="option-content">
                    <div className="option-marker">{String.fromCharCode(65 + index)}</div>
                    <div className="option-text">{option}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Question Navigation */}
          <div className="question-controls">
            <div className="nav-buttons">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="btn-secondary"
              >
                ← Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === assessment.questions.length - 1}
                className="btn-secondary"
              >
                Next →
              </button>
            </div>
            
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="btn-primary submit-btn"
            >
              📝 Submit Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Submit Assessment?</h3>
            <div className="submit-summary">
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Answered:</span>
                  <span className="stat-value">{answeredCount}/{assessment.questions.length}</span>
                </div>
                {reviewCount > 0 && (
                  <div className="stat-item warning">
                    <span className="stat-label">Marked for Review:</span>
                    <span className="stat-value">{reviewCount}</span>
                  </div>
                )}
                <div className="stat-item">
                  <span className="stat-label">Time Remaining:</span>
                  <span className="stat-value">{formatTime(timeLeft)}</span>
                </div>
                {assessment.questions.length - answeredCount > 0 && (
                  <div className="stat-item danger">
                    <span className="stat-label">Unanswered:</span>
                    <span className="stat-value">{assessment.questions.length - answeredCount}</span>
                  </div>
                )}
              </div>
              
              {(reviewCount > 0 || assessment.questions.length - answeredCount > 0) && (
                <div className="warning-section">
                  <p className="warning-text">
                    🚨 <strong>Warning:</strong> You have {reviewCount > 0 && `${reviewCount} question${reviewCount !== 1 ? 's' : ''} marked for review`}
                    {reviewCount > 0 && assessment.questions.length - answeredCount > 0 && ' and '}
                    {assessment.questions.length - answeredCount > 0 && `${assessment.questions.length - answeredCount} unanswered question${assessment.questions.length - answeredCount !== 1 ? 's' : ''}`}.
                  </p>
                </div>
              )}
            </div>
            
            <p className="final-warning">
              ⚠️ Once submitted, you cannot change your answers. Are you sure you want to submit?
            </p>
            
            <div className="modal-actions">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="btn-secondary"
              >
                ← Continue Assessment
              </button>
              <button
                onClick={() => handleSubmit('manual')}
                className="btn-primary submit-final"
              >
                📝 Submit Final Answers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Warning Modal */}
      {showTimeWarning && (
        <div className="modal-overlay">
          <div className="modal-content warning-modal">
            <h3>
              {warningType === '5min' ? '⚠️ 5 Minutes Remaining!' : '🚨 1 Minute Remaining!'}
            </h3>
            <p>
              {warningType === '5min' 
                ? 'You have 5 minutes left to complete your assessment. Please review your answers and prepare to submit.'
                : 'Only 1 minute remaining! The assessment will auto-submit when time runs out.'}
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowTimeWarning(false)}
                className="btn-primary"
              >
                Continue Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switch Warning Modal */}
      {showTabWarning && (
        <div className="modal-overlay">
          <div className="modal-content warning-modal">
            <h3>🚫 Tab Switch Detected!</h3>
            <p>
              You switched tabs or minimized the browser window. This is violation #{tabSwitchCount} of 3.
              {tabSwitchCount >= 2 && ' One more violation will auto-submit your assessment!'}
            </p>
            <div className="violation-progress">
              <div className="violation-bar">
                <div 
                  className="violation-fill"
                  style={{ width: `${(tabSwitchCount / 3) * 100}%` }}
                ></div>
              </div>
              <span>{tabSwitchCount}/3 violations</span>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowTabWarning(false)}
                className="btn-primary"
              >
                Continue Assessment
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default TakeAssessment;