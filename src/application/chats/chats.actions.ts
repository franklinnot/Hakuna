import { StateCreator } from 'zustand';
import { IUseAuthStore } from '../auth/hooks/useAuthStore/useAuthStore.interface';

type IChatsActions = Pick<
  IUseAuthStore,
  | 'setChatsPrivados'
  | 'addChatPrivadoTemporal'
  | 'replaceTempChat'
  | 'removeTempChat'
  | 'setChatPrivadoActivo'
  | 'setTipoChatsActivo'
  | 'setChatsGrupales'
  | 'setChatGrupalActivo'
  | 'addChatGrupal'
  | 'updateChatGrupal'
>;

export const chatsActions: StateCreator<IUseAuthStore, [], [], IChatsActions> = (
  set,
) => ({
  setChatsPrivados: (data) => set({ chatsPrivados: data }),
  setChatsGrupales: (data) => set({ chatsGrupales: data }),
  setTipoChatsActivo: (data) => set({ tipoChatsActivo: data }),
  setChatGrupalActivo: (data) => set({ chatGrupalActivo: data }),
  setChatPrivadoActivo: (data) => set({ chatPrivadoActivo: data }),

  addChatPrivadoTemporal: (data) =>
    set((state) => {
      const actuales = state.chatsPrivadosTemporales ?? [];

      const exists =
        actuales.some((c) => c.id_chat === data.id_chat) ||
        actuales.some(
          (c) =>
            c.usuarioB?.id_usuario &&
            data.usuarioB?.id_usuario &&
            c.usuarioB.id_usuario === data.usuarioB.id_usuario,
        );

      return exists
        ? { chatsPrivadosTemporales: actuales }
        : { chatsPrivadosTemporales: [...actuales, data] };
    }),

  replaceTempChat: (tempId, realChat) =>
    set((state) => {
      const temporales = (state.chatsPrivadosTemporales ?? []).filter(
        (c) => c.id_chat !== tempId,
      );

      const prevPrivados = state.chatsPrivados ?? [];

      const exists =
        prevPrivados.some((c) => c.id_chat === realChat.id_chat) ||
        prevPrivados.some(
          (c) => c.usuarioB?.id_usuario === realChat.usuarioB?.id_usuario,
        );

      const nuevosPrivados = exists
        ? prevPrivados.map((c) =>
            c.id_chat === realChat.id_chat ? realChat : c,
          )
        : [realChat, ...prevPrivados];

      return {
        chatsPrivados: nuevosPrivados,
        chatsPrivadosTemporales: temporales,
        chatPrivadoActivo: realChat,
      };
    }),

  removeTempChat: (tempId) =>
    set((state) => ({
      chatsPrivadosTemporales: (state.chatsPrivadosTemporales ?? []).filter(
        (c) => c.id_chat !== tempId,
      ),
    })),

  addChatGrupal: (data) =>
    set((state) => {
      const chatsActuales = state.chatsGrupales ?? [];
      // Evitar duplicados por id_chat
      const exists = chatsActuales.some((c) => c.id_chat === data.id_chat);
      if (exists) return { chatsGrupales: chatsActuales };
      // Agregar al inicio de la lista para que aparezca primero
      return { chatsGrupales: [data, ...chatsActuales] };
    }),

  updateChatGrupal: (data) =>
    set((state) => {
      const chatsActuales = state.chatsGrupales ?? [];
      const chatsActualizados = chatsActuales.map((chat) =>
        chat.id_chat === data.id_chat ? data : chat,
      );

      // También actualizar el chat grupal activo si es el mismo
      const chatGrupalActivoActualizado =
        state.chatGrupalActivo?.id_chat === data.id_chat
          ? data
          : state.chatGrupalActivo;

      return {
        chatsGrupales: chatsActualizados,
        chatGrupalActivo: chatGrupalActivoActualizado,
      };
    }),
});
