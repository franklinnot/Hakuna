import { StateCreator } from 'zustand';
import { IAppStore } from '../app.store.interface';
import { IMensajeResponse } from '../../../domain/responses/mensajes.responses';
import { IChatGrupalResponse } from '../../../domain/responses/chats.responses';

type IMensajesActions = Pick<IAppStore, 'addMensajeToChatGrupal' | 'replaceMensajeGrupalTemporal' | 'updateMensajeGrupal'>;

export const MensajesGrupalesStore: StateCreator<
  IAppStore,
  [],
  [],
  IMensajesActions
> = (set) => ({
  addMensajeToChatGrupal: (id_chat: string, nuevoMensaje: IMensajeResponse) =>
    set((state) => {
      // Actualizar el historial de mensajes del chat grupal correspondiente
      const chatsGrupalesActualizados = state.chatsGrupales.map((chat) => {
        if (chat.id_chat !== id_chat) return chat;

        const historialActualizado = [
          ...chat.historial_mensajes.filter(
            (m) => m.id_mensaje !== nuevoMensaje.id_mensaje,
          ),
          nuevoMensaje,
        ];

        return {
          ...chat,
          historial_mensajes: historialActualizado,
          ultimo_mensaje: nuevoMensaje,
        } as IChatGrupalResponse;
      });

      return {
        chatsGrupales: chatsGrupalesActualizados,
      };
    }),

  replaceMensajeGrupalTemporal: (
    id_chat: string,
    tempMensajeId: string,
    serverMsg: IMensajeResponse,
  ) =>
    set((state) => {
      const chatsGrupalesActualizados = state.chatsGrupales.map((chat) => {
        if (chat.id_chat !== id_chat) return chat;

        const historialActualizado = chat.historial_mensajes.map((m) =>
          m.id_mensaje === tempMensajeId ? serverMsg : m,
        );

        return {
          ...chat,
          historial_mensajes: historialActualizado,
          ultimo_mensaje: serverMsg,
        } as IChatGrupalResponse;
      });

      return {
        chatsGrupales: chatsGrupalesActualizados,
      };
    }),

  updateMensajeGrupal: (id_mensaje: string, mensajeActualizado: Partial<IMensajeResponse>) =>
    set((state) => {
      const chatsGrupalesActualizados = state.chatsGrupales.map((chat) => {
        const historialActualizado = chat.historial_mensajes.map((m) =>
          m.id_mensaje === id_mensaje ? { ...m, ...mensajeActualizado } : m,
        );

        // Si el mensaje actualizado es el último mensaje, también actualizarlo
        const ultimoMensaje = chat.ultimo_mensaje?.id_mensaje === id_mensaje
          ? { ...chat.ultimo_mensaje, ...mensajeActualizado }
          : chat.ultimo_mensaje;

        return {
          ...chat,
          historial_mensajes: historialActualizado,
          ultimo_mensaje: ultimoMensaje,
        } as IChatGrupalResponse;
      });

      return {
        chatsGrupales: chatsGrupalesActualizados,
      };
    }),
});
