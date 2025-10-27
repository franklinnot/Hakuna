import { StateCreator } from 'zustand';
import { IAppStore } from '../app.store.interface';

type IChatsPrivadosStore = Pick<
  IAppStore,
  | 'setChatsPrivados'
  | 'addChatPrivado'
  | 'removeChatPrivado'
  | 'updateChatPrivado'
>;

export const ChatsPrivadosStore: StateCreator<
  IAppStore,
  [],
  [],
  IChatsPrivadosStore
> = (set) => ({
  setChatsPrivados: (data) => set({ chatsPrivados: data }),

  addChatPrivado: (data) =>
    set((state) => {
      const existe = state.chatsPrivados.some(
        (c) => c.id_chat === data.id_chat,
      );

      if (existe) {
        const actualizados = state.chatsPrivados.map((c) =>
          c.id_chat === data.id_chat ? { ...c, ...data } : c,
        );
        return { chatsPrivados: actualizados };
      }

      // Si es temporal y ya hay uno con el mismo usuarioB, no duplicamos
      if (data.is_temp) {
        const yaTemp = state.chatsPrivados.find(
          (c) =>
            c.is_temp && c.usuarioB.id_usuario === data.usuarioB.id_usuario,
        );
        if (yaTemp) return state;
      }

      return { chatsPrivados: [data, ...state.chatsPrivados] };
    }),

  removeChatPrivado: (id_chat) =>
    set((state) => ({
      chatsPrivados: state.chatsPrivados.filter(
        (chat) => chat.id_chat !== id_chat,
      ),
    })),

  updateChatPrivado: (id_chat, data) =>
    set((state) => {
      const chats = [...state.chatsPrivados];
      const index = chats.findIndex((c) => c.id_chat === id_chat);
      if (index === -1) return state;

      const existing = chats[index];

      // si data contiene un nuevo id_chat distinto → reemplazamos la info del chat en la misma posición
      const newId = data.id_chat ?? existing.id_chat;
      const updatedChat = {
        ...existing,
        ...data,
        id_chat: newId,
        historial_mensajes:
          data.historial_mensajes ?? existing.historial_mensajes,
        is_temp: data.is_temp ?? false,
      };

      // Si hay otro chat con el mismo newId y es distinto index, eliminarlo para evitar duplicados
      const otherIndex = chats.findIndex(
        (c, i) => c.id_chat === newId && i !== index,
      );
      if (otherIndex !== -1) {
        // eliminar el otro duplicado
        chats.splice(otherIndex, 1);
        // ajustar index si el otro estaba antes del actual
        const adjustedIndex = otherIndex < index ? index - 1 : index;
        chats[adjustedIndex] = updatedChat;
      } else {
        chats[index] = updatedChat;
      }

      return { chatsPrivados: chats };
    }),
});
