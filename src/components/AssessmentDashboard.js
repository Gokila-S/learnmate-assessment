import React, { useState, useEffect } from 'react';
import AssessmentCreationForm from './AssessmentCreationForm';
import './AssessmentDashboard.css';

const AssessmentDashboard = () => {
  const [user] = useState({ name: 'Administrator' });
  const [activeTab, setActiveTab] = useState('create');
  const [stats, setStats] = useState({
    totalAssessments: 12,
    draftAssessments: 3,
    publishedAssessments: 8,
    totalQuestions: 45
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          {getGreeting()}, {user?.name}! 👋
        </h1>
        <p className="dashboard-subtitle">
          Create and manage assessments for your courses. Build engaging evaluations for your students.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-container blue">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Assessments</p>
            <p className="stat-value">{stats.totalAssessments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-container yellow">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Draft</p>
            <p className="stat-value">{stats.draftAssessments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-container green">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Published</p>
            <p className="stat-value">{stats.publishedAssessments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-container purple">
            <svg className="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Questions</p>
            <p className="stat-value">{stats.totalQuestions}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <nav className="tabs-nav">
          <button
            onClick={() => setActiveTab('create')}
            className={`tab-button ${activeTab === 'create' ? 'tab-active' : 'tab-inactive'}`}
          >
            Create Assessment
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`tab-button ${activeTab === 'manage' ? 'tab-active' : 'tab-inactive'}`}
          >
            Manage Assessments
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="tab-content">
        {activeTab === 'create' && (
          <div className="create-assessment-section">
            <AssessmentCreationForm />
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="manage-section">
            <div className="empty-state">
              <svg
                className="empty-state-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="empty-state-title">Assessment Management</h3>
              <p className="empty-state-description">
                This section will display all your created assessments with options to edit, publish, or archive them.
              </p>
              <button className="empty-state-button">
                Coming Soon
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDashboard;