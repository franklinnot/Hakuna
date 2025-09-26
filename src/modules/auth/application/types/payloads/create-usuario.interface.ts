import type { LoginPayload } from "./login.interface";

export interface CreateUsuarioPayload extends LoginPayload {
  nombre: string;
}
