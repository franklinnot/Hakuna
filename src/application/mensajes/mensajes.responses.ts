import { IArchivoResponse } from '../archivos/archivos.responses';
import { Estado } from '../../shared/domain/enums';

export interface IMensajeResponse {
  id_mensaje: string;
  id_integrante: string;
  descripcion: string;
  has_files: boolean;
  createdAt: Date;
  archivos: IArchivoResponse[] | null;
  estado: Estado;
}
