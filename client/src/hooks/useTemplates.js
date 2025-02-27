import { useState, useCallback } from 'react';
import templateService from '../services/templateService';

export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTemplates = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getTemplates(filters);
      setTemplates(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (templateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await templateService.createTemplate(templateData);
      setTemplates(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create template');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTemplate = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getTemplateById(id);
      setTemplate(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching template:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    templates,
    template,
    loading,
    error,
    fetchTemplates,
    fetchTemplate,
    createTemplate,
  };
}; 