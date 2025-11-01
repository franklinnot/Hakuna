import { api } from '../../api';
import { IRespuesta } from '../../../application/response';
import {
  IChatPrivadoResponse,
  IChatGrupalResponse,
} from '../../../domain/responses/chats.responses';

export class ChatsService {
  private static ROUTE = '/chats';

  public static getChatsPrivados = async (): Promise<
    IRespuesta<IChatPrivadoResponse[]>
  > => {
    const { data } = await api.get(`${this.ROUTE}/privados`);
    return data;
  };

  public static getChatsGrupales = async (): Promise<
    IRespuesta<IChatGrupalResponse[]>
  > => {
    const { data } = await api.get(`${this.ROUTE}/grupales`);
    return data;
  };

  public static getChatPrivado = async (
    id_chat: string,
  ): Promise<IRespuesta<IChatPrivadoResponse>> => {
    const { data } = await api.get(`${this.ROUTE}/privado/${id_chat}`);
    return data;
  };

  public static getChatGrupal = async (
    id_chat: string,
  ): Promise<IRespuesta<IChatGrupalResponse>> => {
    const { data } = await api.get(`${this.ROUTE}/grupal/${id_chat}`);
    return data;
  };

  public static createChatGrupal = async (datosGrupo: {
    nombre: string;
    descripcion: string;
    foto?: string;
    integrantes: { id_usuario: string }[];
  }): Promise<IRespuesta<IChatGrupalResponse>> => {
    const { data } = await api.post(`${this.ROUTE}/grupal`, datosGrupo);
    return data;
  };

  public static updateChatGrupal = async (
    id_chat: string,
    datosActualizacion: {
      nombre?: string;
      descripcion?: string;
      foto?: string | null;
    },
  ): Promise<IRespuesta<IChatGrupalResponse>> => {
    const { data } = await api.put(
      `${this.ROUTE}/grupal/${id_chat}`,
      datosActualizacion,
    );
    return data;
  };

  public static addMemberToGroup = async (
    id_chat: string,
    id_usuario: string,
  ): Promise<IRespuesta<IChatGrupalResponse>> => {
    const { data } = await api.post(
      `${this.ROUTE}/grupal/${id_chat}/miembros`,
      { id_usuario },
    );
    return data;
  };

  public static removeMemberFromGroup = async (
    id_chat: string,
    id_usuario: string,
  ): Promise<IRespuesta<IChatGrupalResponse>> => {
    const { data } = await api.delete(
      `${this.ROUTE}/grupal/${id_chat}/miembros/${id_usuario}`,
    );
    return data;
  };
}
