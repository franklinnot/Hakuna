import { useState } from "react";
import { useAuthStore } from "../../../../../shared/infraestructure/hooks/useAuthStore";
import { AuthService } from "../../../application/auth.service";
import { Button } from "../../../../../shared/infraestructure/components/ui/button";
import { Input } from "../../../../../shared/infraestructure/components/ui/input";
import type { InputChange } from "../../../../../shared/application/types/html.types";
import type { ErrorResponse } from "../../../../../shared/application/types/error.type";
import {
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/16/solid";
import { SpanError } from "../../../../../shared/infraestructure/components/ui/span-error";

export const LoginForm = ({ switchTo }: { switchTo: () => void }) => {
  const { setSession } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ErrorResponse>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await AuthService.loginRequest({ username, password });
      if (response.success != true) {
        setError(response.error?.toString());
      } else {
        setSession(response.data!);
      }
    } catch (err: unknown) {
      console.log(err);
      setError("Hubo un error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 w-[300px]">
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
        />
      </div>

      {/* password */}
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

      {error && <SpanError error={error.toString()} />}

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full"
      >
        {isLoading ? "Cargando..." : "Entrar"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        ¿No tienes una cuenta?{" "}
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
