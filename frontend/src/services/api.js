import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
=======
  baseURL: process.env.REACT_APP_BACKEND_URL,
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
<<<<<<< HEAD
  console.log('🔐 Token sent:', token);
=======
>>>>>>> 1cff3b005ec95393bd523a7d6f77e9d0c64425d0
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;