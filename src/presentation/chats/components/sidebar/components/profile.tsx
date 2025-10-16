import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../../../../application/auth/hooks/useAuthStore';
import { Input } from '../../../../../shared/presentation/components/ui/input';
import { UpdateUsuarioSchema } from '../../../../../application/usuarios/usuarios.dtos';
import { UsuariosService } from '../../../../../application/usuarios/usuarios.service';
import { UploadFotoPerfil } from '../../../../../shared/presentation/components/ui/upload-foto-perfi';
import { Button } from '../../../../../shared/presentation/components/ui/button';
import { ErrorDisplay } from '../../../../../shared/presentation/components/ui/errors/error-display';
import { ErrorResponse } from '../../../../../shared/application/response';

export const Profile = () => {
  const { setUsuario } = useAuthStore();
  const usuario = useAuthStore((s) => s.usuario);
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
    return cambioNombre || cambioUser || nuevaFoto !== undefined;
  }, [nuevoNombre, nombreActual, nuevoUsername, usernameActual, nuevaFoto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hayCambios) return;

    setError(null);
    setLoading(true);

    try {
      // construir payload sólo con los campos que cambiaron o que deben enviarse
      const payload: Record<string, string | null | undefined> = {};

      if (nuevoNombre.trim() !== nombreActual)
        payload.nombre = nuevoNombre.trim();
      if (nuevoUsername.trim() !== usernameActual)
        payload.username = nuevoUsername.trim();
      // solo incluir si nuevaFoto !== undefined
      if (typeof nuevaFoto !== 'undefined') {
        // puede ser null o base64 string
        payload.foto = nuevaFoto;
      }

      const result = UpdateUsuarioSchema.safeParse(payload);
      if (!result.success) {
        setError(result.error.issues.map((i) => i.message));
        setLoading(false);
        return;
      }

      const response = await UsuariosService.updateUsuario(result.data);
      if (response.success && response.data) {
        setUsuario(response.data);
        setnuevaFoto(undefined);
      } else {
        setError(response.error);
      }
    } catch (err) {
      console.error(err);
      setError('Error actualizando perfil.');
    } finally {
      setLoading(false);
    }
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
