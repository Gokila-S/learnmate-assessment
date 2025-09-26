import React, { useState } from 'react';
import './AssessmentList.css';

const AssessmentList = ({ assessments, user, onStartAssessment }) => {
  const [activeTab, setActiveTab] = useState('all');

  const getStatusBadge = (assessment) => {
    switch (assessment.status) {
      case 'not_started':
        return <span className="status-badge not-started">Not Started</span>;
      case 'in_progress':
        return <span className="status-badge in-progress">In Progress</span>;
      case 'completed':
        const passed = assessment.lastScore >= assessment.passingMarks;
        return (
          <span className={`status-badge ${passed ? 'passed' : 'failed'}`}>
            {passed ? 'Passed' : 'Failed'}
          </span>
        );
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  const getFilteredAssessments = () => {
    switch (activeTab) {
      case 'pending':
        return assessments.filter(a => a.status === 'not_started' || a.status === 'in_progress');
      case 'completed':
        return assessments.filter(a => a.status === 'completed');
      default:
        return assessments;
    }
  };

  const canTakeAssessment = (assessment) => {
    return assessment.status !== 'completed' && 
           assessment.attemptsUsed < assessment.attemptsAllowed;
  };

  const stats = {
    total: assessments.length,
    pending: assessments.filter(a => a.status !== 'completed').length,
    completed: assessments.filter(a => a.status === 'completed').length,
    average: assessments.filter(a => a.lastScore).length > 0
      ? Math.round(
          assessments
            .filter(a => a.lastScore)
            .reduce((sum, a) => sum + (a.lastScore / a.totalMarks) * 100, 0) /
          assessments.filter(a => a.lastScore).length
        )
      : 0
  };

  return (
    <div className="assessment-list-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📝 My Assessments</h1>
          <p className="page-subtitle">
            Take your course assessments and track your progress
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-container blue">
            <span className="stat-icon">📊</span>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Assessments</p>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-container yellow">
            <span className="stat-icon">⏳</span>
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-container green">
            <span className="stat-icon">✓</span>
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{stats.completed}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-container purple">
            <span className="stat-icon">🎯</span>
          </div>
          <div className="stat-content">
            <p className="stat-label">Average Score</p>
            <p className="stat-value">{stats.average}%</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Assessments
        </button>
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      {/* Assessment Cards */}
      <div className="assessments-grid">
        {getFilteredAssessments().map((assessment) => (
          <div key={assessment.id} className="assessment-card">
            <div className="card-header">
              <div className="assessment-info">
                <h3 className="assessment-title">{assessment.title}</h3>
                <p className="course-name">{assessment.courseName}</p>
              </div>
              {getStatusBadge(assessment)}
            </div>

            <div className="card-content">
              <p className="assessment-description">{assessment.description}</p>
              
              <div className="assessment-details">
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <span className="detail-text">{assessment.duration} minutes</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📝</span>
                  <span className="detail-text">{assessment.totalMarks} marks</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">✓</span>
                  <span className="detail-text">Pass: {assessment.passingMarks} marks</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🔄</span>
                  <span className="detail-text">
                    {assessment.attemptsUsed}/{assessment.attemptsAllowed} attempts
                  </span>
                </div>
              </div>

              {assessment.status === 'completed' && assessment.lastScore !== undefined && (
                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-text">
                      {Math.round((assessment.lastScore / assessment.totalMarks) * 100)}%
                    </span>
                    <span className="score-label">Score</span>
                  </div>
                  <div className="score-details">
                    <p>Marks: {assessment.lastScore}/{assessment.totalMarks}</p>
                    {assessment.completedAt && (
                      <p>Completed: {new Date(assessment.completedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="card-actions">
              {assessment.status === 'not_started' && (
                <div className="action-group">
                  <button
                    onClick={() => onStartAssessment(assessment.id)}
                    className="btn-primary"
                  >
                    🚀 Start Assessment
                  </button>
                  <p className="attempts-info">
                    {assessment.attemptsAllowed} attempts allowed
                  </p>
                </div>
              )}
              
              {assessment.status === 'in_progress' && (
                <div className="action-group">
                  <button
                    onClick={() => onStartAssessment(assessment.id)}
                    className="btn-warning"
                  >
                    📝 Continue Assessment
                  </button>
                  <p className="attempts-info">
                    {assessment.attemptsAllowed - assessment.attemptsUsed} attempts remaining
                  </p>
                </div>
              )}
              
              {assessment.status === 'completed' && (
                <div className="action-group">
                  <button className="btn-secondary" disabled>
                    📊 View Result
                  </button>
                  <p className="completion-info">
                    Assessment completed
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {getFilteredAssessments().length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No assessments found</h3>
          <p>
            {activeTab === 'all' 
              ? "You don't have any assessments yet." 
              : `No ${activeTab} assessments available.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AssessmentList;