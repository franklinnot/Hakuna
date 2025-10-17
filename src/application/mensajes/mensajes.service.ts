import api from '../api';
import { IRespuesta } from '../../shared/application/response';
import { EnviarMensajePrivadoDto } from './mensajes.dtos';
import { IMensajeResponse } from './mensajes.responses';

export class MensajesService {
  private static ROUTE = '/mensajes';

  public static enviarMensajePrivado = async (
    dto: EnviarMensajePrivadoDto,
  ): Promise<IRespuesta<IMensajeResponse>> => {
    const { data } = await api.post(`${this.ROUTE}/privado`, dto);
    return data;
  };

  public static getMensajesPrivados = async (
    id_chat: string,
  ): Promise<IRespuesta<IMensajeResponse[]>> => {
    const { data } = await api.get(`${this.ROUTE}/privado/${id_chat}`);
    return data;
  };

  public static getMensajesGrupales = async (
    id_chat: string,
  ): Promise<IRespuesta<IMensajeResponse[]>> => {
    const { data } = await api.get(`${this.ROUTE}/grupal/${id_chat}`);
    return data;
  };
}
