import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = ({ children }) => {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('appName')}
                </h1>
              </Link>
              
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`${
                    location.pathname === '/'
                      ? 'border-primary-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {t('common.home')}
                </Link>
                {/* Add more navigation links as needed */}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label={darkMode ? t('common.lightMode') : t('common.darkMode')}
              >
                {darkMode ? '🌞' : '🌙'}
              </button>

              <select
                onChange={(e) => {
                  localStorage.setItem('language', e.target.value);
                  window.location.reload();
                }}
                className="form-select rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={localStorage.getItem('language') || 'en'}
              >
                <option value="en">English</option>
                <option value="lt">Lietuvių</option>
                <option value="ru">Русский</option>
              </select>

              <div className="flex space-x-2">
                {user ? (
                  <>
                    <span className="text-gray-700 dark:text-gray-300">
                      {user.name}
                    </span>
                    <button
                      onClick={logout}
                      className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {t('common.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`${
                        location.pathname === '/login'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      {t('common.login')}
                    </Link>
                    <Link
                      to="/register"
                      className={`${
                        location.pathname === '/register'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      {t('common.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 