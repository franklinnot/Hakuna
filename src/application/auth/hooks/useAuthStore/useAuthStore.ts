/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUseAuthStore } from './useAuthStore.interface';
import { Paginas, TipoChats } from '../../../../shared/domain/enums';
import { authActions } from '../../auth.actions';
import { chatsActions } from '../../../chats/chats.actions';
import { mensajesActions } from '../../../mensajes/mensajes.actions';

// Store principal
export const useAuthStore = create<IUseAuthStore>()(
  persist(
    (...args) => ({
      // Estado base
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

      // Slices de acciones
      ...authActions(...args),
      ...chatsActions(...args),
      ...mensajesActions(...args),
    }),
    {
      name: 'hakuna-auth-storage',

      // Evita guardar chats temporales en localStorage
      partialize: (state) => {
        const { chatsPrivadosTemporales, ...rest } = state;
        return rest;
      },
    },
  ),
);

// rehidratación cuando el storage cambia en otra pestaña
window.addEventListener('storage', (e) => {
  if (e.key === 'hakuna-auth-storage') {
    useAuthStore.persist.rehydrate();
  }
});
