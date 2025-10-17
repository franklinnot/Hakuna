import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUseAuthStore } from './useAuthStore.interface';
import { Paginas, TipoChats } from '../../../shared/domain/enums';
import { IMensajeResponse } from '../../mensajes/mensajes.responses';
import { IChatPrivadoResponse } from '../../chats/chats.responses';

export const useAuthStore = create<IUseAuthStore>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,
      view: Paginas.PUBLIC,
      tipoChatsActivo: TipoChats.PRIVADO,
      chatsPrivados: null,
      chatsGrupales: null,
      chatPrivadoActivo: null,
      chatGrupalActivo: null,

      setView: (view) => set({ view }),

      setSession: ({ usuario, token }) =>
        set({
          usuario,
          token: token,
          isAuthenticated: true,
          view: Paginas.CHATS,
        }),

      setUsuario: (data) => set({ usuario: data }),
      setTipoChatsActivo: (data) => set({ tipoChatsActivo: data }),
      setChatsPrivados: (data) => set({ chatsPrivados: data }),
      setChatsGrupales: (data) => set({ chatsGrupales: data }),
      setChatPrivadoActivo: (data) => set({ chatPrivadoActivo: data }),
      setChatGrupalActivo: (data) => set({ chatGrupalActivo: data }),
      // updateMensajesChatPrivado
      updateMensajesChatPrivado: (
        id_chat: string,
        nuevoMensaje: IMensajeResponse,
      ) =>
        set((state) => {
          const chatsActualizados =
            state.chatsPrivados?.map((chat) => {
              if (chat.id_chat !== id_chat) return chat;

              const historialActualizado = chat.historial_mensajes
                ? [...chat.historial_mensajes, nuevoMensaje]
                : [nuevoMensaje];

              // crear una copia del chat con el nuevo historial y el último mensaje actualizado
              const chatActualizado: IChatPrivadoResponse = {
                ...chat,
                historial_mensajes: historialActualizado,
                ultimo_mensaje: nuevoMensaje, // ✅ sincroniza el último mensaje
              };

              return chatActualizado;
            }) ?? state.chatsPrivados;

          // si el chat activo es el mismo, también lo actualizamos
          const chatPrivadoActivo =
            state.chatPrivadoActivo?.id_chat === id_chat
              ? {
                  ...state.chatPrivadoActivo,
                  historial_mensajes: [
                    ...(state.chatPrivadoActivo.historial_mensajes ?? []),
                    nuevoMensaje,
                  ],
                }
              : state.chatPrivadoActivo;

          return { chatsPrivados: chatsActualizados, chatPrivadoActivo };
        }),

      logout: () =>
        set({
          usuario: null,
          token: null,
          isAuthenticated: false,
          view: Paginas.PUBLIC,
          tipoChatsActivo: TipoChats.PRIVADO,
          chatsPrivados: null,
          chatsGrupales: null,
          chatPrivadoActivo: null,
          chatGrupalActivo: null,
        }),
    }),
    {
      name: 'hakuna-auth-storage',
    },
  ),
);

// un listener cada que se actualiza el local storgae
window.addEventListener('storage', (e) => {
  // verificamos que el cambio fue en la clave de nuestro store
  if (e.key == 'hakuna-auth-storage') {
    // forzamos al store a releer los datos desde local Storage
    useAuthStore.persist.rehydrate();
  }
});
