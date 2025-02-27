import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class UserService {
  async updateProfile(userData) {
    const response = await axios.put(`${API_URL}/users/profile`, userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data.user;
  }

  async searchUsers(query) {
    const response = await axios.get(`${API_URL}/users/search`, {
      params: { q: query }
    });
    return response.data;
  }
}

export default new UserService(); 