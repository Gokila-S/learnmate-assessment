import React from 'react';
import './AssessmentInstructions.css';

const AssessmentInstructions = ({ assessment, onBeginAssessment, onBack }) => {
  const attemptsRemaining = assessment.attemptsAllowed - assessment.attemptsUsed;

  return (
    <div className="instructions-container">
      <div className="instructions-card">
        {/* Header */}
        <div className="instructions-header">
          <button onClick={onBack} className="back-button">
            ← Back to Assessments
          </button>
          <div className="assessment-info">
            <h1 className="assessment-title">{assessment.title}</h1>
            <p className="course-name">{assessment.courseName}</p>
          </div>
        </div>

        {/* Assessment Details */}
        <div className="assessment-overview">
          <h2 className="section-title">📋 Assessment Overview</h2>
          <div className="overview-grid">
            <div className="overview-item">
              <div className="overview-icon">⏱️</div>
              <div className="overview-content">
                <h3>Duration</h3>
                <p>{assessment.duration} minutes</p>
              </div>
            </div>
            <div className="overview-item">
              <div className="overview-icon">📊</div>
              <div className="overview-content">
                <h3>Total Marks</h3>
                <p>{assessment.totalMarks} points</p>
              </div>
            </div>
            <div className="overview-item">
              <div className="overview-icon">🎯</div>
              <div className="overview-content">
                <h3>Passing Score</h3>
                <p>{assessment.passingMarks} points</p>
              </div>
            </div>
            <div className="overview-item">
              <div className="overview-icon">A</div>
              <div className="overview-content">
                <h3>Attempts</h3>
                <p>{attemptsRemaining} remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions-section">
          <h2 className="section-title">📖 Instructions</h2>
          <div className="instructions-content">
            <p className="custom-instructions">{assessment.instructions}</p>
          </div>
        </div>

        {/* Rules */}
        <div className="rules-section">
          <h2 className="section-title">⚠️ Important Rules</h2>
          <div className="rules-list">
            <div className="rule-item">
              <div className="rule-icon">🚫</div>
              <div className="rule-text">
                <strong>No Tab Switching:</strong> Do not switch tabs or open new windows during the assessment.
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">⏰</div>
              <div className="rule-text">
                <strong>Auto Submit:</strong> The assessment will automatically submit when time runs out.
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">🔄</div>
              <div className="rule-text">
                <strong>No Refresh:</strong> Do not refresh the page or close the browser tab once started.
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">💾</div>
              <div className="rule-text">
                <strong>Auto Save:</strong> Your answers are automatically saved as you progress.
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">📱</div>
              <div className="rule-text">
                <strong>Single Device:</strong> Use only one device to take the assessment.
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">🌐</div>
              <div className="rule-text">
                <strong>Stable Connection:</strong> Ensure you have a stable internet connection throughout.
              </div>
            </div>
          </div>
        </div>

        {/* Technical Requirements */}
        <div className="requirements-section">
          <h2 className="section-title">💻 Technical Requirements</h2>
          <div className="requirements-grid">
            <div className="requirement-item">
              <div className="requirement-icon">🌐</div>
              <div className="requirement-text">Modern web browser (Chrome, Firefox, Safari)</div>
            </div>
            <div className="requirement-item">
              <div className="requirement-icon">📶</div>
              <div className="requirement-text">Stable internet connection</div>
            </div>
            <div className="requirement-item">
              <div className="requirement-icon">💻</div>
              <div className="requirement-text">Desktop or laptop recommended</div>
            </div>
            <div className="requirement-item">
              <div className="requirement-icon">⚙️</div>
              <div className="requirement-text">Enable JavaScript and cookies</div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="warning-banner">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h3>Important Notice</h3>
            <p>
              Once you start the assessment, the timer will begin and cannot be paused. 
              Make sure you are ready and have enough time to complete it.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={onBack} className="btn-secondary">
            ← Cancel
          </button>
          <button onClick={onBeginAssessment} className="btn-primary">
            🚀 Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentInstructions;