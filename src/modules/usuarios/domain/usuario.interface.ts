import type { ObjectBase } from "../../../shared/domain/types/object-base.interface";

export interface Usuario extends ObjectBase {
  id_fotoPerfil?: string;
  nombre: string;
  username: string;
}
