import { IUsuarioResponse } from './usuarios.responses';
import { Estado } from '../enums';
import { IMensajePrivadoResponse, IMensajeResponse } from './mensajes.responses';

export interface IChatResponse {
  id_chat: string;
  createdAt: Date;
  ultimo_mensaje: IMensajeResponse | null;
  is_group: boolean;
}

//

export interface IChatPrivadoResponse extends IChatResponse {
  usuarioB: IUsuarioResponse;
  historial_mensajes: IMensajePrivadoResponse[];
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
  historial_mensajes: IMensajeResponse[];
  integrantes: IIntegranteGrupalResponse[];
  cantidad_integrantes: number;
  estado_miembro: Estado; // Estado del usuario actual en el grupo
}
