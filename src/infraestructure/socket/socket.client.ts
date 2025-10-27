import { io, Socket } from 'socket.io-client';
import { API_URL } from '../api';
import { AppStore } from '../../application/store/app.store';

export const socketClient: Socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    token: AppStore.getState().token,
  },
});

export function connectSocket(token: string) {
  if (socketClient.connected) return;

  socketClient.auth = { token }; // reenviar el token al reconectar
  socketClient.connect();
  console.log('[Socket] Conectado');
}

export function disconnectSocket() {
  if (socketClient.connected) {
    socketClient.disconnect();
    console.log('[Socket] Desconectado');
  }
}
