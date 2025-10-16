import { useAuthStore } from '../../../../../application/auth/hooks/useAuthStore';
import { Input } from '../../../../../shared/presentation/components/ui/input';
import { useEffect, useMemo, useState } from 'react';
import { InputChange } from '../../../../../shared/presentation/html.types';
import { ErrorResponse } from '../../../../../shared/application/response';
import { UpdateUsuarioSchema } from '../../../../../application/usuarios/usuarios.dtos';
import { UsuariosService } from '../../../../../application/usuarios/usuarios.service';
import { ErrorDisplay } from '../../../../../shared/presentation/components/ui/errors/error-display';
import { UploadFotoPerfil } from '../../../../../shared/presentation/components/ui/upload-foto-perfi';
import { PhotoAction } from '../../../../types';
import { Button } from '../../../../../shared/presentation/components/ui/button';

export const Profile = () => {
  const { setUsuario } = useAuthStore();
  const usuario = useAuthStore((s) => s.usuario);

  // guardamos la última acción del usuario sobre la foto
  // inicio: 'none' (no ha tocado)
  const [fotoAction, setFotoAction] = useState<PhotoAction>({ action: 'none' });
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [username, setUsername] = useState(usuario?.username || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse>(null);

  useEffect(() => {
    setNombre(usuario?.nombre || '');
    setUsername(usuario?.username || '');
    setFotoAction({ action: 'none' }); // reseteamos la acción al sincronizar usuario
    setError(null);
  }, [usuario]);

  const hayCambios = useMemo(() => {
    const cambioNombre = nombre.trim() !== (usuario?.nombre || '').trim();
    const cambioUsername =
      username.trim().toLowerCase() !==
      (usuario?.username || '').trim().toLowerCase();
    const cambioFoto = fotoAction.action !== 'none';
    return cambioNombre || cambioUsername || cambioFoto;
  }, [nombre, username, fotoAction, usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1) si la acción fue 'remove' y el usuario tenía foto -> llamar eliminar endpoint
      if (fotoAction.action === 'remove' && usuario?.link_foto) {
        const resp = await UsuariosService.eliminarFotoPerfil();
        if (resp.success && resp.data) {
          setUsuario(resp.data);
          setFotoAction({ action: 'none' });
        } else {
          setError(resp.error);
        }
        setIsLoading(false);
        return;
      }

      // 2) si la acción fue 'set' -> incluimos foto base64
      const payload: any = {
        nombre,
        username,
      };
      if (fotoAction.action === 'set') {
        payload.foto = fotoAction.b64;
      } else {
        // fotoAction.action === 'none' => no tocar la propiedad 'foto' en el DTO
      }

      const result = UpdateUsuarioSchema.safeParse(payload);
      if (!result.success) {
        setError(result.error.issues.map((i) => i.message));
        setIsLoading(false);
        return;
      }

      const response = await UsuariosService.updateUsuario(result.data);
      if (response.success && response.data) {
        setUsuario(response.data);
        setFotoAction({ action: 'none' }); // reset
      } else {
        setError(response.error);
      }
    } catch (err) {
      console.error(err);
      setError('Hubo un error al actualizar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-6 w-full"
    >
      <UploadFotoPerfil
        initialUrl={usuario?.link_foto}
        onChange={(action: PhotoAction) => setFotoAction(action)}
      />

      <div className="w-full flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <Input
            type="text"
            value={nombre}
            onChange={(e: InputChange) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className="mt-1"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <Input
            type="text"
            value={username}
            onChange={(e: InputChange) =>
              setUsername(e.target.value.toLowerCase())
            }
            placeholder="Tu usuario"
            className="mt-1"
          />
        </div>
      </div>

      {/* Errores */}
      {error && <ErrorDisplay error={error} />}

      <Button type="submit" disabled={!hayCambios || isLoading}>
        {isLoading ? 'Cargando...' : 'Actualizar'}
      </Button>
    </form>
  );
};
