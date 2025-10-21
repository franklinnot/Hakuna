import { useState } from 'react';
import { ChatsService } from '../chats.service';
import { useAuthStore } from '../../auth/hooks/useAuthStore';
import type { ErrorResponse } from '../../../shared/application/response';

export const useChatsService = () => {
  const { setChatsPrivados, setChatsGrupales } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse>(null);

  // cargar chats
  const getChats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [privadosResp, grupalesResp] = await Promise.all([
        ChatsService.getChatsPrivados(),
        ChatsService.getChatsGrupales(),
      ]);

      if (privadosResp.success && privadosResp.data)
        setChatsPrivados(privadosResp.data);
      if (grupalesResp.success && grupalesResp.data)
        setChatsGrupales(grupalesResp.data);

      return true;
    } catch (err) {
      console.error('Error cargando solo chats:', err);
      setError('No se pudieron cargar los chats.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getChats,
  };
};
