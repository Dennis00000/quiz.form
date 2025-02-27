import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ClockIcon, 
  UserIcon, 
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';
import LikeButton from './LikeButton';
import { formatDistanceToNow } from 'date-fns';

const TemplateCard = ({ template }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link to={`/templates/${template.id}`} className="block">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {template.title}
            </h3>
            <LikeButton 
              templateId={template.id} 
              initialLikes={template.likes_count || 0}
              initialLiked={template.user_liked}
            />
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {template.description}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{template.users?.name || t('common.anonymous')}</span>
            </div>

            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>
                {formatDistanceToNow(new Date(template.created_at), { addSuffix: true })}
              </span>
            </div>

            <div className="flex items-center">
              <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
              <span>{template.responses_count || 0} {t('common.responses')}</span>
            </div>
          </div>

          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {template.tags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default TemplateCard; 