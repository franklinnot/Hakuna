import { useEffect } from 'react';
import { getSocketClient } from './socket.client';
import { AppStore } from '../../application/store/app.store';
import {
  IMensajePrivadoResponse,
  IMensajeResponse,
} from '../../domain/responses/mensajes.responses';
import { TipoEvento } from '../../domain/enums';
import { ChatsService } from '../rest/chats/chats.service';

export const useSocketListener = () => {
  const { addMensajeToChatPrivado, addMensajeToChatGrupal, addChatPrivado } =
    AppStore();

  useEffect(() => {
    const socket = getSocketClient();
    const handleNuevoMensajePrivado = async (
      mensaje: IMensajePrivadoResponse,
    ) => {
      const usuario = AppStore.getState().usuario;
      // si la persona que envia es igual a la persona que esta logueada
      if (mensaje.id_usuario == usuario!.id_usuario) {
        console.log('Llego mi mismo mensaje privado');
        return;
      } else {
        // si soy el usuario receptor, verificare si el mensaje que ha llegado pertenece
        // a uno de los chats que tengo localmente
        const chatsPrivados = AppStore.getState().chatsPrivados;
        const chatExistente = chatsPrivados.find(
          (chat) => chat.id_chat === mensaje.id_chat,
        );
        if (!chatExistente) {
          const rpta = await ChatsService.getChatPrivado(mensaje.id_chat);
          if (!rpta.success || !rpta.data) return;
          console.log('[Socket] Nuevo chat privado', mensaje);
          addChatPrivado({
            ...rpta.data,
            historial_mensajes: [mensaje],
            ultimo_mensaje: mensaje,
          });
        } else {
          addMensajeToChatPrivado(chatExistente.id_chat, mensaje);
          console.log('[Socket] Nuevo mensaje privado', mensaje);
        }
      }
    };

    const handleNuevoMensajeGrupal = (mensaje: IMensajeResponse) => {
      console.log('[Socket] Nuevo mensaje grupal recibido:', mensaje);
      addMensajeToChatGrupal(mensaje.id_chat, mensaje);
    };

    socket.on(TipoEvento.NUEVO_MENSAJE_PRIVADO, handleNuevoMensajePrivado);

    socket.on(TipoEvento.NUEVO_MENSAJE_GRUPAL, handleNuevoMensajeGrupal);
  }, []);
};
