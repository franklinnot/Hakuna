import { useState, useRef, useEffect } from 'react';
import { PencilIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { imgToB64 } from '../../../application/lib/convert-to-b64';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const lastObjectUrl = useRef<string | null>(null);
  const base64Ref = useRef<string | null | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (lastObjectUrl.current) {
      URL.revokeObjectURL(lastObjectUrl.current);
      lastObjectUrl.current = null;
    }
    setPreviewUrl(initialUrl);
    base64Ref.current = undefined;
    onChange?.(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  useEffect(() => {
    return () => {
      if (lastObjectUrl.current) {
        URL.revokeObjectURL(lastObjectUrl.current);
        lastObjectUrl.current = null;
      }
    };
  }, []);

  const openPicker = () => inputRef.current?.click();

  const notifyIfChanged = (currentPreview: string | null) => {
    if (
      (currentPreview === null && initialUrl === null) ||
      currentPreview === initialUrl
    ) {
      onChange?.(undefined);
      return;
    }

    if (currentPreview === null && initialUrl) {
      onChange?.(null);
      return;
    }

    if (typeof base64Ref.current === 'string') {
      onChange?.(base64Ref.current);
      return;
    }

    onChange?.(undefined);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (lastObjectUrl.current) {
      URL.revokeObjectURL(lastObjectUrl.current);
      lastObjectUrl.current = null;
    }

    const obj = URL.createObjectURL(file);
    lastObjectUrl.current = obj;
    setPreviewUrl(obj);

    const b64 = await imgToB64(file);
    if (b64.success && b64.data) {
      base64Ref.current = b64.data;
      notifyIfChanged(obj);
    } else {
      console.error('Error convirtiendo imagen a base64', b64.error);
      if (lastObjectUrl.current) {
        URL.revokeObjectURL(lastObjectUrl.current);
        lastObjectUrl.current = null;
      }
      setPreviewUrl(initialUrl);
      base64Ref.current = undefined;
      onChange?.(undefined);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lastObjectUrl.current) {
      URL.revokeObjectURL(lastObjectUrl.current);
      lastObjectUrl.current = null;
    }

    base64Ref.current = null;
    setPreviewUrl(null);
    notifyIfChanged(null);
  };

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
