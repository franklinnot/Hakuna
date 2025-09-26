import type { Usuario } from "../../../../usuarios/domain/usuario.interface";

// respuesta de la api al hacer login o register
export interface AuthResponse {
  usuario: Usuario;
  token: string;
}
