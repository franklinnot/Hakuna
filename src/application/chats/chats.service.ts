import api from '../api';
import { IRespuesta } from '../../shared/application/response';
import { IChatPrivadoResponse } from './chats.responses';

export class ChatsService {
  private static ROUTE = '/chats';

  public static createChatPrivado = async (
    id_usuarioB: string,
  ): Promise<IRespuesta<IChatPrivadoResponse>> => {
    const { data } = await api.post(
      `${this.ROUTE}/create-privado/${id_usuarioB}`,
    );
    return data;
  };

  public static getChatsPrivados = async (): Promise<
    IRespuesta<IChatPrivadoResponse[]>
  > => {
    const { data } = await api.get(`${this.ROUTE}/get-privados`);
    return data;
  };
}
