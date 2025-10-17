import { IUsuarioResponse } from '../../usuarios/usuarios.responses';
import { IAuthResponse } from '../auth.responses';
import { Paginas, TipoChats } from '../../../shared/domain/enums';
import {
  IChatGrupalResponse,
  IChatPrivadoResponse,
} from '../../chats/chats.responses';
import { IMensajeResponse } from '../../mensajes/mensajes.responses';

export interface IUseAuthStore {
  usuario: IUsuarioResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  view: Paginas;
  // que tipo de chats se debe mostrar
  tipoChatsActivo: TipoChats;
  // historial de chats privados
  chatsPrivados: IChatPrivadoResponse[] | null;
  // historial de chats grupales
  chatsGrupales: IChatGrupalResponse[] | null;
  // de que chat privado se deben mostrar los mensajes
  chatPrivadoActivo: IChatPrivadoResponse | null;
  // de que chat grupal se deben mostrar los mensajes
  chatGrupalActivo: IChatGrupalResponse | null;
  updateMensajesChatPrivado: (
    id_chat: string,
    nuevoMensaje: IMensajeResponse,
  ) => void;

  // acciones
  setView: (view: Paginas) => void;
  setSession: (data: IAuthResponse) => void;
  setUsuario: (data: IUsuarioResponse) => void;
  setTipoChatsActivo: (data: TipoChats) => void;
  setChatsPrivados: (data: IChatPrivadoResponse[]) => void;
  setChatsGrupales: (data: IChatGrupalResponse[]) => void;
  setChatPrivadoActivo: (data: IChatPrivadoResponse) => void;
  setChatGrupalActivo: (data: IChatGrupalResponse) => void;
  logout: () => void;
}
