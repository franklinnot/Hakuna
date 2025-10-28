import { useEffect } from 'react';
import { getSocketClient } from '../../../infraestructure/socket/socket.client';
import { AppStore } from '../../store/app.store';
import { IMensajePrivadoResponse } from '../../../domain/responses/mensajes.responses';
import { TipoEvento } from '../../../domain/enums';
import { ChatsService } from '../../../infraestructure/rest/chats/chats.service';
import { IChatPrivadoResponse } from '../../../domain/responses/chats.responses';

export const useRecibirMensajePrivado = () => {
  const { addMensajeToChatPrivado, addChatPrivado } = AppStore();
  const { getChatActivo, setIdChatActivo } = AppStore();

  useEffect(() => {
    const socket = getSocketClient();

    const handleNuevoMensajePrivado = async (
      mensaje: IMensajePrivadoResponse,
    ) => {
      const usuario = AppStore.getState().usuario;
      const chatsPrivados = AppStore.getState().chatsPrivados;
      console.log('[Socket] Chats privados', chatsPrivados);
      console.log('[Socket] Mensaje recibido', mensaje);

      // Si el emisor es el mismo usuario logueado
      if (mensaje.id_usuario == usuario!.id_usuario) {
        // Verificamos si ya existe el chat
        const chatExistente = chatsPrivados.find(
          (chat) =>
            chat.id_chat == mensaje.id_chat ||
            chat.usuarioB.id_usuario == mensaje.id_usuarioB ||
            chat.historial_mensajes.some(
              (m) =>
                m.id_mensaje == mensaje.id_mensaje ||
                m.id_chat == mensaje.id_chat ||
                m.id_usuarioB == mensaje.id_usuarioB,
            ),
        );

        if (!chatExistente) {
          console.log('[Socket] Chat no existente - misma sesión');
          const rpta = await ChatsService.getChatPrivado(mensaje.id_chat);
          if (!rpta.success || !rpta.data) return;
          console.log('[Socket] YO MISMO - Nuevo chat privado', mensaje);
          addChatPrivado({
            ...rpta.data,
            historial_mensajes: [mensaje],
            ultimo_mensaje: mensaje,
          });
        } else {
          console.log('[Socket] YO MISMO - Chat existente', chatExistente);
          addMensajeToChatPrivado(chatExistente.id_chat, mensaje);
        }
        return;
      }

      // Si el mensaje viene de otro usuario
      const chatExistente = chatsPrivados.find(
        (chat) =>
          chat.id_chat == mensaje.id_chat ||
          chat.usuarioB.id_usuario == mensaje.id_usuarioB ||
          chat.historial_mensajes.some(
            (m) =>
              m.id_mensaje == mensaje.id_mensaje ||
              m.id_chat == mensaje.id_chat ||
              m.id_usuarioB == mensaje.id_usuario,
          ),
      );

      if (!chatExistente) {
        console.log('[Socket] OTRO Chat no existente');
        const rpta = await ChatsService.getChatPrivado(mensaje.id_chat);
        if (!rpta.success || !rpta.data) return;
        console.log('[Socket] OTRO - Nuevo chat privado', mensaje);
        addChatPrivado({
          ...rpta.data,
          historial_mensajes: [mensaje],
          ultimo_mensaje: mensaje,
        });

        const chatActivo = getChatActivo();
        if (
          chatActivo &&
          !chatActivo.is_group &&
          ((chatActivo as IChatPrivadoResponse).id_chat == mensaje.id_chat ||
            (chatActivo as IChatPrivadoResponse).usuarioB.id_usuario ==
              mensaje.id_usuario)
        ) {
          console.log(
            '[Socket] OTRO - Actualizando chat activo',
            mensaje.id_chat,
          );
          setIdChatActivo(mensaje.id_chat);
        }
      } else {
        console.log('[Socket] OTRO - Chat existente', chatExistente);
        addMensajeToChatPrivado(chatExistente.id_chat, mensaje);
      }
    };

    socket.on(TipoEvento.NUEVO_MENSAJE_PRIVADO, handleNuevoMensajePrivado);
    return () => {
      socket.off(TipoEvento.NUEVO_MENSAJE_PRIVADO, handleNuevoMensajePrivado);
    };
  }, []);
};
