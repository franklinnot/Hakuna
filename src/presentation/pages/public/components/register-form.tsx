import { useState } from 'react';
import { Button } from '../../../components/button';
import { Input } from '../../../components/input';
import { ErrorDisplay } from '../../../components/errors/error-display';
import { InputChange } from '../../../html.types';
import { ErrorResponse } from '../../../../application/response';
import { UploadFotoPerfil } from '../../../components/upload-foto-perfil/upload-foto-perfi';
import {
  IdentificationIcon,
  UserIcon,
  LockClosedIcon,
} from '@heroicons/react/16/solid';
import { useCrearUsuario } from '../../../../application/use-cases/auth/useCrearUsuario';
import { LoadingScreen } from '../../../components/loading-screen';

export const RegisterForm = ({
  switchTo,
  isLoading,
  setIsLoading,
}: {
  switchTo: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  const [foto, setFoto] = useState<string | null | undefined>(undefined);
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorResponse>(null);
  const { crearUsuario } = useCrearUsuario();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    await crearUsuario(
      nombre,
      username,
      password,
      setIsLoading,
      setError,
      foto || undefined,
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 px-4 py-2 w-[300px] items-center"
    >
      {isLoading && <LoadingScreen />}
      <UploadFotoPerfil initialUrl={undefined} onChange={setFoto} />

      <div className="block w-full relative mt-3">
        <IdentificationIcon
          className="absolute left-3 top-1/2 h-5 w-5 
          -translate-y-1/2 text-gray-400"
        />
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
        <UserIcon
          className="absolute left-3 top-1/2 h-5 w-5 
          -translate-y-1/2 text-gray-400"
        />
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
        <LockClosedIcon
          className="absolute left-3 top-1/2 h-5 w-5 
          -translate-y-1/2 text-gray-400"
        />
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

      <p
        className="text-center text-sm text-gray-500 flex flex-row 
        gap-2 justify-center"
      >
        <span>¿Ya tienes una cuenta?</span>
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
