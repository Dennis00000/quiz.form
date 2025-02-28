import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import './index.css';
import App from './App';
import './i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Add console logs for debugging
console.log('Index.js is running');
console.log('React version:', React.version);

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  console.log('Root element found:', !!root);
  
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
  console.log('Render called');
} catch (error) {
  console.error('Error rendering React app:', error);
}
