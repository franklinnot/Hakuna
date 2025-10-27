import { AuthService } from '../../../infraestructure/rest/auth/auth.service';
import { AppStore } from '../../store/app.store';
import { useGetChats } from '../chats/useGetChats';
import { useGetMensajes } from '../mensajes/useGetMensajes';
import { LoginSchema } from '../../../infraestructure/rest/auth/auth.dtos';
import type { ErrorResponse } from '../../response';
import { Paginas } from '../../../domain/enums';
import { connectSocket } from '../../../infraestructure/socket/socket.client';
import {
  IChatGrupalResponse,
  IChatPrivadoResponse,
} from '../../../domain/responses/chats.responses';

export const useIniciarSesion = () => {
  const { setSession, setView } = AppStore();
  const { getChats } = useGetChats();
  const { getMensajes } = useGetMensajes();

  const iniciarSesion = async (
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

      // guardar sesión
      setSession(response.data);

      const [chatsPrivados, chatsGrupales] = await getChats(setError);

      // conectarse al socket
      connectSocket(response.data.token);

      await getMensajes(
        setError,
        chatsPrivados as IChatPrivadoResponse[],
        chatsGrupales as IChatGrupalResponse[],
      );

      // ir a la vista principal
      setView(Paginas.CHATS);
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return { iniciarSesion };
};
