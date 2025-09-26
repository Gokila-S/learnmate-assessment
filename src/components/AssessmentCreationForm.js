import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import QuestionBuilder from './QuestionBuilder';
import './AssessmentCreationForm.css';

const AssessmentCreationForm = () => {
  const [courses] = useState([
    { id: 1, name: 'React Development Bootcamp' },
    { id: 2, name: 'Node.js Backend Development' },
    { id: 3, name: 'Full Stack Web Development' },
    { id: 4, name: 'JavaScript Fundamentals' },
  ]);

  const { control, handleSubmit, watch, register, setValue, formState: { errors } } = useForm({
    defaultValues: {
      courseId: '',
      title: '',
      duration: 60,
      totalMarks: 100,
      passingMarks: 40,
      attemptsAllowed: 1,
      instructions: 'Do not refresh or close the tab once started.',
      questions: [
        {
          id: uuidv4(),
          type: 'MCQ',
          text: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          marks: 5,
        }
      ],
      status: 'draft',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const addQuestion = () => {
    append({
      id: uuidv4(),
      type: 'MCQ',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 5,
    });
  };

  const onSubmit = (data) => {
    console.log('Assessment Data:', data);
    alert('Assessment saved successfully!');
  };

  const watchedQuestions = watch('questions');
  const totalMarks = watchedQuestions.reduce((sum, question) => sum + (parseInt(question.marks) || 0), 0);

  return (
    <div className="assessment-form-container">
      {/* Header */}
      <div className="form-header">
        <div className="header-content">
          <div className="header-icon">
            📝
          </div>
          <div className="header-text">
            <h2 className="form-title">Create Assessment</h2>
            <p className="form-subtitle">
              Create a comprehensive assessment linked to your course with multiple question types and flexible settings.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="assessment-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3 className="section-title">📋 Basic Information</h3>
          
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Select Course *</label>
              <select 
                {...register('courseId', { required: 'Please select a course' })}
                className={`form-select ${errors.courseId ? 'error' : ''}`}
              >
                <option value="">Choose a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <span className="error-message">{errors.courseId.message}</span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Assessment Title *</label>
              <input
                type="text"
                {...register('title', { required: 'Assessment title is required' })}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g., Final Exam – Web Development"
              />
              {errors.title && (
                <span className="error-message">{errors.title.message}</span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Duration (minutes) *</label>
              <input
                type="number"
                {...register('duration', { 
                  required: 'Duration is required',
                  min: { value: 1, message: 'Duration must be at least 1 minute' }
                })}
                className={`form-input ${errors.duration ? 'error' : ''}`}
                min="1"
              />
              {errors.duration && (
                <span className="error-message">{errors.duration.message}</span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Total Marks *</label>
              <input
                type="number"
                {...register('totalMarks', { 
                  required: 'Total marks is required',
                  min: { value: 1, message: 'Total marks must be at least 1' }
                })}
                className={`form-input ${errors.totalMarks ? 'error' : ''}`}
                min="1"
              />
              {errors.totalMarks && (
                <span className="error-message">{errors.totalMarks.message}</span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Passing Marks *</label>
              <input
                type="number"
                {...register('passingMarks', { 
                  required: 'Passing marks is required',
                  min: { value: 1, message: 'Passing marks must be at least 1' }
                })}
                className={`form-input ${errors.passingMarks ? 'error' : ''}`}
                min="1"
              />
              {errors.passingMarks && (
                <span className="error-message">{errors.passingMarks.message}</span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Attempts Allowed *</label>
              <input
                type="number"
                {...register('attemptsAllowed', { 
                  required: 'Attempts allowed is required',
                  min: { value: 1, message: 'At least 1 attempt must be allowed' }
                })}
                className={`form-input ${errors.attemptsAllowed ? 'error' : ''}`}
                min="1"
              />
              {errors.attemptsAllowed && (
                <span className="error-message">{errors.attemptsAllowed.message}</span>
              )}
            </div>

            <div className="form-field full-width">
              <label className="form-label">Status</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="draft"
                    {...register('status')}
                  />
                  <span className="radio-label">Draft</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="published"
                    {...register('status')}
                  />
                  <span className="radio-label">Published</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="archived"
                    {...register('status')}
                  />
                  <span className="radio-label">Archived</span>
                </label>
              </div>
            </div>

            <div className="form-field full-width">
              <label className="form-label">Instructions</label>
              <textarea
                {...register('instructions')}
                className="form-textarea"
                rows="3"
                placeholder="Provide clear instructions for students taking this assessment..."
              />
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">❓ Questions</h3>
            <div className="question-stats">
              <span className="stat-chip primary">Total Questions: {fields.length}</span>
              <span className="stat-chip secondary">Total Marks: {totalMarks}</span>
            </div>
          </div>

          {totalMarks !== parseInt(watch('totalMarks')) && (
            <div className="warning-alert">
              ⚠️ Warning: The sum of question marks ({totalMarks}) doesn't match the total marks ({watch('totalMarks')}).
            </div>
          )}

          {fields.map((field, index) => (
            <QuestionBuilder
              key={field.id}
              control={control}
              register={register}
              setValue={setValue}
              index={index}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
              errors={errors}
            />
          ))}

          <div className="add-question-container">
            <button
              type="button"
              onClick={addQuestion}
              className="add-question-btn"
            >
              ➕ Add Question
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="button" className="btn-secondary">
            👁️ Preview
          </button>
          <button type="submit" className="btn-primary">
            💾 Save Assessment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentCreationForm;