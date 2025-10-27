import { ChatsService } from '../../../infraestructure/rest/chats/chats.service';
import { AppStore } from '../../store/app.store';
import type { ErrorResponse } from '../../response';

export const useGetChatPrivado = () => {
  const { addChatPrivado, setIdChatActivo } = AppStore();

  const getChat = async (
    id_chat: string,
    setIsLoading: (v: boolean) => void,
    setError: (e: ErrorResponse) => void,
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      const rpta = await ChatsService.getChatPrivado(id_chat);

      if (rpta.success && rpta.data) {
        addChatPrivado(rpta.data);
        setIdChatActivo(rpta.data.id_chat);
        return true;
      }

      setError(rpta.error ?? 'No se encontró el chat solicitado.');
      return false;
    } catch (err) {
      console.error('Error obteniendo chat privado:', err);
      setError('No se pudo cargar el chat.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { getChat };
};
