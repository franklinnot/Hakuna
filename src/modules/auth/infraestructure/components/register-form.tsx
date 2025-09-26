import { useState } from "react";
import { useAuthStore } from "../../application/store/auth.store";
import { AuthService } from "../../application/auth.service";
import { Button } from "../../../../shared/infraestructure/components/ui/button";
import { Input } from "../../../../shared/infraestructure/components/ui/input";
import type { InputChange } from "../../../../shared/application/types/html.types";
import { Paginas } from "../../../../shared/domain/enums/paginas.enum";
import type { ErrorResponse } from "../../../../shared/application/types/error.type";

export const RegisterForm = () => {
  const { setSession, setView } = useAuthStore();
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ErrorResponse>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
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
    <div className="w-full max-w-sm p-8 space-y-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Regístrate</h2>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e: InputChange) => setNombre(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e: InputChange) => setUsername(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e: InputChange) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        {error && <p className="text-sm text-red-500">{error.toString()}</p>}
        <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? "Cargando..." : "Registrarme"}
        </Button>
      </div>
      <p className="text-sm text-center text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <button
          onClick={() => setView(Paginas.LOGIN)}
          className="font-medium text-blue-600 hover:underline"
        >
          Iniciar sesión
        </button>
      </p>
    </div>
  );
};
