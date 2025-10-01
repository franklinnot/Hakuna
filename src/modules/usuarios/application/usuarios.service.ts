import api from "../../../api";
import type { Respuesta } from "../../../shared/application/types/respuesta.interface";
import type { Usuario } from "../domain/usuario.interface";

export class UsuariosService {
  private static BASE_ROUTE = "/usuarios";

  public static search = async (query: string): Promise<Respuesta<Usuario[]>> => {
    const { data } = await api.get(`${this.BASE_ROUTE}/search?q=${query}`);
    return data;
  };
}
