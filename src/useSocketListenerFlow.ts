import { useEffect } from 'react';
import { useRecibirMensajePrivado } from './application/use-cases/mensajes/useRecibirMensajePrivado';
import { useRecibirMensajeGrupal } from './application/use-cases/mensajes/useRecibirMensajeGrupal';
import { useRecibirNuevoIntegrante } from './application/use-cases/mensajes/useRecibirNuevoIntegrante';
import { connectSocket } from './infraestructure/socket/socket.client';
import { AppStore } from './application/store/app.store';

export const useSocketListenerFlow = () => {
  useRecibirMensajePrivado();
  useRecibirMensajeGrupal();
  useRecibirNuevoIntegrante();

  useEffect(() => {
    const token = AppStore.getState().token;
    if (token) connectSocket(token);
  }, []);

  // También reconecta el socket si el usuario cambia (por logout/login)
  const usuario = AppStore((state) => state.usuario);
  useEffect(() => {
    if (!usuario) return;
    const token = AppStore.getState().token;
    connectSocket(token ?? '');
  }, [usuario]);
};
