import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsPage = () => {
  const { t } = useTranslation();
  const lastUpdated = 'May 15, 2024';

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          {t('terms.title')}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('terms.lastUpdated')}: {lastUpdated}
        </p>
        
        <div className="mt-6 prose prose-indigo prose-lg dark:prose-invert">
          <p>
            Welcome to QuizForm. By accessing or using our service, you agree to be bound by these Terms of Service.
          </p>
          
          <h2>1. Use of Service</h2>
          <p>
            QuizForm provides a platform for creating and managing forms, surveys, and quizzes. You are responsible 
            for your use of the service and any content you create or share.
          </p>
          
          <h2>2. Account Registration</h2>
          <p>
            To use certain features of the service, you may need to register for an account. You agree to provide 
            accurate information and to keep your account credentials secure.
          </p>
          
          <h2>3. User Content</h2>
          <p>
            You retain ownership of any content you create using our service. However, you grant us a license to 
            use, store, and display your content in connection with providing the service.
          </p>
          
          <h2>4. Prohibited Conduct</h2>
          <p>
            You agree not to:
          </p>
          <ul>
            <li>Use the service for any illegal purpose</li>
            <li>Violate any laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Interfere with the operation of the service</li>
            <li>Collect user data without consent</li>
          </ul>
          
          <h2>5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to the service at our discretion, 
            particularly if you violate these terms.
          </p>
          
          <h2>6. Disclaimer of Warranties</h2>
          <p>
            The service is provided "as is" without warranties of any kind, either express or implied.
          </p>
          
          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages.
          </p>
          
          <h2>8. Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Your continued use of the service after such changes 
            constitutes your acceptance of the new terms.
          </p>
          
          <h2>9. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            <a 
              href="mailto:dennisopoola@gmail.com" 
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              dennisopoola@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 