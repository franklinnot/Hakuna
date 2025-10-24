import axios from 'axios';
import { useAuthStore } from '../application/auth/hooks/useAuthStore/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiSocket = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor para incluir token automáticamente
apiSocket.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error('Error en solicitud:', error);
    return Promise.reject(error);
  },
);

// interceptor para imprimir respuestas y errores globalmente
apiSocket.interceptors.response.use(
  (response) => {
    console.log('[API Socket] Respuesta:', response.data);
    return response;
  },
  (error) => {
    console.error('[API Socket] Error:', error);

    if (error.response?.status === 401) {
      console.warn('Sesión expirada. Cerrando sesión...');
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);
