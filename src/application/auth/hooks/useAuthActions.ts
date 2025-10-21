import { AuthService } from '../auth.service';
import { useAuthStore } from './useAuthStore';
import { useChatsService } from '../../chats/hooks/useChatsService';
import { LoginSchema, RegisterUsuarioSchema } from '../auth.dtos';
import type { ErrorResponse } from '../../../shared/application/response';
import { Paginas } from '../../../shared/domain/enums';

export const useAuthActions = () => {
  const { setSession, setView } = useAuthStore();
  const { getChats } = useChatsService();

  const login = async (
    username: string,
    password: string,
    setIsLoading: (v: boolean) => void,
    setError: (e: ErrorResponse) => void,
  ) => {
    setError(null);
    setIsLoading(true);

    const result = LoginSchema.safeParse({ username, password });
    if (!result.success) {
      setError(result.error.issues.map((i) => i.message));
      setIsLoading(false);
      return;
    }

    try {
      const response = await AuthService.login(result.data);
      if (!response.success || !response.data) {
        setError(response.error);
        setIsLoading(false);
        return;
      }

      setSession(response.data);

      // cargar chats
      await getChats();

      setView(Paginas.CHATS);
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    nombre: string,
    username: string,
    password: string,
    foto: string | null | undefined,
    setIsLoading: (v: boolean) => void,
    setError: (e: ErrorResponse) => void,
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

      setSession(response.data);
      await getChats();
      setView(Paginas.CHATS);
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error al registrar usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register };
};
