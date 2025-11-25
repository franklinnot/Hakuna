import { useState } from 'react';
import { TipoArchivo } from '../../../../../../../../../domain/enums';

export const useFileUploader = () => {
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [documentos, setDocumentos] = useState<File[]>([]); // 👈 NUEVO ESTADO

  const handleFiles = (files: FileList | File[]) => {
    const allFiles = Array.from(files); // Filtra y separa las imágenes
    const imgs = allFiles.filter((f) => f.type.startsWith('image/'));
    setImagenes((prev) => [...prev, ...imgs]); // Filtra y separa los documentos (todo lo que NO es imagen)

    const docs = allFiles.filter((f) => !f.type.startsWith('image/'));
    setDocumentos((prev) => [...prev, ...docs]); // 👈 Guardar documentos
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const files = e.clipboardData.files;
    if (files.length > 0) handleFiles(files);
  };

  const clearImagenes = () => setImagenes([]);
  const clearDocumentos = () => setDocumentos([]); // 👈 NUEVA FUNCIÓN PARA LIMPIAR DOCUMENTOS

  const removeImagen = (index: number) => {
    // Función de eliminación separada para imágenes
    const nuevas = [...imagenes];
    nuevas.splice(index, 1);
    setImagenes(nuevas);
  };

  const removeDocumento = (index: number) => {
    // 👈 NUEVA FUNCIÓN PARA ELIMINAR DOCUMENTOS
    const nuevas = [...documentos];
    nuevas.splice(index, 1);
    setDocumentos(nuevas);
  };

  const toArchivos = async () => {
    // Conversión de imágenes (TipoArchivo.IMAGEN)
    const imagenArchivos = Promise.all(
      imagenes.map(async (file) => {
        const b64 = await fileToBase64(file);
        return { tipoArchivo: TipoArchivo.IMAGEN, b64, nombre: file.name };
      }),
    ); // Conversión de documentos (TipoArchivo.DOCUMENTO)

    const documentoArchivos = Promise.all(
      documentos.map(async (file) => {
        const b64 = await fileToBase64(file);
        return { tipoArchivo: TipoArchivo.DOCUMENTO, b64, nombre: file.name }; // Asumo que tienes TipoArchivo.DOCUMENTO
      }),
    );

    const results = await Promise.all([imagenArchivos, documentoArchivos]);
    return [...results[0], ...results[1]]; // Combinar ambas listas de archivos
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  return {
    imagenes,
    documentos, // 👈 Exportado
    handleFiles,
    handlePaste,
    clearImagenes,
    clearDocumentos, // 👈 Exportado
    removeImagen, // 👈 Exportado
    removeDocumento, // 👈 Exportado
    toArchivos,
  };
};
