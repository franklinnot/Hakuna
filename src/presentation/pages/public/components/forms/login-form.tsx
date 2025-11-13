import { useState } from 'react';
import { Button } from '../../../../components/button';
import { Input } from '../../../../components/input';
import { ErrorDisplay } from '../../../../components/errors/error-display';
import { InputChange } from '../../../../html.types';
import { LoadingScreen } from '../../../../components/loading-screen';
import { ErrorResponse } from '../../../../../application/response';
import { useIniciarSesion } from '../../../../../application/use-cases/auth/useIniciarSesion';
import { UserIcon, LockClosedIcon } from '@heroicons/react/16/solid';

export const LoginForm = ({
  switchTo,
  isLoading,
  setIsLoading,
}: {
  switchTo: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorResponse>(null);
  const { iniciarSesion } = useIniciarSesion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    await iniciarSesion(username, password, setIsLoading, setError);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 px-4 py-2 w-[300px]"
    >
      {isLoading && <LoadingScreen />}
      <div className="block w-full relative">
        <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
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

      <div className="block w-full relative">
        <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
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
        {isLoading ? 'Iniciando...' : 'Ingresar'}
      </Button>

      <p
        className="text-center text-sm text-gray-500 flex flex-row 
        gap-2 justify-center"
      >
        <span>¿No tienes una cuenta?</span>
        <button
          type="button"
          onClick={switchTo}
          className="font-medium text-[var(--green-primary)] hover:underline"
        >
          Regístrate
        </button>
      </p>
    </form>
  );
};
