import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { templateService } from '../../services/templateService';
import TemplateCard from './TemplateCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const PopularTemplates = ({ limit = 4 }) => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularTemplates = async () => {
      try {
        setLoading(true);
        const response = await templateService.getPopularTemplates(limit);
        setTemplates(response);
      } catch (error) {
        console.error('Error fetching popular templates:', error);
        toast.error(t('templates.error.fetchPopular'));
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTemplates();
  }, [limit, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('templates.popular')}</h2>
        <Link to="/templates" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          {t('common.viewAll')} →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
      
      {templates.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('templates.noPopularTemplates')}
        </div>
      )}
    </div>
  );
};

export default PopularTemplates; 