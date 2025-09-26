import type { Usuario } from "../../../usuarios/domain/usuario.interface";
import type { AuthResponse } from "./responses/auth-response.interfaces";
import { Paginas } from "../../../../shared/domain/enums/paginas.enum";

export interface SessionState {
  token: string | null;
  usuario: Partial<Usuario> | null;
  view: Paginas;
  isAuthenticated: boolean;

  // acciones
  setView: (view: Paginas) => void;
  setSession: (data: AuthResponse) => void;
  logout: () => void;
}
