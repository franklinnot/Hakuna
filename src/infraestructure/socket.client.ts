import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../application/auth/hooks/useAuthStore/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const socket: Socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    token: useAuthStore.getState().token, // <--- se envía al handshake
  },
});

export function connectSocket(token: string | null) {
  if (!token) return;
  if (socket.connected) return;

  socket.auth = { token }; // reenviar el token al reconectar
  socket.connect();
  console.log('[Socket] Conectado con token JWT');
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
    console.log('[Socket] Desconectado');
  }
}
