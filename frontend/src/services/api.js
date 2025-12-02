import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // <--- REMOVE THE '/api' HERE
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
