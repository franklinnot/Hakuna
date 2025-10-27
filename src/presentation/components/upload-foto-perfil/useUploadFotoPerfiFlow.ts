import { useEffect, useRef, useState } from 'react';
import { imgToB64 } from '../../../application/lib/convert-to-b64';

interface UseUploadFotoPerfilFlowProps {
  initialUrl?: string | null;
  onChange?: (value: string | null | undefined) => void;
}

export const useUploadFotoPerfilFlow = ({
  initialUrl = null,
  onChange,
}: UseUploadFotoPerfilFlowProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const base64Ref = useRef<string | null | undefined>(undefined);
  const lastObjectUrl = useRef<string | null>(null);

  // --- limpiar URLs y reiniciar estados cuando cambia el initialUrl
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

  // --- limpiar URLs cuando el componente se desmonta
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

    const objUrl = URL.createObjectURL(file);
    lastObjectUrl.current = objUrl;
    setPreviewUrl(objUrl);

    const b64 = await imgToB64(file);
    if (b64.success && b64.data) {
      base64Ref.current = b64.data;
      notifyIfChanged(objUrl);
    } else {
      console.error('Error convirtiendo imagen a base64', b64.error);
      resetPreview();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetPreview();
    base64Ref.current = null;
    setPreviewUrl(null);
    notifyIfChanged(null);
  };

  const resetPreview = () => {
    if (lastObjectUrl.current) {
      URL.revokeObjectURL(lastObjectUrl.current);
      lastObjectUrl.current = null;
    }
    setPreviewUrl(initialUrl);
    base64Ref.current = undefined;
    onChange?.(undefined);
  };

  return {
    previewUrl,
    inputRef,
    openPicker,
    handleFileChange,
    handleRemove,
  };
};
