import axios from 'axios';
import { useAuthStore } from './auth/hooks/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

// incluir el jwt en las peticiones
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

// imprimir siempre las respuesta de la api
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
