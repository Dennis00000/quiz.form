import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-200 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
        <GlobeAltIcon className="w-5 h-5 mr-2" aria-hidden="true" />
        <span>{currentLanguage.flag} {currentLanguage.name}</span>
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {languages.map(({ code, name, flag }) => (
            <Menu.Item key={code}>
              {({ active }) => (
                <button
                  onClick={() => changeLanguage(code)}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'
                  } ${
                    i18n.language === code ? 'bg-gray-50 dark:bg-gray-700' : ''
                  } group flex w-full items-center px-4 py-2 text-sm`}
                >
                  <span className="mr-2">{flag}</span>
                  {name}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default LanguageSelector; 