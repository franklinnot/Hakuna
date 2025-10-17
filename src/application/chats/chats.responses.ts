import { IUsuarioResponse } from '../usuarios/usuarios.responses';
import { Estado } from '../../shared/domain/enums';
import { IMensajeResponse } from '../mensajes/mensajes.responses';

export interface IChatPrivadoResponse {
  id_chat: string;
  historial_mensajes: IMensajeResponse[] | null;
  createdAt: Date;
  usuarioB: IUsuarioResponse;
  ultimo_mensaje?: IMensajeResponse;
}

//

export type IIntegranteGrupalResponse = {
  is_admin: boolean;
  fecha_union: Date;
  estado: Estado;
} & IUsuarioResponse;

export interface IChatGrupalResponse {
  id_chat: string;
  historial_mensajes: IMensajeResponse[] | null;
  createdAt: Date;
  link_foto: string | null;
  nombre: string;
  descripcion: string;
  integrantes: IIntegranteGrupalResponse[];
  cantidad_integrantes: number;
}
