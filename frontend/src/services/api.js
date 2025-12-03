import axios from 'axios';

const api = axios.create({
  baseURL: 'https://team8-backend-1mvl.onrender.com/api', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔐 Token sent:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
