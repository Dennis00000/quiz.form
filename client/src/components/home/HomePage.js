import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LatestTemplates from '../templates/LatestTemplates';
import PopularTemplates from '../templates/PopularTemplates';
import TagCloud from './TagCloud';

const HomePage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-8 mb-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl mb-8">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={isAuthenticated ? "/templates/create" : "/register"}
              className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-md transition duration-200"
            >
              {isAuthenticated ? t('templates.create') : t('auth.getStarted')}
            </Link>
            <Link
              to="/templates"
              className="bg-transparent hover:bg-white/10 border border-white text-white px-6 py-3 rounded-lg font-medium transition duration-200"
            >
              {t('templates.browse')}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          {t('home.features.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-primary-600 mb-4">
              {/* Icon placeholder */}
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.feature1.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('home.features.feature1.description')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-primary-600 mb-4">
              {/* Icon placeholder */}
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.feature2.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('home.features.feature2.description')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-primary-600 mb-4">
              {/* Icon placeholder */}
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('home.features.feature3.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('home.features.feature3.description')}</p>
          </div>
        </div>
      </div>

      {/* Popular Templates Section */}
      <div className="mb-12">
        <PopularTemplates />
      </div>

      {/* Latest Templates Section */}
      <div className="mb-12">
        <LatestTemplates />
      </div>

      {/* Tag Cloud Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t('home.popularTags')}</h2>
        <TagCloud />
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{t('home.cta.title')}</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">{t('home.cta.subtitle')}</p>
        <Link
          to={isAuthenticated ? "/templates/create" : "/register"}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition duration-200"
        >
          {isAuthenticated ? t('templates.create') : t('auth.getStarted')}
        </Link>
      </div>
    </div>
  );
};

export default HomePage; 