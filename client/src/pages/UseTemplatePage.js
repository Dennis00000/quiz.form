import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTemplates } from '../hooks/useTemplates';
import { useAuth } from '../contexts/AuthContext';

const UseTemplatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { template, loading, error, fetchTemplate } = useTemplates();
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchTemplate(id);
  }, [fetchTemplate, id]);

  const validateResponse = (question, value) => {
    if (question.required && (value === undefined || value === '')) {
      return t('templates.use.error.validation.required');
    }

    if (value) {
      switch (question.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return t('templates.use.error.validation.email.invalid');
          }
          break;

        case 'phone':
          const phoneRegex = /^\+?[\d\s-]{10,}$/;
          if (!phoneRegex.test(value)) {
            return t('templates.use.error.validation.phone.invalid');
          }
          break;

        case 'url':
          try {
            new URL(value);
          } catch {
            return t('templates.use.error.validation.url.invalid');
          }
          break;

        case 'number':
          const num = Number(value);
          if (isNaN(num)) {
            return t('templates.use.error.validation.number.invalid');
          }
          if (question.min !== undefined && num < question.min) {
            return t('templates.use.error.validation.number.min', { min: question.min });
          }
          if (question.max !== undefined && num > question.max) {
            return t('templates.use.error.validation.number.max', { max: question.max });
          }
          break;

        case 'date':
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return t('templates.use.error.validation.date.invalid');
          }
          if (question.min && date < new Date(question.min)) {
            return t('templates.use.error.validation.date.min', { min: question.min });
          }
          if (question.max && date > new Date(question.max)) {
            return t('templates.use.error.validation.date.max', { max: question.max });
          }
          break;

        case 'text':
          if (value.length > 1000) {
            return t('templates.use.error.validation.text.tooLong', { max: 1000 });
          }
          break;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    template.questions.forEach(question => {
      const error = validateResponse(question, responses[question.id]);
      if (error) {
        newErrors[question.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Implement submission to backend
    console.log('Form responses:', responses);
    setSubmitted(true);
  };

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: null
      }));
    }
  };

  const renderQuestionInput = (question) => {
    const hasError = errors[question.id];
    const inputClasses = `mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white ${
      hasError 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
        : 'border-gray-300 dark:border-gray-600'
    }`;

    switch (question.type) {
      case 'radio':
        return (
          <>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={responses[question.id] === option}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    required={question.required}
                  />
                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors[question.id]}
              </p>
            )}
          </>
        );
      case 'select':
        return (
          <>
            <select
              value={responses[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              className={inputClasses}
              required={question.required}
            >
              <option value="">{t('templates.form.selectPlaceholder')}</option>
              {question.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors[question.id]}
              </p>
            )}
          </>
        );
      case 'date':
        return (
          <>
            <input
              type="date"
              className={inputClasses}
              value={responses[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
              min={question.min}
              max={question.max}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors[question.id]}
              </p>
            )}
          </>
        );
      case 'email':
        return (
          <>
            <input
              type="email"
              className={inputClasses}
              value={responses[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors[question.id]}
              </p>
            )}
          </>
        );
      case 'phone':
        return (
          <>
            <input
              type="tel"
              className={inputClasses}
              value={responses[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors[question.id]}
              </p>
            )}
          </>
        );
      case 'url':
        return (
          <>
            <input
              type="url"
              className={inputClasses}
              value={responses[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors[question.id]}
              </p>
            )}
          </>
        );
      case 'text':
        return (
          <>
            <textarea
              className={inputClasses}
              value={responses[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
              rows={3}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors[question.id]}
              </p>
            )}
          </>
        );
      case 'number':
        return (
          <input
            type="number"
            className={inputClasses}
            value={responses[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={responses[question.id] || false}
            onChange={(e) => handleInputChange(question.id, e.target.checked)}
            required={question.required}
          />
        );
      default:
        return (
          <input
            type="text"
            className={inputClasses}
            value={responses[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error ? t('common.error') : t('templates.notFound')}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {t('common.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('templates.use.submitted')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('templates.use.thankYou')}
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            {t('common.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {template.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {template.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {template.questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6"
          >
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {index + 1}. {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </span>
              {renderQuestionInput(question)}
            </label>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            {t('templates.use.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UseTemplatePage; 