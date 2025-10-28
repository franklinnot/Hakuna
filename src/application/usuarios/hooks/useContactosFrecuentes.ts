import { useState, useEffect } from 'react';
import { ChatsService } from '../../chats/chats.service';
import type { IUsuarioResponse } from '../usuarios.responses';
import type { IChatPrivadoResponse } from '../../chats/chats.responses';

export const useContactosFrecuentes = () => {
  const [chatsRecientes, setChatsRecientes] = useState<IChatPrivadoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatsRecientes = async () => {
      try {
        const response = await ChatsService.getChatsPrivados();
        if (response.success && response.data) {
          // Ordenar por fecha de último mensaje (más reciente primero)
          const chatsOrdenados = response.data.sort((a, b) => {
            const fechaA = a.ultimo_mensaje?.createdAt || a.createdAt;
            const fechaB = b.ultimo_mensaje?.createdAt || b.createdAt;
            return new Date(fechaB).getTime() - new Date(fechaA).getTime();
          });
          setChatsRecientes(chatsOrdenados);
        }
      } catch (error) {
        console.error('Error cargando chats recientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatsRecientes();
  }, []);

  const getUsuariosCombinados = (): IUsuarioResponse[] => {
    // Solo devolver usuarios con los que se ha tenido conversaciones
    // Ordenados por frecuencia de mensajes (más recientes primero)
    return chatsRecientes.map(chat => chat.usuarioB);
  };

  return {
    chatsRecientes,
    loading,
    isLoading: loading,
    getUsuariosCombinados
  };
};