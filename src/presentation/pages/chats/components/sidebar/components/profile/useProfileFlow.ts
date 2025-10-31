import { useEffect, useMemo, useState } from 'react';
import { useUpdateUsuario } from '../../../../../../../application/use-cases/usuarios/useUpdateUsuario';
import { AppStore } from '../../../../../../../application/store/app.store';
import type { ErrorResponse } from '../../../../../../../application/response';

export const useProfileFlow = () => {
  const { updateUsuario } = useUpdateUsuario();
  const usuario = AppStore((s) => s.usuario);

  const nombreActual = usuario?.nombre || '';
  const usernameActual = usuario?.username || '';

  const [nuevoNombre, setNombre] = useState(nombreActual);
  const [nuevoUsername, setUsername] = useState(usernameActual);
  const [nuevaFoto, setNuevaFoto] = useState<string | null | undefined>(
    undefined,
  );
  const [error, setError] = useState<ErrorResponse>(null);
  const [loading, setLoading] = useState(false);

  // Sincroniza los inputs si cambia el usuario global
  useEffect(() => {
    setNombre(nombreActual);
    setUsername(usernameActual);
    setNuevaFoto(undefined);
    setError(null);
  }, [usuario]);

  const hayCambios = useMemo(() => {
    const cambioNombre = nuevoNombre.trim() !== nombreActual;
    const cambioUser = nuevoUsername.trim() !== usernameActual;
    return cambioNombre || cambioUser || typeof nuevaFoto !== 'undefined';
  }, [nuevoNombre, nombreActual, nuevoUsername, usernameActual, nuevaFoto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hayCambios) return;

    const payload: Record<string, string | null | undefined> = {};
    if (nuevoNombre.trim() !== nombreActual)
      payload.nombre = nuevoNombre.trim();
    if (nuevoUsername.trim() !== usernameActual)
      payload.username = nuevoUsername.trim();
    if (typeof nuevaFoto !== 'undefined') payload.foto = nuevaFoto;

    await updateUsuario(payload, setLoading, setError);
  };

  return {
    nuevoNombre,
    setNombre,
    nuevoUsername,
    setUsername,
    nuevaFoto,
    setNuevaFoto,
    error,
    loading,
    hayCambios,
    handleSubmit,
    usuario,
  };
};
