import { ErrorResponse } from '../response';

export const cleanAndNormalize = (raw: string): string | null => {
  if (!raw) return null;
  let s = raw.trim();

  // eliminar caracteres expeciales
  s = s.replace(
    /^[\s,.;:!?()"'`¿¡\-[\]{}<>]+|[\s,.;:!?()"'`¿¡\-[\]{}<>]+$/g,
    '',
  );

  // si queda vacío, ignorar
  if (s.length == 0) return null;

  // asegurar un único punto final
  s = s.replace(/[.]+$/g, '');
  s = `${s}.`;

  return s;
};

export const splitAndClean = (text: string) =>
  text
    .split('.')
    .map((part) => cleanAndNormalize(part))
    .filter((m): m is string => typeof m === 'string' && m.length > 0);

export const extractErrors = (error: ErrorResponse): string[] => {
  if (error == null) return [];

  if (typeof error === 'string') {
    return splitAndClean(error);
  }

  if (Array.isArray(error)) {
    return error.flatMap((item) =>
      typeof item === 'string' ? splitAndClean(item) : [],
    );
  }

  if (typeof error === 'object') {
    const generic = 'Error en los datos proporcionados.';
    return [generic];
  }

  return [];
};
