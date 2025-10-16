import { useState, useRef, useEffect } from 'react';
import { PencilIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { imgToB64 } from '../../../application/lib/convert-to-b64';
import { PhotoAction } from '../../../../presentation/types';

interface UploadFotoPerfilProps {
  initialUrl?: string | null;
  onChange?: (action: PhotoAction) => void;
}

export const UploadFotoPerfil = ({
  initialUrl,
  onChange,
}: UploadFotoPerfilProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ref para almacenar el objectURL que creamos (si lo hay)
  const lastObjectUrlRef = useRef<string | null>(null);
  // ref para saber si el usuario interactuó (seleccionó o eliminó)
  const userTouchedRef = useRef<boolean>(false);

  useEffect(() => {
    // si el initialUrl cambia desde fuera, actualizamos preview (sin marcar userTouched)
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }
    setPreviewUrl(initialUrl || null);
    // NO tocamos userTouchedRef aquí
  }, [initialUrl]);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      // el usuario canceló el dialog -> no marcar como touched ni notificar cambio
      e.target.value = '';
      return;
    }

    // el usuario sí interactuó
    userTouchedRef.current = true;

    // revocar objectURL previo si lo tenemos
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }

    const localPreview = URL.createObjectURL(file);
    lastObjectUrlRef.current = localPreview;
    setPreviewUrl(localPreview);

    // convertimos a base64
    const b64 = await imgToB64(file);
    // reset input para permitir re-selección del mismo archivo
    e.target.value = '';

    if (b64.success && b64.data) {
      onChange?.({ action: 'set', b64: b64.data });
    } else {
      // conversión falló -> revertimos preview a initialUrl (no notificamos "remove")
      console.error('Error al convertir imagen a base64', b64.error);
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }
      setPreviewUrl(initialUrl || null);
      // No llamamos onChange: no hay cambio válido
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    userTouchedRef.current = true;

    // revocar objectURL si existe
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }
    setPreviewUrl(null);
    onChange?.({ action: 'remove' });
  };

  return (
    <div className="relative inline-block">
      <div
        onClick={openFilePicker}
        className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-lg"
        aria-label="Subir foto de perfil"
      >
        <div className="absolute inset-0 bg-gray-700/45 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 rounded-full cursor-pointer">
          <PencilIcon className="h-6 w-6 text-white" />
        </div>

        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Foto de perfil"
            className="object-cover w-full h-full z-0"
          />
        ) : (
          <UserIcon className="w-10 h-10 text-gray-400 z-0" />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {previewUrl && (
        <button
          onClick={handleRemove}
          className="absolute -top-2.5 -right-2.5 bg-black/75 hover:bg-black/90 text-white rounded-full p-1 z-20 shadow cursor-pointer"
          aria-label="Eliminar foto"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
