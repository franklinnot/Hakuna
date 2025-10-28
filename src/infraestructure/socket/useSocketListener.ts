import { useEffect } from 'react';
import { getSocketClient } from './socket.client';
import { AppStore } from '../../application/store/app.store';
import {
  IMensajePrivadoResponse,
  IMensajeResponse,
} from '../../domain/responses/mensajes.responses';
import { TipoEvento } from '../../domain/enums';
import { ChatsService } from '../rest/chats/chats.service';
import { IChatPrivadoResponse } from '../../domain/responses/chats.responses';

export const useSocketListener = () => {
  const { addMensajeToChatPrivado, addMensajeToChatGrupal, addChatPrivado } =
    AppStore();
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

      // si la persona que envia es igual a la persona que esta logueada
      if (mensaje.id_usuario == usuario!.id_usuario) {
        // si es que me esta llegando a mi mismo, pero desde otra sesion,  buscare ese chat
        // y verificare si lo tengo

        // va a existir si tengo algun chat con ese id o
        // si en alguno de los mensajes tiene los mismos datos del que esta llegando y ademas el chat que tengo es temporal
        const chatExistente = chatsPrivados.find(
          (chat) =>
            chat.id_chat == mensaje.id_chat ||
            chat.usuarioB.id_usuario == mensaje.id_usuarioB ||
            chat.historial_mensajes.some(
              (m) =>
                m.id_mensaje == mensaje.id_mensaje ||
                m.id_chat == mensaje.id_chat ||
                // m.id_usuario == mensaje.id_usuario ||
                m.id_usuarioB == mensaje.id_usuarioB,
            ),
        );

        // solo si no se encontro ese chat, lo agregaremos
        if (!chatExistente) {
          console.log('[Socket] Chat no existente');
          // me ha llegado a mi mismo, pero en otra esion
          const rpta = await ChatsService.getChatPrivado(mensaje.id_chat);
          if (!rpta.success || !rpta.data) return;
          console.log('[Socket] YO MISMO - Nuevo chat privado', mensaje);
          addChatPrivado({
            ...rpta.data,
            historial_mensajes: [mensaje],
            ultimo_mensaje: mensaje,
          });
        } else {
          console.log('[Socket] yo mismo Chat existente', chatExistente);
          addMensajeToChatPrivado(chatExistente.id_chat, mensaje);
        }
        console.log('Llego mi mismo mensaje privado');
        return;
      } else {
        // si soy el usuario receptor, verificare si el mensaje que ha llegado pertenece
        // a uno de los chats que tengo localmente
        const chatExistente = chatsPrivados.find(
          (chat) =>
            chat.id_chat == mensaje.id_chat ||
            chat.usuarioB.id_usuario == mensaje.id_usuarioB ||
            chat.historial_mensajes.some(
              (m) =>
                m.id_mensaje == mensaje.id_mensaje ||
                m.id_chat == mensaje.id_chat ||
                // m.id_usuario == mensaje.id_usuario
                m.id_usuarioB == mensaje.id_usuario, // el usuario b de este chat es igual al que esta enviado este mensaje
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
          console.log('OTRO chat activo', chatActivo);
          if (
            (chatActivo &&
              !chatActivo.is_group &&
              (chatActivo as IChatPrivadoResponse).id_chat ==
                mensaje.id_chat) ||
            (chatActivo as IChatPrivadoResponse).usuarioB.id_usuario ==
              mensaje.id_usuario
          ) {
            console.log('OTRO cambiando id de chat activo', mensaje.id_chat);
            setIdChatActivo(mensaje.id_chat);
          }
        } else {
          console.log('[Socket] OTRO Chat existente', chatExistente);
          addMensajeToChatPrivado(chatExistente.id_chat, mensaje);
          console.log('[Socket] OTRO Nuevo mensaje privado', mensaje);
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
