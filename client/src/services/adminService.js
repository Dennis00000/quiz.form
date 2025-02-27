import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class AdminService {
  async getUsers() {
    const response = await axios.get(`${API_URL}/admin/users`);
    return response.data;
  }

  async toggleUserStatus(userId) {
    const response = await axios.post(`${API_URL}/admin/users/${userId}/toggle-status`);
    return response.data;
  }

  async toggleUserRole(userId) {
    const response = await axios.post(`${API_URL}/admin/users/${userId}/toggle-role`);
    return response.data;
  }
}

export default new AdminService(); 