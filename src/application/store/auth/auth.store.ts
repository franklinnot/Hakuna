import { Paginas, TipoChats } from '../../../domain/enums';
import { StateCreator } from 'zustand';
import { IAppStore } from '../app.store.interface';

type IAuthActions = Pick<
  IAppStore,
  'setView' | 'setSession' | 'setUsuario' | 'logout'
>;

export const AuthStore: StateCreator<IAppStore, [], [], IAuthActions> = (
  set,
) => ({
  setView: (view) => set({ view }),

  setSession: ({ usuario, token }) => set({ usuario, token }),

  setUsuario: (data) => set({ usuario: data }),

  logout: () =>
    set({
      usuario: null,
      token: null,
      view: Paginas.PUBLIC,
      tipoChatsActivo: TipoChats.PRIVADO,
      id_chatActivo: null,
      chatsPrivados: [],
      chatsGrupales: [],
    }),
});
