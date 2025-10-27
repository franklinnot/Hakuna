import { StateCreator } from 'zustand';
import { IAppStore } from '../app.store.interface';
import { IMensajeResponse } from '../../../domain/responses/mensajes.responses';
import { IChatGrupalResponse } from '../../../domain/responses/chats.responses';

type IMensajesActions = Pick<IAppStore, 'addMensajeToChatGrupal'>;

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
});
