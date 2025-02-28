import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { templateService } from '../services/templateService';
import TemplateCard from '../components/templates/TemplateCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { handleError } from '../utils/errorHandler';
import { PlusIcon } from '@heroicons/react/24/outline';

const TemplatesPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useFirebaseAuth();
  
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;
  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data = [];
        
        if (activeTab === 'all') {
          data = await templateService.getTemplates({
            isPublic: true,
            limit,
            offset: (page - 1) * limit
          });
        } else if (activeTab === 'popular') {
          data = await templateService.getTemplates({
            isPublic: true,
            sortBy: { column: 'likes_count', order: 'desc' },
            limit,
            offset: (page - 1) * limit
          });
        } else if (activeTab === 'search' && searchQuery) {
          data = await templateService.searchTemplates(searchQuery);
        } else if (activeTab === 'my' && isAuthenticated) {
          data = await templateService.getUserTemplates();
        }
        
        if (page === 1) {
          setTemplates(data);
        } else {
          setTemplates(prev => [...prev, ...data]);
        }
        
        setHasMore(data.length === limit);
      } catch (err) {
        handleError(err, {
          defaultMessage: t('templates.fetchError')
        });
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, [activeTab, searchQuery, page, isAuthenticated, t]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    
    if (!query) {
      return;
    }
    
    setSearchQuery(query);
    setActiveTab('search');
    setPage(1);
  };
  
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl">
            {t('templates.allTemplates')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('templates.browseDescription')}
          </p>
        </div>
        
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {isAuthenticated && (
            <Link
              to="/templates/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              {t('templates.createNew')}
            </Link>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="max-w-lg">
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              name="search"
              className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder={t('search.placeholder')}
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('search.button')}
            </button>
          </div>
        </form>
      </div>
      
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => { setActiveTab('all'); setPage(1); }}
            className={`${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t('templates.allTemplates')}
          </button>
          <button
            onClick={() => { setActiveTab('popular'); setPage(1); }}
            className={`${
              activeTab === 'popular'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t('templates.popularTemplates')}
          </button>
          {isAuthenticated && (
            <button
              onClick={() => { setActiveTab('my'); setPage(1); }}
              className={`${
                activeTab === 'my'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {t('templates.myTemplates')}
            </button>
          )}
          {activeTab === 'search' && (
            <button
              className="border-primary-500 text-primary-600 dark:text-primary-400 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
            >
              {t('search.results')}
            </button>
          )}
        </nav>
      </div>
      
      {loading && page === 1 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400">
            {t('templates.fetchError')}
          </p>
          <button
            onClick={() => { setActiveTab('all'); setPage(1); }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800"
          >
            {t('common.retry')}
          </button>
        </div>
      ) : templates.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  t('common.loadMore')
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === 'search' && searchQuery 
              ? t('search.noResults') 
              : activeTab === 'my'
                ? t('templates.noMyTemplates')
                : t('templates.noTemplatesAvailable')}
          </p>
          
          {activeTab === 'my' && (
            <Link
              to="/templates/create"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              {t('templates.createFirst')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage; 