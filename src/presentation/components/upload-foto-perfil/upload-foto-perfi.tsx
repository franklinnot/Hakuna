import { PencilIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useUploadFotoPerfilFlow } from './useUploadFotoPerfiFlow';

interface Props {
  initialUrl?: string | null;
  onChange?: (value: string | null | undefined) => void;
  size?: number;
}

export const UploadFotoPerfil = ({
  initialUrl = null,
  onChange,
  size = 96,
}: Props) => {
  const { previewUrl, inputRef, openPicker, handleFileChange, handleRemove } =
    useUploadFotoPerfilFlow({ initialUrl, onChange });

  return (
    <div
      style={{ width: size, height: size }}
      className="relative inline-block"
    >
      <div
        onClick={openPicker}
        className="relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-lg cursor-pointer"
        style={{ width: size, height: size }}
        aria-label="Subir foto de perfil"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Foto de perfil"
            className="object-cover w-full h-full"
          />
        ) : (
          <UserIcon className="w-10 h-10 text-gray-400" />
        )}

        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <PencilIcon className="h-6 w-6 text-white" />
        </div>

        <input
          ref={inputRef}
          onChange={handleFileChange}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
        />
      </div>

      {previewUrl && (
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 bg-black/75 text-white rounded-full p-1"
          aria-label="Eliminar foto"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
