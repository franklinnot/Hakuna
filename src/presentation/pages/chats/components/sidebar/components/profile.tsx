import { useEffect, useMemo, useState } from 'react';
import { useUpdateUsuario } from '../../../../../../application/use-cases/usuarios/useUpdateUsuario';
import { Input } from '../../../../../components/input';
import { UploadFotoPerfil } from '../../../../../components/upload-foto-perfil/upload-foto-perfi';
import { Button } from '../../../../../components/button';
import { ErrorDisplay } from '../../../../../components/errors/error-display';
import { ErrorResponse } from '../../../../../../application/response';
import { AppStore } from '../../../../../../application/store/app.store';

export const Profile = () => {
  const { updateUsuario } = useUpdateUsuario();
  const usuario = AppStore((s) => s.usuario);
  const nombreActual = usuario?.nombre || '';
  const usernameActual = usuario?.username || '';

  const [nuevoNombre, setNombre] = useState(nombreActual);
  const [nuevoUsername, setUsername] = useState(usernameActual);
  const [nuevaFoto, setnuevaFoto] = useState<string | null | undefined>(
    undefined,
  );
  const [error, setError] = useState<ErrorResponse>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNombre(usuario?.nombre || '');
    setUsername(usuario?.username || '');
    setnuevaFoto(undefined);
    setError(null);
  }, [usuario]);

  const hayCambios = useMemo(() => {
    const cambioNombre = nuevoNombre.trim() != nombreActual;
    const cambioUser = nuevoUsername.trim() !== usernameActual;
    return cambioNombre || cambioUser || typeof nuevaFoto !== 'undefined';
  }, [nuevoNombre, nombreActual, nuevoUsername, usernameActual, nuevaFoto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hayCambios) return;

    // Construir payload limpio
    const payload: Record<string, string | null | undefined> = {};
    if (nuevoNombre.trim() !== nombreActual)
      payload.nombre = nuevoNombre.trim();
    if (nuevoUsername.trim() !== usernameActual)
      payload.username = nuevoUsername.trim();
    if (typeof nuevaFoto !== 'undefined') payload.foto = nuevaFoto;

    await updateUsuario(payload, setLoading, setError);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-6 w-full"
    >
      <UploadFotoPerfil
        initialUrl={usuario?.link_foto}
        onChange={setnuevaFoto}
      />

      <div className="w-full flex flex-col gap-4">
        <label className="block text-sm font-medium text-gray-700">
          Nombre
          <Input
            value={nuevoNombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1"
            autoFocus
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Usuario
          <Input
            value={nuevoUsername}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            className="mt-1"
          />
        </label>
      </div>

      {error && <ErrorDisplay error={error} />}

      <Button type="submit" disabled={!hayCambios || loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </Button>
    </form>
  );
};
