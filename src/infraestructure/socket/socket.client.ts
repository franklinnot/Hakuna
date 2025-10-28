import { io, Socket } from 'socket.io-client';
import { API_URL } from '../api';

let socketClient: Socket | null = null;

export function getSocketClient(): Socket {
  if (!socketClient) {
    socketClient = io(API_URL, {
      autoConnect: false,
      withCredentials: true,
      // transports: ['websocket'], // más estable, evita polling
    });
  }
  return socketClient;
}

export async function connectSocket(token: string) {
  if (token.trim() === '') return;
  const socket = getSocketClient();
  if (socket.connected) return;

  socket.auth = { token };
  socket.connect();
  console.log('[Socket] Conectado con token', token.slice(0, 10));
}

export function disconnectSocket() {
  const socket = getSocketClient();
  if (socket.connected) {
    socket.disconnect();
    console.log('[Socket] Desconectado');
  }
}
