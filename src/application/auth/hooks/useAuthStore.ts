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
      chatsPrivadosTemporales: null,
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

      // agregar un chat temporar a la lsita
      addChatPrivadoTemporal: (data) =>
        set((state) => {
          const actuales = state.chatsPrivadosTemporales ?? [];
          // evitar duplicados por id_chat o por usuario destino (usuarioB.id_usuario)
          const exists =
            actuales.some((c) => c.id_chat === data.id_chat) ||
            actuales.some(
              (c) =>
                c.usuarioB?.id_usuario &&
                data.usuarioB?.id_usuario &&
                c.usuarioB!.id_usuario === data.usuarioB!.id_usuario,
            );
          if (exists) return { chatsPrivadosTemporales: actuales };
          return { chatsPrivadosTemporales: [...actuales, data] };
        }),

      // reemplaza un temp chat por el chat real y lo agregarlo a chats privados
      replaceTempChat: (tempId: string, realChat: IChatPrivadoResponse) =>
        set((state) => {
          const temporales = (state.chatsPrivadosTemporales ?? []).filter(
            (c) => c.id_chat !== tempId,
          );

          // evitar duplicar en chatsPrivados si ya existe
          const prevPrivados = state.chatsPrivados ?? [];
          const alreadyExists =
            prevPrivados.some((c) => c.id_chat === realChat.id_chat) ||
            prevPrivados.some(
              (c) => c.usuarioB?.id_usuario === realChat.usuarioB?.id_usuario,
            );

          const nuevosPrivados = alreadyExists
            ? prevPrivados.map((c) =>
                c.id_chat === realChat.id_chat ? realChat : c,
              )
            : [realChat, ...prevPrivados]; // prepend para visibilidad

          return {
            chatsPrivados: nuevosPrivados,
            chatsPrivadosTemporales: temporales,
            chatPrivadoActivo: realChat,
          };
        }),

      // eliminar un chat privado temporal
      removeTempChat: (tempId: string) =>
        set((state) => ({
          chatsPrivadosTemporales: (state.chatsPrivadosTemporales ?? []).filter(
            (c) => c.id_chat !== tempId,
          ),
        })),

      //
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
                    ...(
                      state.chatPrivadoActivo.historial_mensajes ?? []
                    ).filter((m) => m.id_mensaje !== nuevoMensaje.id_mensaje),
                    nuevoMensaje,
                  ],
                  ultimo_mensaje: nuevoMensaje,
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
          chatsPrivadosTemporales: null,
          chatPrivadoActivo: null,
          chatGrupalActivo: null,
        }),
    }),
    {
      name: 'hakuna-auth-storage',
      // no persistir chats temporales (opcional: evita inconsistencias)
      partialize: (state) => {
        const { chatsPrivadosTemporales, ...rest } = state as any;
        return rest;
      },
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
