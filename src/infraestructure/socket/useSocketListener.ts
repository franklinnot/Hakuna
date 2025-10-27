import { useEffect } from 'react';
import { socketClient } from './socket.client';
import { AppStore } from '../../application/store/app.store';
import { IMensajeResponse } from '../../domain/responses/mensajes.responses';
import { TipoEvento } from '../../domain/enums';

export const useSocketListener = () => {
  const { addMensajeToChatPrivado, addMensajeToChatGrupal } = AppStore();

  useEffect(() => {
    const handleNuevoMensajePrivado = (mensaje: IMensajeResponse) => {
      console.log('[Socket] Nuevo mensaje privado recibido:', mensaje);
      addMensajeToChatPrivado(mensaje.id_chat, mensaje);
    };

    const handleNuevoMensajeGrupal = (mensaje: IMensajeResponse) => {
      console.log('[Socket] Nuevo mensaje grupal recibido:', mensaje);
      addMensajeToChatGrupal(mensaje.id_chat, mensaje);
    };

    socketClient.on(
      TipoEvento.NUEVO_MENSAJE_PRIVADO,
      handleNuevoMensajePrivado,
    );

    socketClient.on(TipoEvento.NUEVO_MENSAJE_GRUPAL, handleNuevoMensajeGrupal);
  }, []);
};
