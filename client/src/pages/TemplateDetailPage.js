import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTemplates } from '../hooks/useTemplates';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from '../components/templates/ShareModal';
import { toast } from 'react-hot-toast';

const TemplateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { template, loading, error, fetchTemplate, createTemplate } = useTemplates();
  const [showShareModal, setShowShareModal] = useState(false);
  
  useEffect(() => {
    fetchTemplate(id);
  }, [fetchTemplate, id]);

  const handleDuplicate = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      // Create a new template object with modified title
      const newTemplate = {
        ...template,
        id: undefined,
        title: t('templates.duplicate.title', { title: template.title }),
        author: user.name,
        createdAt: new Date().toISOString(),
        views: 0,
        responses: []
      };
      
      const duplicated = await createTemplate(newTemplate);
      toast.success(t('templates.duplicate.success'));
      navigate(`/templates/${duplicated.id}`);
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      toast.error(t('templates.duplicate.error'));
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
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

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('templates.notFound')}
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

  return (
    <div className="space-y-6">
      {/* Template Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {template.title}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {template.description}
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('templates.by')} {template.author}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(template.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {user && (
              <button
                onClick={handleDuplicate}
                className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('templates.duplicate.button')}
              </button>
            )}
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setShowShareModal(true)}
            >
              {t('templates.share.button')}
            </button>
            <button 
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              onClick={() => navigate(`/templates/${template.id}/use`)}
            >
              {t('templates.use')}
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Questions Preview */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('templates.preview')}
        </h2>
        <div className="space-y-6">
          {template.questions.map((question, index) => (
            <div
              key={question.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-md"
            >
              <div className="flex items-start">
                <span className="text-gray-500 dark:text-gray-400 mr-2">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {question.title}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t(`templates.questionTypes.${question.type}`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        template={template}
      />
    </div>
  );
};

export default TemplateDetailPage; 