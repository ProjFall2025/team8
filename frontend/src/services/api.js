import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`, 
  // 👆 If your backend doesn’t use /api, change this to just process.env.REACT_APP_BACKEND_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔐 Token sent:', token); // optional, remove if you don’t want logs
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;