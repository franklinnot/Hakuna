import { useEffect } from 'react';
import { getSocketClient } from '../../../infraestructure/socket/socket.client';
import { AppStore } from '../../store/app.store';
import { TipoEvento } from '../../../domain/enums';
import { ChatsService } from '../../../infraestructure/rest/chats/chats.service';

export const useRecibirNuevoIntegrante = () => {
  const { updateChatGrupal, getChatActivo } = AppStore();

  useEffect(() => {
    const socket = getSocketClient();

    const handleNuevoIntegrante = async (payload: {
      id_chat: string;
      nuevo_miembro: any;
      chat_actualizado: any;
    }) => {
      console.log('[Socket] Nuevo integrante agregado:', payload);
      
      try {
        // Obtener el chat actualizado desde el servidor
        const response = await ChatsService.getChatGrupal(payload.id_chat);
        
        if (response.success && response.data) {
          // Actualizar el chat en el store con los datos más recientes
          updateChatGrupal(response.data);
          
          console.log('[Socket] Chat grupal actualizado con nuevo integrante');
        }
      } catch (error) {
        console.error('[Socket] Error al actualizar chat después de nuevo integrante:', error);
      }
    };

    socket.on(TipoEvento.NUEVO_INTEGRANTE, handleNuevoIntegrante);
    
    return () => {
      socket.off(TipoEvento.NUEVO_INTEGRANTE, handleNuevoIntegrante);
    };
  }, [updateChatGrupal]);
};