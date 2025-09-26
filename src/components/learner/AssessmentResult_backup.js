import React from 'react';
import './AssessmentResult.css';

const AssessmentResult = ({ result, assessment, onReturnToList, onRetake, onGenerateCertificate }) => {
  const canRetake = assessment?.attemptsUsed < assessment?.attemptsAllowed;
  const scorePercentage = parseFloat(result.percentage);
  const isPassed = result.passed;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'excellent';
    if (scorePercentage >= 60) return 'good';
    if (scorePercentage >= 40) return 'average';
    return 'poor';
  };

  const getGradeEmoji = () => {
    if (scorePercentage >= 90) return '🏆';
    if (scorePercentage >= 80) return '🥇';
    if (scorePercentage >= 70) return '🥈';
    if (scorePercentage >= 60) return '🥉';
    if (scorePercentage >= 50) return '👍';
    return '📚';
  };

  const getEncouragementMessage = () => {
    if (scorePercentage >= 90) return "Outstanding performance! You've mastered this topic.";
    if (scorePercentage >= 80) return "Excellent work! You have a strong understanding.";
    if (scorePercentage >= 70) return "Great job! You're doing well.";
    if (scorePercentage >= 60) return "Good effort! Keep up the good work.";
    if (scorePercentage >= 50) return "Not bad! There's room for improvement.";
    return "Don't give up! Review the material and try again.";
  };

  return (
    <div className="result-container">
      <div className="result-card">
        {/* Header */}
        <div className={`result-header ${isPassed ? 'passed' : 'failed'}`}>
          <div className="result-status">
            <div className="status-icon">
              {isPassed ? '✅' : '❌'}
            </div>
            <div className="status-text">
              <h1 className="status-title">
                {isPassed ? 'Congratulations!' : 'Assessment Complete'}
              </h1>
              <p className="status-subtitle">
                {isPassed ? 'You have passed the assessment!' : 'You did not pass this time'}
              </p>
            </div>
          </div>
        </div>

        {/* Assessment Info */}
        <div className="assessment-info">
          <h2 className="assessment-title">{result.assessmentTitle}</h2>
          <p className="course-name">{result.courseName}</p>
        </div>

        {/* Main Content Grid */}
        <div className="result-content">
          {/* Score Display */}
          <div className="score-section">
          <div className="score-display">
            <div className="score-circle">
              <div className={`score-ring ${getScoreColor()}`}>
                <div className="score-content">
                  <div className="score-number">{result.score}</div>
                  <div className="score-total">/{result.totalMarks}</div>
                  <div className="score-percentage">{result.percentage}%</div>
                </div>
              </div>
            </div>
            <div className="grade-info">
              <div className="grade-emoji">{getGradeEmoji()}</div>
              <p className="encouragement">{getEncouragementMessage()}</p>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="results-details">
          <h2 className="section-title">📊 Detailed Results</h2>
          
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-icon correct">✅</div>
              <div className="detail-content">
                <div className="detail-number">{result.correctAnswers}</div>
                <div className="detail-label">Correct Answers</div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon total">📝</div>
              <div className="detail-content">
                <div className="detail-number">{result.totalQuestions}</div>
                <div className="detail-label">Total Questions</div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon time">⏱️</div>
              <div className="detail-content">
                <div className="detail-number">{formatTime(result.timeSpent)}</div>
                <div className="detail-label">Time Taken</div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon passing">🎯</div>
              <div className="detail-content">
                <div className="detail-number">{assessment?.passingMarks || Math.ceil(result.totalMarks * 0.6)}</div>
                <div className="detail-label">Passing Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="performance-section">
          <h2 className="section-title">📈 Performance Analysis</h2>
          
          <div className="performance-bar">
            <div className="bar-container">
              <div 
                className={`progress-bar ${getScoreColor()}`}
                style={{ width: `${Math.min(scorePercentage, 100)}%` }}
              ></div>
            </div>
            <div className="bar-labels">
              <span>0%</span>
                            <span className="passing-mark">{((assessment?.passingMarks || result.totalMarks * 0.6) / result.totalMarks * 100).toFixed(0)}% (Pass)</span>
              <span>100%</span>
            </div>
          </div>

          <div className="performance-stats">
            <div className="stat-item">
              <span className="stat-label">Accuracy:</span>
              <span className="stat-value">{((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)}%</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Time Spent:</span>
              <span className="stat-value">{formatTime(result.timeSpent)}</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Submission:</span>
              <span className="stat-value">{result.submissionReason === 'manual' ? 'Manual' : 'Auto'}</span>
            </div>
            
            {result.tabSwitchViolations > 0 && (
              <div className="stat-item warning">
                <span className="stat-label">Security Violations:</span>
                <span className="stat-value">{result.tabSwitchViolations}</span>
              </div>
            )}
            
            <div className="stat-item">
              <span className="stat-label">Submitted At:</span>
              <span className="stat-value">
                {new Date(result.submittedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Questions per minute:</span>
              <span className="stat-value">{(result.totalQuestions / (result.timeSpent / 60)).toFixed(1)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average time per question:</span>
              <span className="stat-value">{Math.round(result.timeSpent / result.totalQuestions)}s</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps-section">
          <h2 className="section-title">🎯 What's Next?</h2>
          
          {isPassed ? (
            <div className="success-actions">
              <div className="success-message">
                <div className="success-icon">🎉</div>
                <p>You've successfully completed this assessment! Your achievement has been recorded.</p>
              </div>
              
              {scorePercentage >= 70 && (
                <div className="certificate-offer">
                  <div className="certificate-icon">🏆</div>
                  <div className="certificate-content">
                    <h3>Eligible for Certificate!</h3>
                    <p>Your excellent performance qualifies you for a certificate of completion.</p>
                    <button 
                      onClick={() => onGenerateCertificate(result)}
                      className="btn-certificate"
                    >
                      🏆 Generate Certificate
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="improvement-suggestions">
              <div className="suggestion-icon">💡</div>
              <div className="suggestions-list">
                <h3>Suggestions for Improvement:</h3>
                <ul>
                  <li>Review the course materials, especially topics you found challenging</li>
                  <li>Practice with additional exercises and examples</li>
                  <li>Seek help from instructors or study groups</li>
                  {canRetake && <li>Consider retaking the assessment when you feel more prepared</li>}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            onClick={onReturnToList}
            className="btn-secondary"
          >
            ← Back to Assessments
          </button>
          
          {canRetake && (
            <button 
              onClick={onRetake}
              className="btn-primary"
            >
              🔄 Retake Assessment
            </button>
          )}
          
          {isPassed && scorePercentage < 70 && (
            <button 
              onClick={() => onGenerateCertificate(result)}
              className="btn-certificate"
            >
              📜 View Achievement
            </button>
          )}
        </div>

        {/* Attempt Information */}
        <div className="attempt-info">
          <div className="attempt-details">
            <span>Attempt {assessment.attemptsUsed + 1} of {assessment.attemptsAllowed}</span>
            {canRetake && (
              <span className="attempts-remaining">
                {assessment.attemptsAllowed - assessment.attemptsUsed - 1} attempt{assessment.attemptsAllowed - assessment.attemptsUsed - 1 !== 1 ? 's' : ''} remaining
              </span>
            )}
          </div>
          <div className="submission-time">
            Submitted on {new Date(result.submittedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;