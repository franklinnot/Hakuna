import api from '../api';
import { IRespuesta } from '../../shared/application/response';
import { IAuthResponse } from './auth.responses';
import { LoginDto, RegisterUsuarioDto } from './auth.dtos';

export class AuthService {
  private static ROUTE = '/auth';

  public static register = async (
    dto: RegisterUsuarioDto,
  ): Promise<IRespuesta<IAuthResponse>> => {
    const { data } = await api.post(`${this.ROUTE}/register`, dto);
    return data;
  };

  public static login = async (
    dto: LoginDto,
  ): Promise<IRespuesta<IAuthResponse>> => {
    const { data } = await api.post(`${this.ROUTE}/login`, dto);
    return data;
  };

  public static byJWT = async (): Promise<IRespuesta<IAuthResponse>> => {
    const { data } = await api.post(`${this.ROUTE}/by-jwt`);
    return data;
  };
}
