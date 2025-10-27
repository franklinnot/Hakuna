import { AuthService } from '../../../infraestructure/rest/auth/auth.service';
import { AppStore } from '../../store/app.store';
import { RegisterUsuarioSchema } from '../../../infraestructure/rest/auth/auth.dtos';
import type { ErrorResponse } from '../../response';
import { Paginas } from '../../../domain/enums';
import { connectSocket } from '../../../infraestructure/socket/socket.client';

export const useCrearUsuario = () => {
  const { setSession, setView } = AppStore();

  const crearUsuario = async (
    nombre: string,
    username: string,
    password: string,
    setIsLoading: (v: boolean) => void,
    setError: (e: ErrorResponse) => void,
    foto?: string,
  ) => {
    setError(null);
    setIsLoading(true);

    const result = RegisterUsuarioSchema.safeParse({
      nombre,
      username,
      password,
      foto,
    });

    if (!result.success) {
      setError(result.error.issues.map((i) => i.message));
      setIsLoading(false);
      return;
    }

    try {
      const response = await AuthService.register(result.data);
      if (!response.success || !response.data) {
        setError(response.error);
        setIsLoading(false);
        return;
      }

      // guardar sesión
      setSession(response.data);

      // conectar socket
      connectSocket(response.data.token);

      setView(Paginas.CHATS);
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error al registrar usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  return { crearUsuario };
};
