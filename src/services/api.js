import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'https://api.cercamio.app/api', // 🔥 TU DOMINIO REAL
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Inyecta el token en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;