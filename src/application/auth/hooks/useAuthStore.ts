import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUseAuthStore } from './useAuthStore.interface';
import { Paginas, TipoChats } from '../../../shared/domain/enums';

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
