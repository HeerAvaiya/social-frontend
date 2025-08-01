import axios from 'axios';
const API_URL = 'http://localhost:8001/api/users';

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

const register = async (credentials) => {
  const response = await axios.post(`${API_URL}/register`, credentials);
  return response.data;
};

const logout = async () => {
  localStorage.removeItem('token');
};

const authService = { login, register, logout };
export default authService;
