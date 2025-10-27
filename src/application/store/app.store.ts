import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IAppStore } from './app.store.interface';
import { Paginas, TipoChats } from '../../domain/enums';
import { AuthStore } from './auth/auth.store';
import { ChatsStore } from './chats/chats.store';
import { ChatsPrivadosStore } from './chats/chats-privados.store';
import { ChatsGrupalesStore } from './chats/chats-grupales.store';
import { MensajesPrivadosStore } from './mensajes/mensajes-privados.store';
import { MensajesGrupalesStore } from './mensajes/mensajes-grupales.store';

// Store principal
export const AppStore = create<IAppStore>()(
  persist(
    (...args) => ({
      // Estado base
      usuario: null,
      token: null,
      view: Paginas.PUBLIC,
      tipoChatsActivo: TipoChats.PRIVADO,
      id_chatActivo: null,
      chatsPrivados: [],
      chatsGrupales: [],

      //
      ...AuthStore(...args),
      //
      ...ChatsStore(...args),
      ...ChatsPrivadosStore(...args),
      ...ChatsGrupalesStore(...args),
      //
      ...MensajesPrivadosStore(...args),
      ...MensajesGrupalesStore(...args),
    }),
    {
      name: 'hakuna-auth-storage',
    },
  ),
);

// rehidratación cuando el storage cambia en otra pestaña
window.addEventListener('storage', (e) => {
  if (e.key === 'hakuna-auth-storage') {
    AppStore.persist.rehydrate();
  }
});
