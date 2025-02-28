import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          {t('about.title')}
        </h1>
        <div className="mt-6 prose prose-indigo prose-lg dark:prose-invert">
          <p>
            QuizForm is a powerful and intuitive platform designed to help you create engaging forms, 
            surveys, and quizzes with ease. Whether you're collecting feedback, conducting research, 
            or testing knowledge, QuizForm provides the tools you need to create professional-looking 
            forms and analyze responses effectively.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to simplify the process of creating and managing forms, making it accessible 
            to everyone regardless of technical expertise. We believe that gathering insights should be 
            straightforward, allowing you to focus on what matters most - understanding your audience.
          </p>
          
          <h2>About the Developer</h2>
          <p>
            QuizForm was developed by Dennis Opoola, a frontend developer committed to creating 
            user-friendly applications that solve real-world problems. With a focus on clean design 
            and intuitive user experiences, Dennis strives to build tools that are both powerful and 
            easy to use.
          </p>
          
          <div className="mt-8">
            <h3>Connect with Dennis:</h3>
            <ul>
              <li>
                <a 
                  href="mailto:dennisopoola@gmail.com" 
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Email: dennisopoola@gmail.com
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/do24" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  LinkedIn: linkedin.com/in/do24
                </a>
              </li>
              <li>
                <a 
                  href="https://dennisopoola.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Portfolio: dennisopoola.vercel.app
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 