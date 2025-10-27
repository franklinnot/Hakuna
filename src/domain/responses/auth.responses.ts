import { IUsuarioResponse } from "./usuarios.responses";

export interface IAuthResponse {
  usuario: IUsuarioResponse;
  token: string;
}
