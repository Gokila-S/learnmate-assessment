import React from 'react';
import './AssessmentResult.css';

const AssessmentResult = ({ result, assessment, onReturnToList, onRetake, onGenerateCertificate, user }) => {
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
    if (scorePercentage >= 90) return 'A+';
    if (scorePercentage >= 80) return 'A';
    if (scorePercentage >= 70) return 'B';
    if (scorePercentage >= 60) return 'C';
    if (scorePercentage >= 50) return 'D';
    return 'F';
  };

  const getEncouragementMessage = () => {
    if (scorePercentage >= 90) return "Outstanding performance! You've mastered this topic.";
    if (scorePercentage >= 80) return "Excellent work! You have a strong understanding.";
    if (scorePercentage >= 70) return "Great job! You're doing well.";
    if (scorePercentage >= 60) return "Good effort! Keep up the good work.";
    if (scorePercentage >= 50) return "Not bad! There's room for improvement.";
    return "Don't give up! Review the material and try again.";
  };

  const generateCertificate = () => {
    // Create certificate canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (A4 landscape proportions)
    canvas.width = 1123;
    canvas.height = 794;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Inner border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Header decoration
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(40, 40, canvas.width - 80, 80);
    
    // Certificate text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 95);
    
    // Main heading
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('This certifies that', canvas.width / 2, 180);
    
    // Student name
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 36px Arial';
    const studentName = user?.name || user?.username || 'Student';
    ctx.fillText(studentName, canvas.width / 2, 240);
    
    // Achievement text
    ctx.fillStyle = '#1f2937';
    ctx.font = '24px Arial';
    ctx.fillText('has successfully completed the assessment', canvas.width / 2, 300);
    
    // Course name
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 30px Arial';
    ctx.fillText(result.assessmentTitle, canvas.width / 2, 360);
    
    // Course details
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Arial';
    ctx.fillText(result.courseName, canvas.width / 2, 400);
    
    // Score details
    ctx.fillStyle = '#1f2937';
    ctx.font = '22px Arial';
    ctx.fillText(`with a score of ${result.score}/${result.totalMarks} (${result.percentage}%)`, canvas.width / 2, 460);
    
    // Date
    ctx.fillStyle = '#6b7280';
    ctx.font = '18px Arial';
    const completionDate = new Date(result.submittedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillText(`Completed on ${completionDate}`, canvas.width / 2, 520);
    
    // Success badge
    if (isPassed) {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('✓ PASSED', canvas.width / 2, 600);
    }
    
    // Footer
    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px Arial';
    ctx.fillText('LearnMate Assessment System', canvas.width / 2, 720);
    ctx.fillText('Certificate ID: ' + Date.now().toString(36).toUpperCase(), canvas.width / 2, 745);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate_${result.assessmentTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="result-container">
      <div className="result-card">
        {/* Header */}
        <div className={`result-header ${isPassed ? 'passed' : 'failed'}`}>
          <div className="result-status">
            <div className="status-icon">
              {isPassed ? 'PASS' : 'FAIL'}
            </div>
            <div className="status-text">
              <h1 className="status-title">
                {isPassed ? 'Assessment Passed!' : 'Assessment Complete'}
              </h1>
              <p className="status-subtitle">
                {isPassed ? 'Congratulations on your success!' : 'Keep studying and try again'}
              </p>
            </div>
          </div>
          
          <div className="assessment-info">
            <h2 className="assessment-title">{result.assessmentTitle}</h2>
            <p className="course-name">{result.courseName}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="result-content">
          {/* Score Display */}
          <div className="score-section">
            <h3 className="section-title">📊 Your Score</h3>
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
            <h3 className="section-title">📋 Details</h3>
            
            <div className="details-grid">
              <div className="detail-card">
                <div className="detail-icon">✓</div>
                <div className="detail-number">{result.correctAnswers}</div>
                <div className="detail-label">Correct</div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">📝</div>
                <div className="detail-number">{result.totalQuestions}</div>
                <div className="detail-label">Total</div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">⏱️</div>
                <div className="detail-number">{formatTime(result.timeSpent)}</div>
                <div className="detail-label">Time</div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">🎯</div>
                <div className="detail-number">{assessment?.passingMarks || Math.ceil(result.totalMarks * 0.6)}</div>
                <div className="detail-label">Pass Mark</div>
              </div>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="performance-section">
            <h3 className="section-title">📈 Performance</h3>
            
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
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="result-actions">
          <button 
            className="btn-primary"
            onClick={onReturnToList}
          >
            Return to Dashboard
          </button>
          
          {!isPassed && canRetake && (
            <button 
              onClick={onRetake}
              className="btn-secondary"
            >
              Retake Assessment
            </button>
          )}
          
          {isPassed && (
            <button 
              onClick={generateCertificate}
              className="btn-success"
            >
              📜 Download Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;