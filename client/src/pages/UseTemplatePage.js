import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplateById, updateTemplate, deleteTemplate } from '../store/templateSlice';
import { useAuth } from '../contexts/AuthContext';
import { performanceMonitor } from '../utils/performance';
import interactionService from '../services/interactionService';

/**
 * Custom hook for template page functionality
 * @returns {Object} Template page state and handlers
 */
const useTemplatePage = () => {
  const { t } = useTranslation();
  const { templateId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    isPublic: true,
    fields: []
  });
  
  // Get template from Redux store
  const { currentTemplate, isLoading, error } = useSelector(state => state.templates);
  
  // Fetch template data
  useEffect(() => {
    const perfKey = performanceMonitor.startPageLoad('TemplatePage');
    
    dispatch(fetchTemplateById(templateId))
      .unwrap()
      .then(() => {
        // Track page view
        interactionService.trackPageView(`/templates/${templateId}`, {
          templateId,
          source: document.referrer
        });
        
        performanceMonitor.endPageLoad(perfKey, true);
      })
      .catch((error) => {
        console.error('Error fetching template:', error);
        performanceMonitor.endPageLoad(perfKey, false);
      });
      
    return () => {
      // Cleanup if needed
    };
  }, [templateId, dispatch]);
  
  // Update form data when template changes
  useEffect(() => {
    if (currentTemplate) {
      setFormData({
        title: currentTemplate.title || '',
        description: currentTemplate.description || '',
        category: currentTemplate.category || '',
        isPublic: currentTemplate.is_public ?? true,
        fields: currentTemplate.fields || []
      });
    }
  }, [currentTemplate]);
  
  // Check if user is the owner of the template
  const isOwner = currentTemplate && user && currentTemplate.user_id === user.id;
  
  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);
  
  // Handle field changes
  const handleFieldChange = useCallback((index, field) => {
    setFormData(prev => {
      const updatedFields = [...prev.fields];
      updatedFields[index] = field;
      return { ...prev, fields: updatedFields };
    });
  }, []);
  
  // Add a new field
  const addField = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          id: `field_${Date.now()}`,
          type: 'text',
          label: '',
          placeholder: '',
          required: false,
          options: []
        }
      ]
    }));
  }, []);
  
  // Remove a field
  const removeField = useCallback((index) => {
    setFormData(prev => {
      const updatedFields = [...prev.fields];
      updatedFields.splice(index, 1);
      return { ...prev, fields: updatedFields };
    });
  }, []);
  
  // Move field up or down
  const moveField = useCallback((index, direction) => {
    setFormData(prev => {
      const updatedFields = [...prev.fields];
      if (direction === 'up' && index > 0) {
        [updatedFields[index], updatedFields[index - 1]] = [updatedFields[index - 1], updatedFields[index]];
      } else if (direction === 'down' && index < updatedFields.length - 1) {
        [updatedFields[index], updatedFields[index + 1]] = [updatedFields[index + 1], updatedFields[index]];
      }
      return { ...prev, fields: updatedFields };
    });
  }, []);
  
  // Save template changes
  const saveTemplate = useCallback(async () => {
    if (!formData.title.trim()) {
      toast.error(t('templates.titleRequired'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Track interaction
      interactionService.trackEvent('template_save', 'save_button', {
        templateId,
        fieldCount: formData.fields.length
      });
      
      await dispatch(updateTemplate({
        id: templateId,
        template: {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          is_public: formData.isPublic,
          fields: formData.fields
        }
      })).unwrap();
      
      toast.success(t('templates.saveSuccess'));
      setIsEditing(false);
    } catch (error) {
      toast.error(t('templates.saveError'));
      console.error('Error saving template:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, formData, templateId, t]);
  
  // Delete template
  const handleDeleteTemplate = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      // Track interaction
      interactionService.trackEvent('template_delete', 'delete_button', {
        templateId
      });
      
      await dispatch(deleteTemplate(templateId)).unwrap();
      
      toast.success(t('templates.deleteSuccess'));
      navigate('/dashboard/templates');
    } catch (error) {
      toast.error(t('templates.deleteError'));
      console.error('Error deleting template:', error);
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  }, [dispatch, templateId, navigate, t]);
  
  // Create submission URL
  const getSubmissionUrl = useCallback(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/submit/${templateId}`;
  }, [templateId]);
  
  // Copy submission URL to clipboard
  const copySubmissionUrl = useCallback(() => {
    const url = getSubmissionUrl();
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success(t('templates.urlCopied'));
        
        // Track interaction
        interactionService.trackEvent('copy_submission_url', 'copy_button', {
          templateId
        });
      })
      .catch(() => {
        toast.error(t('templates.urlCopyError'));
      });
  }, [getSubmissionUrl, templateId, t]);
  
  return {
    template: currentTemplate,
    isLoading,
    error,
    isEditing,
    setIsEditing,
    isSubmitting,
    formData,
    handleInputChange,
    handleFieldChange,
    addField,
    removeField,
    moveField,
    saveTemplate,
    isOwner,
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteTemplate,
    getSubmissionUrl,
    copySubmissionUrl
  };
};

export default useTemplatePage; 