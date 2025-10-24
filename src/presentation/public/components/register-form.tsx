import { useState } from 'react';
import { Button } from '../../../shared/presentation/components/ui/button';
import { Input } from '../../../shared/presentation/components/ui/input';
import { ErrorDisplay } from '../../../shared/presentation/components/ui/errors/error-display';
import { UploadFotoPerfil } from '../../../shared/presentation/components/ui/upload-foto-perfi';
import {
  IdentificationIcon,
  UserIcon,
  LockClosedIcon,
} from '@heroicons/react/16/solid';
import { InputChange } from '../../../shared/presentation/html.types';
import { useAuthService } from '../../../application/auth/hooks/useAuthService';
import { ErrorResponse } from '../../../shared/application/response';

export const RegisterForm = ({ switchTo }: { switchTo: () => void }) => {
  const [foto, setFoto] = useState<string | null | undefined>(undefined);
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse>(null);
  const { register } = useAuthService();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    await register(nombre, username, password, foto, setIsLoading, setError);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 px-4 py-2 w-[300px] items-center"
    >
      <UploadFotoPerfil initialUrl={undefined} onChange={setFoto} />

      <div className="block w-full relative mt-3">
        <IdentificationIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Nombre"
          value={nombre}
          onChange={(e: InputChange) => setNombre(e.target.value)}
          disabled={isLoading}
          className="pl-10"
          required
          autoFocus
        />
      </div>

      <div className="block w-full relative">
        <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e: InputChange) =>
            setUsername(e.target.value.toLowerCase())
          }
          disabled={isLoading}
          className="pl-10"
          required
        />
      </div>

      <div className="block w-full relative">
        <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e: InputChange) => setPassword(e.target.value)}
          disabled={isLoading}
          className="pl-10"
          required
        />
      </div>

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
