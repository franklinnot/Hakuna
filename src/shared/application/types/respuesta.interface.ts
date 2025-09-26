import type { ErrorResponse } from "./error.type";

export interface Respuesta<T> {
  success?: boolean | null;
  data?: T | null;
  error?: ErrorResponse;
}
