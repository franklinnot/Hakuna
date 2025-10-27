import { IUsuarioResponse } from './usuarios.responses';
import { Estado } from '../enums';
import { IMensajeResponse } from './mensajes.responses';

export interface IChatResponse {
  id_chat: string;
  historial_mensajes: IMensajeResponse[];
  createdAt: Date;
  ultimo_mensaje: IMensajeResponse | null;
  is_group: boolean;
}

//

export interface IChatPrivadoResponse extends IChatResponse {
  usuarioB: IUsuarioResponse;
  is_temp?: boolean;
}

//

export type IIntegranteGrupalResponse = {
  is_admin: boolean;
  fecha_union: Date;
  estado: Estado;
} & IUsuarioResponse;

export interface IChatGrupalResponse extends IChatResponse {
  link_foto: string | null;
  nombre: string;
  descripcion: string | null;
  integrantes: IIntegranteGrupalResponse[];
  cantidad_integrantes: number;
}
