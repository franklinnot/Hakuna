import { IArchivoResponse } from '../archivos/archivos.responses';
import { Estado } from '../../shared/domain/enums';

export interface IMensajeResponse {
  id_mensaje: string;
  id_usuario: string; // quien lo envio
  id_chat: string; // a que chat
  es_grupal: boolean; // si es para un chat grupal
  descripcion: string | null;
  has_files: boolean;
  createdAt: Date;
  archivos: IArchivoResponse[] | null;
  estado: Estado;
}