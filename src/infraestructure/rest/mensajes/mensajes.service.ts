import { api } from '../../api';
import { IRespuesta } from '../../../application/response';
import { EnviarMensajePrivadoDto } from './mensajes.dtos';
import { IMensajePrivadoResponse, IMensajeResponse } from '../../../domain/responses/mensajes.responses';

export class MensajesService {
  private static ROUTE = '/mensajes';

  public static enviarMensajePrivado = async (
    dto: EnviarMensajePrivadoDto,
  ): Promise<IRespuesta<IMensajePrivadoResponse>> => {
    const { data } = await api.post(
      `${this.ROUTE}/privado/${dto.id_usuarioB}`,
      {
        descripcion: dto.descripcion,
        archivos: dto.archivos,
      },
    );
    return data;
  };

  public static getMensajesPrivados = async (
    id_chat: string,
  ): Promise<IRespuesta<IMensajePrivadoResponse[]>> => {
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
