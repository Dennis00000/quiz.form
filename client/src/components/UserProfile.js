import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { updateUserProfile, updatePassword, deleteAccount } from '../store/authSlice';
import { useAuth } from '../contexts/AuthContext';
import { performanceMonitor } from '../utils/performance';
import Modal from './common/Modal';
import Button from './common/Button';
import Spinner from './common/Spinner';
import Avatar from './common/Avatar';

const UserProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { isLoading, error } = useSelector(state => state.auth);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    bio: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    const perfKey = performanceMonitor.startInteraction('save_profile');
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('bio', profileForm.bio);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      await dispatch(updateUserProfile(formData)).unwrap();
      
      setIsEditing(false);
      setAvatarFile(null);
      toast.success(t('profile.updateSuccess'));
      performanceMonitor.endInteraction(perfKey, true);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('profile.updateError'));
      performanceMonitor.endInteraction(perfKey, false);
    }
  };
  
  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t('auth.passwordsMustMatch'));
      return;
    }
    
    const perfKey = performanceMonitor.startInteraction('update_password');
    
    try {
      await dispatch(updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })).unwrap();
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setIsChangingPassword(false);
      toast.success(t('profile.passwordUpdateSuccess'));
      performanceMonitor.endInteraction(perfKey, true);
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(t('profile.passwordUpdateError'));
      performanceMonitor.endInteraction(perfKey, false);
    }
  };
  
  // Delete account
  const handleDeleteAccount = async () => {
    const perfKey = performanceMonitor.startInteraction('delete_account');
    
    try {
      await dispatch(deleteAccount()).unwrap();
      toast.success(t('profile.deleteSuccess'));
      performanceMonitor.endInteraction(perfKey, true);
      // Redirect will happen automatically due to auth state change
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(t('profile.deleteError'));
      performanceMonitor.endInteraction(perfKey, false);
      setShowDeleteModal(false);
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('profile.title')}</h1>
      
      {/* Profile Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('profile.personalInfo')}</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <Avatar 
              src={avatarPreview || user.avatar_url} 
              alt={user.name} 
              size="xl" 
              className="mb-4"
            />
            
            {isEditing && (
              <div className="mt-2">
                <label className="btn-secondary text-sm cursor-pointer">
                  {t('common.edit')}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange} 
                  />
                </label>
              </div>
            )}
          </div>
          
          {/* Profile Form */}
          <div className="flex-1">
            <form onSubmit={handleSaveProfile}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label">
                  {t('profile.nameLabel')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  {t('profile.emailLabel')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="form-input bg-gray-100 dark:bg-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('common.info')}: {t('profile.emailChangeNotAllowed')}
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="bio" className="form-label">
                  {t('profile.bioLabel')}
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                {!isEditing ? (
                  <Button 
                    type="button" 
                    variant="primary" 
                    onClick={() => setIsEditing(true)}
                  >
                    {t('common.edit')}
                  </Button>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => {
                        setIsEditing(false);
                        setAvatarFile(null);
                        setAvatarPreview(null);
                        // Reset form to original values
                        if (user) {
                          setProfileForm({
                            name: user.name || '',
                            email: user.email || '',
                            bio: user.bio || ''
                          });
                        }
                      }}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      isLoading={isLoading}
                    >
                      {isLoading ? t('common.saving') : t('common.save')}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Password Change */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('profile.changePassword')}</h2>
        
        {!isChangingPassword ? (
          <Button 
            variant="secondary" 
            onClick={() => setIsChangingPassword(true)}
          >
            {t('profile.changePassword')}
          </Button>
        ) : (
          <form onSubmit={handleUpdatePassword}>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="form-label">
                {t('profile.currentPasswordLabel')}
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="form-label">
                {t('profile.newPasswordLabel')}
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                {t('profile.confirmPasswordLabel')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={isLoading}
              >
                {isLoading ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </form>
        )}
      </div>
      
      {/* Delete Account */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-red-200 dark:border-red-900">
        <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
          {t('profile.deleteAccount')}
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {t('profile.deleteWarning')}
        </p>
        <Button 
          variant="danger" 
          onClick={() => setShowDeleteModal(true)}
        >
          {t('profile.deleteAccount')}
        </Button>
      </div>
      
      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('profile.deleteAccount')}
      >
        <div className="p-6">
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            {t('profile.deleteConfirm')}
          </p>
          <div className="flex justify-end gap-3">
            <Button 
              variant="secondary" 
              onClick={() => setShowDeleteModal(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteAccount}
              isLoading={isLoading}
            >
              {isLoading ? t('common.loading') : t('common.delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile; 