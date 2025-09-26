import { Estado } from "../enums/estado.enum";

export interface ObjectBase {
  _id: string;
  estado: Estado;
  createdAt: string;
  updatedAt: string;
}
