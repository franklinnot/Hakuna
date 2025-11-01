import { useRef, useState } from 'react';
import { ICrearArchivo } from '../../../../../../../../../infraestructure/rest/mensajes/mensajes.dtos';
import { TipoArchivo } from '../../../../../../../../../domain/enums';

export const useFileHandling = () => {
  const [archivos, setArchivos] = useState<ICrearArchivo[] | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // remover el encabezado data:*;base64,
        const commaIndex = result.indexOf(',');
        resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const mapTipo = (f: File): TipoArchivo => {
    if (f.type.startsWith('image/')) return TipoArchivo.IMAGEN;
    if (f.type.startsWith('audio/')) return TipoArchivo.AUDIO;
    if (f.type.startsWith('video/')) return TipoArchivo.VIDEO;
    return TipoArchivo.DOCUMENTO;
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const list: ICrearArchivo[] = await Promise.all(
        files.map(async (f) => ({
          nombre: f.name,
          tipoArchivo: mapTipo(f),
          b64: await fileToBase64(f),
        })),
      );

      setArchivos(list);
    } catch (err) {
      console.error('Error leyendo archivos:', err);
    } finally {
      // limpiar el input para poder volver a seleccionar el mismo archivo si se desea
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearArchivos = () => {
    setArchivos(undefined);
  };

  return {
    archivos,
    fileInputRef,
    handleAttachClick,
    handleFilesSelected,
    clearArchivos,
  };
};