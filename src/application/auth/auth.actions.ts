import { Paginas, TipoChats } from '../../shared/domain/enums';
import { IAuthResponse } from './auth.responses';
import { IUsuarioResponse } from '../usuarios/usuarios.responses';
import { StateCreator } from 'zustand';
import { IUseAuthStore } from './hooks/useAuthStore/useAuthStore.interface';

type IAuthActions = Pick<
  IUseAuthStore,
  'setView' | 'setSession' | 'setUsuario' | 'logout'
>;

export const authActions: StateCreator<IUseAuthStore, [], [], IAuthActions> = (
  set,
) => ({
  setView: (view: Paginas) => set({ view }),

  setSession: ({ usuario, token }: IAuthResponse) =>
    set({ usuario, token, isAuthenticated: true }),

  setUsuario: (data: IUsuarioResponse) => set({ usuario: data }),

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
});
