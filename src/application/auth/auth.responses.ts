import { IUsuarioResponse } from '../usuarios/usuarios.responses';

export interface IAuthResponse {
  usuario: IUsuarioResponse;
  token: string;
}
