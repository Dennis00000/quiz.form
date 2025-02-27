import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        search: 'Search',
        profile: 'Profile',
        settings: 'Settings'
      },
      auth: {
        login: 'Log In',
        register: 'Register',
        logout: 'Log Out',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password?',
        resetPassword: 'Reset Password',
        name: 'Name'
      },
      templates: {
        create: 'Create Template',
        edit: 'Edit Template',
        delete: 'Delete Template',
        title: 'Title',
        description: 'Description',
        topic: 'Topic',
        tags: 'Tags',
        questions: 'Questions',
        visibility: 'Visibility',
        public: 'Public',
        private: 'Private',
        by: 'by'
      }
    }
  },
  lt: {
    translation: {
      // Lithuanian translations
    }
  },
  ru: {
    translation: {
      // Russian translations
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 