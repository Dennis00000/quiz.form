import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const templateService = {
  async getTemplates(filters = {}) {
    const response = await axios.get(`${API_URL}/templates`, { params: filters });
    return response.data;
  },

  async getTemplateById(id) {
    const response = await axios.get(`${API_URL}/templates/${id}`);
    return response.data;
  },

  async createTemplate(templateData) {
    const response = await axios.post(`${API_URL}/templates`, templateData);
    return response.data;
  },

  async updateTemplate(id, templateData) {
    const response = await axios.put(`${API_URL}/templates/${id}`, templateData);
    return response.data;
  },

  async deleteTemplate(id) {
    await axios.delete(`${API_URL}/templates/${id}`);
  },

  async getTemplatesByTag(tag) {
    const response = await axios.get(`${API_URL}/templates/tags/${tag}`);
    return response.data;
  },

  async submitResponse(templateId, data) {
    const { sendEmailCopy, ...responseData } = data;
    const response = await axios.post(`${API_URL}/templates/${templateId}/responses`, {
      data: responseData,
      sendEmailCopy
    });
    return response.data;
  },
};

export default templateService; 