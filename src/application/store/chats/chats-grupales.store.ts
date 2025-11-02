import { StateCreator } from 'zustand';
import { IAppStore } from '../app.store.interface';
import { IChatGrupalResponse } from '../../../domain/responses/chats.responses';

type IChatsGrupalesStore = Pick<
  IAppStore,
  'setChatsGrupales' | 'addChatGrupal' | 'removeChatGrupal' | 'updateChatGrupal'
>;

export const ChatsGrupalesStore: StateCreator<
  IAppStore,
  [],
  [],
  IChatsGrupalesStore
> = (set) => ({
  setChatsGrupales: (data) => set({ chatsGrupales: data }),

  // Agrega un nuevo chat grupal (si no existe)
  addChatGrupal: (data: IChatGrupalResponse) =>
    set((state) => {
      const exists = state.chatsGrupales.some(
        (chat) => chat.id_chat === data.id_chat,
      );
      if (exists) return { chatsGrupales: state.chatsGrupales };

      // Agrega al inicio (más reciente primero)
      return { chatsGrupales: [data, ...state.chatsGrupales] };
    }),

  // elimina un chat grupal por id_chat
  removeChatGrupal: (id_chat: string) =>
    set((state) => {
      const filtrados = state.chatsGrupales.filter(
        (chat) => chat.id_chat !== id_chat,
      );

      return { chatsGrupales: filtrados };
    }),

  // actualiza un chat grupal existente (y el activo si corresponde)
  updateChatGrupal: (data: IChatGrupalResponse) =>
    set((state) => {
      const actualizados = state.chatsGrupales.map((chat) => {
        if (chat.id_chat !== data.id_chat) return chat;
        
        // Preservar el historial de mensajes existente si el nuevo data tiene menos mensajes
        const historialPreservado = data.historial_mensajes.length < chat.historial_mensajes.length
          ? chat.historial_mensajes
          : data.historial_mensajes;
        
        return {
          ...data,
          historial_mensajes: historialPreservado,
        };
      });

      return { chatsGrupales: actualizados };
    }),
});
