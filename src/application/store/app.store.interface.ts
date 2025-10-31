import { IUsuarioResponse } from '../../domain/responses/usuarios.responses';
import { IAuthResponse } from '../../domain/responses/auth.responses';
import { Paginas, TipoChats } from '../../domain/enums';
import {
  IChatGrupalResponse,
  IChatPrivadoResponse,
} from '../../domain/responses/chats.responses';
import { IMensajePrivadoResponse, IMensajeResponse } from '../../domain/responses/mensajes.responses';

export interface IAppStore {
  // Propiedades
  usuario: IUsuarioResponse | null; // usuario logueado
  token: string | null; // token de la sesion
  view: Paginas; // que vista renderizar
  tipoChatsActivo: TipoChats; // que tipo de chats se debe mostrar
  // de que chat privado o grupal se deben mostrar los mensajes
  id_chatActivo: string | null;
  chatsPrivados: IChatPrivadoResponse[]; // historial de chats privados
  chatsGrupales: IChatGrupalResponse[]; // historial de chats grupales

  // Auth
  setView: (view: Paginas) => void;
  setSession: (data: IAuthResponse) => void;
  setUsuario: (data: IUsuarioResponse) => void;
  logout: () => void;

  // chats
  setTipoChatsActivo: (data: TipoChats) => void;
  setIdChatActivo: (id_chat: string) => void;
  getChatActivo: () => IChatPrivadoResponse | IChatGrupalResponse | null;

  // Chats privados
  setChatsPrivados: (data: IChatPrivadoResponse[]) => void;
  addChatPrivado: (data: IChatPrivadoResponse) => void;
  removeChatPrivado: (id_chat: string) => void;
  updateChatPrivado: (id_chat: string, data: IChatPrivadoResponse) => void;

  // chats grupales
  setChatsGrupales: (data: IChatGrupalResponse[]) => void;
  addChatGrupal: (data: IChatGrupalResponse) => void;
  removeChatGrupal: (id_chat: string) => void;
  updateChatGrupal: (data: IChatGrupalResponse) => void;

  // Mensajes privados
  addMensajeToChatPrivado: (
    id_chat: string,
    nuevoMensaje: IMensajePrivadoResponse,
  ) => void;
  updateMensajePrivado: (
    id_mensaje: string,
    data: IMensajePrivadoResponse,
  ) => void;
  // reemplazar datos de un mensaje temporal de un chat privado
  replaceMensajePrivadoTemporal: (
    oldChatId: string,
    tempMensajeId: string,
    serverMsg: IMensajePrivadoResponse,
  ) => void;

  // Mensajes grupales
  addMensajeToChatGrupal: (
    id_chat: string,
    nuevoMensaje: IMensajeResponse,
  ) => void;
  updateMensajeGrupal: (id_mensaje: string, data: Partial<IMensajeResponse>) => void;
  replaceMensajeGrupalTemporal: (
    id_chat: string,
    tempMensajeId: string,
    serverMsg: IMensajeResponse,
  ) => void;
}
