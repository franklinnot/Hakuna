import api from "../../../api";
import type { Respuesta } from "../../../shared/application/types/respuesta.interface";
import type {Message} from '../domain/message.interface';

export class MessageService {
  private static AUTH_ROUTE = "/message";

  public static registerRequest = async (
    payload: Message
  ): Promise<Respuesta<Message>> => {
    const { data } = await api.post(`${this.AUTH_ROUTE}/create`, payload);
    return data;
  };

}