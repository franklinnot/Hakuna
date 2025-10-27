import axios from 'axios';
import { AppStore } from '../application/store/app.store';

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
    const token = AppStore.getState().token; // token del store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API] Error en solicitud:', error);
    return Promise.reject(error);
  },
);

// interceptor para imprimir respuestas y errores globalmente
api.interceptors.response.use(
  (response) => {
    console.log('[API] Respuesta:', response.data);
    return response;
  },
  (error) => {
    console.log('[API] Error:', error);

    if (error.response?.status == 401) {
      console.warn('[API] Sesión expirada. Cerrando sesión...');
      AppStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export { api, API_URL };
