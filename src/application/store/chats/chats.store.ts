import { StateCreator } from 'zustand';
import { IAppStore } from '../app.store.interface';
import { TipoChats } from '../../../domain/enums';

type IChatsStore = Pick<
  IAppStore,
  'setTipoChatsActivo' | 'setIdChatActivo' | 'getChatActivo'
>;

export const ChatsStore: StateCreator<IAppStore, [], [], IChatsStore> = (
  set,
  get,
) => ({
  setTipoChatsActivo: (data: TipoChats) => set({ tipoChatsActivo: data }),

  // Define que chat está activo
  setIdChatActivo: (id_chat: string | null) => set({ id_chatActivo: id_chat }),

  // Retorna el chat actualmente activo según el tipo de chats visible
  getChatActivo: () => {
    const { id_chatActivo, chatsPrivados, chatsGrupales } = get();

    if (!id_chatActivo) return null;

    const result =
      chatsPrivados.find((c) => c.id_chat === id_chatActivo) || null;

    if (!result) {
      return chatsGrupales.find((c) => c.id_chat === id_chatActivo) || null;
    }

    return result;
  },
});
