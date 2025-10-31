import { useEffect } from 'react';
import { getSocketClient } from '../../../infraestructure/socket/socket.client';
import { AppStore } from '../../store/app.store';
import { IMensajeResponse } from '../../../domain/responses/mensajes.responses';
import { TipoEvento } from '../../../domain/enums';

export const useRecibirMensajeGrupal = () => {
  const { addMensajeToChatGrupal } = AppStore();

  useEffect(() => {
    const socket = getSocketClient();

    const handleNuevoMensajeGrupal = (mensaje: IMensajeResponse) => {
      console.log('[Socket] Nuevo mensaje grupal recibido:', mensaje);
      addMensajeToChatGrupal(mensaje.id_chat, mensaje);
    };

    socket.on(TipoEvento.NUEVO_MENSAJE_GRUPAL, handleNuevoMensajeGrupal);
    return () => {
      socket.off(TipoEvento.NUEVO_MENSAJE_GRUPAL, handleNuevoMensajeGrupal);
    };
  }, []);
};
