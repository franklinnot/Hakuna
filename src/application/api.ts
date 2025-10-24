import axios from 'axios';
import { useAuthStore } from './auth/hooks/useAuthStore/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor para incluir token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // token del store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// interceptor para imprimir respuestas y errores globalmente
api.interceptors.response.use(
  (response) => {
    console.log('Respuesta:', response.data);
    return response;
  },
  (error) => {
    console.log('Error:', error);
    return Promise.reject(error);
  },
);

export default api;
