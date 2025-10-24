import { useEffect } from 'react';
import { socket } from '../../infraestructure/socket.client';
import { SOCKET_EVENTS } from '../../infraestructure/socket.events';
import { useAuthStore } from '../../application/auth/hooks/useAuthStore/useAuthStore';
import { IMensajeResponse } from '../../application/mensajes/mensajes.responses';

export const useSocketListener = () => {
  const { usuario, updateMensajesChatPrivado, updateMensajesChatGrupal } =
    useAuthStore();

  useEffect(() => {
    if (!usuario) return;

    console.log('[SocketListener] Activado para', usuario.username);

    const handleNuevoMensajePrivado = (mensaje: IMensajeResponse) => {
      console.log('[Socket] Nuevo mensaje privado recibido:', mensaje);
      updateMensajesChatPrivado(mensaje.id_chat, mensaje);
    };

    const handleNuevoMensajeGrupal = (mensaje: IMensajeResponse) => {
      console.log('[Socket] Nuevo mensaje grupal recibido:', mensaje);
      updateMensajesChatGrupal(mensaje.id_chat, mensaje);
    };

    socket.on(SOCKET_EVENTS.MENSAJE_PRIVADO, handleNuevoMensajePrivado);
    socket.on(SOCKET_EVENTS.MENSAJE_GRUPAL, handleNuevoMensajeGrupal);

    return () => {
      socket.off(SOCKET_EVENTS.MENSAJE_PRIVADO, handleNuevoMensajePrivado);
      socket.off(SOCKET_EVENTS.MENSAJE_GRUPAL, handleNuevoMensajeGrupal);
    };
  }, [usuario]);
};
