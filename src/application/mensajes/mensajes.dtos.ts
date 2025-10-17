import { TipoArchivo } from '../../shared/domain/enums';

export interface ICrearArchivo {
  nombre?: string;
  tipoArchivo: TipoArchivo;
  b64: string;
}

export interface EnviarMensajePrivadoDto {
  id_usuarioB: string;
  descripcion?: string;
  archivos?: ICrearArchivo[];
}
