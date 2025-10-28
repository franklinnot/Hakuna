import { useEffect, useState } from 'react';
import { ChatsService } from '../../../infraestructure/rest/chats/chats.service';
import type { IChatPrivadoResponse } from '../../../domain/responses/chats.responses';

export const useGetContactosFrecuentes = (setIsLoading: (v: boolean) => void) => {
  const [chatsRecientes, setChatsRecientes] = useState<IChatPrivadoResponse[]>(
    [],
  );

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const response = await ChatsService.getChatsPrivados();
        if (response.success && response.data) {
          const ordenados = response.data.sort((a, b) => {
            const fechaA = a.ultimo_mensaje?.createdAt || a.createdAt;
            const fechaB = b.ultimo_mensaje?.createdAt || b.createdAt;
            return new Date(fechaB).getTime() - new Date(fechaA).getTime();
          });
          setChatsRecientes(ordenados);
        } else {
          setChatsRecientes([]);
        }
      } catch (error) {
        console.error('Error cargando chats recientes:', error);
        setChatsRecientes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [setIsLoading]);

  return { chatsRecientes };
};
