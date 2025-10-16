import { useState } from 'react';
import { useAuthStore } from '../../../application/auth/hooks/useAuthStore';
import { AuthService } from '../../../application/auth/auth.service';
import { Button } from '../../../shared/presentation/components/ui/button';
import { Input } from '../../../shared/presentation/components/ui/input';
import { InputChange } from '../../../shared/presentation/html.types';
import { LoginSchema } from '../../../application/auth/auth.dtos';
import { UserIcon, LockClosedIcon } from '@heroicons/react/16/solid';
import { ErrorResponse } from '../../../shared/application/response';
import { ErrorDisplay } from '../../../shared/presentation/components/ui/errors/error-display';

export const LoginForm = ({ switchTo }: { switchTo: () => void }) => {
  const { setSession } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorResponse>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = LoginSchema.safeParse({ username, password });
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      setError(errors);
      setIsLoading(false);
      return;
    }

    try {
      const dto = result.data;
      const response = await AuthService.login(dto);

      if (response.success && response.data) {
        setSession(response.data);
      } else {
        setError(response.error);
      }
    } catch (err: unknown) {
      console.error('Error en login:', err);
      setError('Hubo un error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 px-4 py-2 w-[300px]"
    >
      {/* Username */}
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

      {/* Password */}
      <div className="block w-full relative">
        <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
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

      {/* Errores  */}
      {error && <ErrorDisplay error={error} />}

      <Button type="submit" disabled={isLoading} className="mt-2 w-full">
        {isLoading ? 'Iniciando...' : 'Ingresar'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        <span>¿No tienes una cuenta? </span>
        <button
          type="button"
          onClick={switchTo}
          className="font-medium text-[var(--green-primary)] hover:underline transition duration-150 ease-in-out"
        >
          Regístrate
        </button>
      </p>
    </form>
  );
};
