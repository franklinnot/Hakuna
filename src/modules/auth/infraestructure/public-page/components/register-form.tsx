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
  IdentificationIcon,
} from "@heroicons/react/16/solid";
import { SpanError } from "../../../../../shared/infraestructure/components/ui/span-error";

export const RegisterForm = ({ switchTo }: { switchTo: () => void }) => {
  const { setSession } = useAuthStore();
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ErrorResponse>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await AuthService.registerRequest({
        username,
        password,
        nombre,
      });
      if (response.success != true) {
        setError(response.error);
      } else {
        setSession(response.data!);
      }
    } catch {
      setError("Hubo un error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 px-4 w-[300px]"
    >
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

      {error && <SpanError error={error.toString()} />}

      <Button type="submit" disabled={isLoading} className="mt-2">
        {isLoading ? "Creando cuenta..." : "Registrarme"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes una cuenta?{" "}
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
