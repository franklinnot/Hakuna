import { ChatsService } from '../../../infraestructure/rest/chats/chats.service';
import { AppStore } from '../../store/app.store';
import type { ErrorResponse } from '../../response';

export const useGetChats = () => {
  const { setChatsPrivados, setChatsGrupales } = AppStore();

  const getChats = async (setError: (e: ErrorResponse) => void) => {
    setError(null);
    try {
      const [privadosResp, grupalesResp] = await Promise.all([
        ChatsService.getChatsPrivados(),
        ChatsService.getChatsGrupales(),
      ]);

      const chatsPrivados =
        privadosResp.success && privadosResp.data ? privadosResp.data : [];
      const chatsGrupales =
        grupalesResp.success && grupalesResp.data ? grupalesResp.data : [];

      setChatsPrivados(chatsPrivados);
      setChatsGrupales(chatsGrupales);

      if (!privadosResp.success)
        setError(privadosResp.error ?? 'Error cargando chats privados.');
      if (!grupalesResp.success)
        setError(grupalesResp.error ?? 'Error cargando chats grupales.');

      // devolvemos ambas listas
      return [chatsPrivados, chatsGrupales] as const;
    } catch (err) {
      console.error('Error cargando chats:', err);
      setError('No se pudieron cargar los chats.');
      return [[], []] as const;
    }
  };

  return { getChats };
};
