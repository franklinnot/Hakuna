import { useState } from 'react';
import { TipoArchivo } from '../../../../../../../../../domain/enums';

export const useFileUploader = () => {
  const [imagenes, setImagenes] = useState<File[]>([]);

  const handleFiles = (files: FileList | File[]) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setImagenes((prev) => [...prev, ...imgs]);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const files = e.clipboardData.files;
    if (files.length > 0) handleFiles(files);
  };

  const clearImagenes = () => setImagenes([]);

  const toArchivos = async () => {
    const convert = async (file: File) => {
      const b64 = await fileToBase64(file);
      return {
        tipoArchivo: TipoArchivo.IMAGEN,
        b64,
        nombre: file.name,
      };
    };
    return Promise.all(imagenes.map(convert));
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  return { imagenes, handleFiles, handlePaste, clearImagenes, toArchivos };
};
