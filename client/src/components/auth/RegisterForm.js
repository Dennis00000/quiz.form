import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t('auth.validation.allFields'));
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.validation.passwordMatch'));
      return;
    }
    
    if (formData.password.length < 6) {
      setError(t('auth.validation.passwordLength'));
      return;
    }
    
    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/login');
    } catch (error) {
      // Error is already handled in the auth context with toast
      console.error('Registration error:', error);
    }
  };
  
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          {t('auth.register.title')}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white dark:bg-gray-800 px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {error && (
            <Alert 
              type="error"
              message={error}
              className="mb-6"
            />
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label={t('common.name')}
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input
              label={t('common.email')}
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              label={t('common.password')}
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <Input
              label={t('auth.register.confirmPassword')}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            
            <div>
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {t('auth.register.action')}
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white dark:bg-gray-800 px-6 text-gray-900 dark:text-gray-300">
                  {t('auth.register.or')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-10 text-center text-sm text-gray-500">
          {t('auth.register.haveAccount')}{' '}
          <Link to="/login" className="font-semibold leading-6 text-primary-600 hover:text-primary-500">
            {t('auth.login.action')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 