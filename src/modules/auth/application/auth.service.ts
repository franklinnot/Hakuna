import api from "../../../api";
import type { Respuesta } from "../../../shared/application/types/respuesta.interface";
import type { AuthResponse } from "./types/responses/auth-response.interfaces";
import type { LoginPayload } from "./types/payloads/login.interface";
import type { CreateUsuarioPayload } from "./types/payloads/create-usuario.interface";

export class AuthService {
  private static AUTH_ROUTE = "/auth";

  public static loginRequest = async (
    payload: LoginPayload
  ): Promise<Respuesta<AuthResponse>> => {
    const { data } = await api.post(`${this.AUTH_ROUTE}/login`, payload);
    return data;
  };

  public static registerRequest = async (
    payload: CreateUsuarioPayload
  ): Promise<Respuesta<AuthResponse>> => {
    const { data } = await api.post(`${this.AUTH_ROUTE}/register`, payload);
    return data;
  };

  public static getUserByJwtRequest = async (): Promise<
    Respuesta<AuthResponse>
  > => {
    const { data } = await api.get(`${this.AUTH_ROUTE}/by_jwt`);
    return data;
  };
}
