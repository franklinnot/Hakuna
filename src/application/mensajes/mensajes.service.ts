import api from '../api';
import { IRespuesta } from '../../shared/application/response';
import { EnviarMensajePrivadoDto } from './mensajes.dtos';
import { IMensajeResponse } from './mensajes.responses';

export class UsuariosService {
  private static ROUTE = '/`mensajes`';

  public static enviarMensajePrivado = async (
    dto: EnviarMensajePrivadoDto,
  ): Promise<IRespuesta<IMensajeResponse>> => {
    const { data } = await api.post(`${this.ROUTE}/privado`, dto);
    return data;
  };
}
