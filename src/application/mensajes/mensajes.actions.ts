import { StateCreator } from 'zustand';
import { IUseAuthStore } from '../auth/hooks/useAuthStore/useAuthStore.interface';
import { IMensajeResponse } from './mensajes.responses';
import { IChatPrivadoResponse } from '../chats/chats.responses';

type IMensajesActions = Pick<
  IUseAuthStore,
  'updateMensajesChatPrivado' | 'updateMensajesChatGrupal'
>;

export const mensajesActions: StateCreator<IUseAuthStore, [], [], IMensajesActions> = (
  set,
) => ({
  updateMensajesChatPrivado: (
    id_chat: string,
    nuevoMensaje: IMensajeResponse,
  ) =>
    set((state) => {
      const chatsActualizados =
        state.chatsPrivados?.map((chat) => {
          if (chat.id_chat !== id_chat) return chat;

          // evitar duplicados de mensajes por id_mensaje
          const historialActualizado = [
            ...(chat.historial_mensajes ?? []).filter(
              (m) => m.id_mensaje !== nuevoMensaje.id_mensaje,
            ),
            nuevoMensaje,
          ];

          // crear una copia del chat con el nuevo historial y el último mensaje actualizado
          const chatActualizado: IChatPrivadoResponse = {
            ...chat,
            historial_mensajes: historialActualizado,
            ultimo_mensaje: nuevoMensaje,
          };

          return chatActualizado;
        }) ?? state.chatsPrivados;

      // si el chat activo es el mismo, también lo actualizamos
      const chatPrivadoActivo =
        state.chatPrivadoActivo?.id_chat === id_chat
          ? {
              ...state.chatPrivadoActivo,
              historial_mensajes: [
                ...(state.chatPrivadoActivo.historial_mensajes ?? []).filter(
                  (m) => m.id_mensaje !== nuevoMensaje.id_mensaje,
                ),
                nuevoMensaje,
              ],
              ultimo_mensaje: nuevoMensaje,
            }
          : state.chatPrivadoActivo;

      return { chatsPrivados: chatsActualizados, chatPrivadoActivo };
    }),

  updateMensajesChatGrupal: (id_chat: string, nuevoMensaje: IMensajeResponse) =>
    set((state) => {
      const chatsActualizados =
        state.chatsGrupales?.map((chat) => {
          if (chat.id_chat !== id_chat) return chat;

          // evitar duplicados de mensajes por id_mensaje
          const historialActualizado = [
            ...(chat.historial_mensajes ?? []).filter(
              (m) => m.id_mensaje !== nuevoMensaje.id_mensaje,
            ),
            nuevoMensaje,
          ];

          // crear una copia del chat con el nuevo historial y el último mensaje actualizado
          const chatActualizado = {
            ...chat,
            historial_mensajes: historialActualizado,
            ultimo_mensaje: nuevoMensaje,
          };

          return chatActualizado;
        }) ?? state.chatsGrupales;

      // si el chat activo es el mismo, también lo actualizamos
      const chatGrupalActivo =
        state.chatGrupalActivo?.id_chat === id_chat
          ? {
              ...state.chatGrupalActivo,
              historial_mensajes: [
                ...(state.chatGrupalActivo.historial_mensajes ?? []).filter(
                  (m) => m.id_mensaje !== nuevoMensaje.id_mensaje,
                ),
                nuevoMensaje,
              ],
              ultimo_mensaje: nuevoMensaje,
            }
          : state.chatGrupalActivo;

      return { chatsGrupales: chatsActualizados, chatGrupalActivo };
    }),
});
