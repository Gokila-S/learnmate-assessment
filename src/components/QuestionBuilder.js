import React from 'react';
import { useWatch } from 'react-hook-form';
import './QuestionBuilder.css';

const QuestionBuilder = ({ control, register, index, onRemove, canRemove, errors, setValue }) => {
  // Watch the current options array
  const currentOptions = useWatch({
    control,
    name: `questions.${index}.options`,
    defaultValue: ['', '', '', '']
  });

  const addOption = () => {
    const newOptions = [...currentOptions, ''];
    setValue(`questions.${index}.options`, newOptions);
  };

  const removeOptionHandler = (optionIndex) => {
    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter((_, idx) => idx !== optionIndex);
      setValue(`questions.${index}.options`, newOptions);
      // Also update the correct answer if it was pointing to a removed option
      const currentCorrectAnswer = parseInt(control._getWatch(`questions.${index}.correctAnswer`));
      if (currentCorrectAnswer >= optionIndex) {
        setValue(`questions.${index}.correctAnswer`, currentCorrectAnswer > optionIndex ? currentCorrectAnswer - 1 : '');
      }
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-title-section">
          <h4 className="question-title">Question {index + 1}</h4>
          <span className="question-type-badge">MCQ</span>
        </div>
        <div className="question-actions">
          {canRemove && (
            <button 
              type="button"
              onClick={onRemove} 
              className="remove-question-btn"
              title="Remove Question"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <div className="question-content">
        <div className="question-form-grid">
          {/* Question Type and Marks */}
          <div className="question-meta">
            <div className="form-field">
              <label className="form-label">Question Type</label>
              <select 
                {...register(`questions.${index}.type`)}
                className="form-select"
                disabled
              >
                <option value="MCQ">Multiple Choice</option>
                <option value="SHORT_ANSWER" disabled>Short Answer (Coming Soon)</option>
                <option value="CODING" disabled>Coding (Coming Soon)</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Marks *</label>
              <input
                type="number"
                {...register(`questions.${index}.marks`, { 
                  required: 'Marks is required',
                  min: { value: 1, message: 'Marks must be at least 1' }
                })}
                className={`form-input ${errors?.questions?.[index]?.marks ? 'error' : ''}`}
                min="1"
              />
              {errors?.questions?.[index]?.marks && (
                <span className="error-message">{errors.questions[index].marks.message}</span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="form-field full-width">
            <label className="form-label">Question Text *</label>
            <textarea
              {...register(`questions.${index}.text`, { required: 'Question text is required' })}
              className={`form-textarea ${errors?.questions?.[index]?.text ? 'error' : ''}`}
              rows="2"
              placeholder="e.g., Which tag is used for an image in HTML?"
            />
            {errors?.questions?.[index]?.text && (
              <span className="error-message">{errors.questions[index].text.message}</span>
            )}
          </div>

          {/* Options */}
          <div className="options-section full-width">
            <label className="form-label">Answer Options</label>
            
            {(currentOptions || ['', '', '', '']).map((option, optionIndex) => (
              <div key={`option-${index}-${optionIndex}`} className="option-row">
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="text"
                    {...register(`questions.${index}.options.${optionIndex}`, { 
                      required: `Option ${String.fromCharCode(65 + optionIndex)} is required` 
                    })}
                    className="qb-option-input"
                    placeholder={`Enter option ${String.fromCharCode(65 + optionIndex)}`}
                  />
                  {(currentOptions?.length || 4) > 2 && optionIndex >= 2 && (
                    <button
                      type="button"
                      onClick={() => removeOptionHandler(optionIndex)}
                      className="remove-option-btn"
                      title="Remove Option"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addOption}
              className="add-option-btn"
            >
              ➕ Add Option
            </button>
          </div>

          {/* Correct Answer */}
          <div className="form-field full-width">
            <label className="form-label">Correct Answer *</label>
            <select 
              {...register(`questions.${index}.correctAnswer`, { required: 'Please select the correct answer' })}
              className={`form-select ${errors?.questions?.[index]?.correctAnswer ? 'error' : ''}`}
            >
              <option value="">Select correct answer...</option>
              {(currentOptions || ['', '', '', '']).map((_, optionIndex) => (
                <option 
                  key={optionIndex} 
                  value={optionIndex}
                >
                  Option {String.fromCharCode(65 + optionIndex)}
                </option>
              ))}
            </select>
            {errors?.questions?.[index]?.correctAnswer && (
              <span className="error-message">{errors.questions[index].correctAnswer.message}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBuilder;