import api from '../api';
import { IRespuesta } from '../../shared/application/response';
import { UpdateUsuarioDto } from './usuarios.dtos';
import { IUsuarioResponse } from './usuarios.responses';

export class UsuariosService {
  private static ROUTE = '/usuarios';

  public static existsUsuarioByUsername = async (
    username: string,
  ): Promise<IRespuesta<boolean>> => {
    const { data } = await api.get(`${this.ROUTE}/exists/${username}`);
    return data;
  };

  public static updateUsuario = async (
    dto: UpdateUsuarioDto,
  ): Promise<IRespuesta<IUsuarioResponse>> => {
    const { data } = await api.put(`${this.ROUTE}/update`, dto);
    return data;
  };

  public static disableUsuario = async (): Promise<
    IRespuesta<IUsuarioResponse>
  > => {
    const { data } = await api.patch(`${this.ROUTE}/disable`);
    return data;
  };

  public static findAllByNombreOUsername = async (
    term: string,
  ): Promise<IRespuesta<IUsuarioResponse[]>> => {
    const { data } = await api.get(`${this.ROUTE}/search/${term}`);
    return data;
  };
}
