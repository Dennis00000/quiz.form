import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';

const TemplateCard = ({ template }) => {
  const { t } = useTranslation();
  
  // Add null checks
  if (!template) return null;
  
  // Destructure with default values for all properties
  const {
    id,
    title = 'Untitled Template',
    description = '',
    user = null,
    created_at = new Date().toISOString(),
    likes_count = 0,
    questions_count = 0,
    tags = []
  } = template;
  
  // Format the date for display
  const formattedDate = new Date(created_at).toLocaleDateString();
  
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <Link to={`/templates/${id}`} className="block">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
            {title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-400 line-clamp-2">
          {description || t('templates.noDescription')}
        </p>
        
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          {user && (
            <>
              <div className="flex-shrink-0">
                <img 
                  className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-600"
                  src={user.avatar_url || 'https://via.placeholder.com/40'} 
                  alt={user.name || 'User'}
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.name || t('common.anonymous')}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formattedDate}
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex space-x-4 text-sm">
          <span className="flex items-center text-gray-700 dark:text-gray-300">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {questions_count || 0}
          </span>
          <span className="flex items-center text-gray-700 dark:text-gray-300">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {likes_count || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard; 