import { useState } from 'react';
import { useAuthStore } from '../../../application/auth/hooks/useAuthStore';
import { AuthService } from '../../../application/auth/auth.service';
import { Button } from '../../../shared/presentation/components/ui/button';
import { Input } from '../../../shared/presentation/components/ui/input';
import { InputChange } from '../../../shared/presentation/html.types';
import { ErrorResponse } from '../../../shared/application/response';
import {
  UserIcon,
  LockClosedIcon,
  IdentificationIcon,
} from '@heroicons/react/16/solid';
import { RegisterUsuarioSchema } from '../../../application/auth/auth.dtos';
import { ErrorDisplay } from '../../../shared/presentation/components/ui/errors/error-display';
import { UploadFotoPerfil } from '../../../shared/presentation/components/ui/upload-foto-perfi';

export const RegisterForm = ({ switchTo }: { switchTo: () => void }) => {
  const { setSession } = useAuthStore();
  const [foto, setFoto] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorResponse>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = RegisterUsuarioSchema.safeParse({
      foto,
      nombre,
      username,
      password,
    });

    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message);
      setError(errors);
      setIsLoading(false);
      return;
    }

    try {
      const dto = result.data;
      const response = await AuthService.register(dto);
      if (response.success && response.data) {
        setSession(response.data);
      } else {
        setError(response.error);
      }
    } catch (err: unknown) {
      console.error('Error en registro:', err);
      setError('Hubo un error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 px-4 py-2 w-[300px] items-center"
    >
      {/* foto */}
      <UploadFotoPerfil onChange={(b64) => setFoto(b64)} />

      {/* nombre */}
      <div className="block w-full relative">
        <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Nombre"
          value={nombre}
          onChange={(e: InputChange) => setNombre(e.target.value)}
          disabled={isLoading}
          className="pl-10"
          required
        />
      </div>

      {/* username */}
      <div className="block w-full relative">
        <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e: InputChange) =>
            setUsername(e.target.value.toLowerCase())
          }
          disabled={isLoading}
          className="pl-10"
          required
          autoFocus
        />
      </div>

      {/* password */}
      <div className="block w-full relative">
        <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="password"
          autoComplete="off"
          spellCheck="false"
          placeholder="Contraseña"
          value={password}
          onChange={(e: InputChange) => setPassword(e.target.value)}
          disabled={isLoading}
          className="pl-10"
          required
        />
      </div>

      {/* Errores  */}
      {error && <ErrorDisplay error={error} />}

      <Button type="submit" disabled={isLoading} className="mt-2">
        {isLoading ? 'Creando cuenta...' : 'Registrarme'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes una cuenta?{' '}
        <button
          type="button"
          onClick={switchTo}
          className="font-medium text-[var(--green-primary)] hover:underline"
        >
          Iniciar sesión
        </button>
      </p>
    </form>
  );
};
