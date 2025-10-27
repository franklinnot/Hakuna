import { IRespuesta } from '../response';

const allowed = ['image/png', 'image/jpeg', 'image/webp'];

// Función genérica
export const fileToB64 = (
  formats: string[],
  max_size_mb: number,
  file?: File,
): Promise<IRespuesta<string>> => {
  return new Promise((resolve) => {
    if (!file)
      return resolve({
        success: false,
        data: null,
        error: 'No se proporcionó ningún archivo.',
      });

    if (!formats.includes(file.type))
      return resolve({
        success: false,
        data: null,
        error: 'Formato no permitido.',
      });

    if (file.size > max_size_mb * 1024 * 1024)
      return resolve({
        success: false,
        data: null,
        error: `El archivo supera el límite de ${max_size_mb}MB.`,
      });

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result?.toString() ?? '';
      const base64 = result.split(',')[1] ?? null;

      if (!base64)
        return resolve({
          success: false,
          data: null,
          error: 'No se pudo procesar el archivo.',
        });

      resolve({ success: true, data: base64 });
    };

    reader.onerror = () =>
      resolve({
        success: false,
        data: null,
        error: 'Hubo un error al leer el archivo.',
      });

    reader.readAsDataURL(file);
  });
};

export const imgToB64 = (file?: File): Promise<IRespuesta<string>> => {
  return fileToB64(allowed, 4, file);
};
