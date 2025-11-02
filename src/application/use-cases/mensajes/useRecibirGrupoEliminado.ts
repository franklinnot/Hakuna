import { useEffect } from 'react';
import { getSocketClient } from '../../../infraestructure/socket/socket.client';
import { AppStore } from '../../store/app.store';
import { TipoEvento } from '../../../domain/enums';

export const useRecibirGrupoEliminado = () => {
  const { removeChatGrupal, getChatActivo, setIdChatActivo } = AppStore();

  useEffect(() => {
    const socket = getSocketClient();

    const handleGrupoEliminado = async (payload: {
      id_chat: string;
      nombre_grupo: string;
      mensaje: string;
    }) => {
      try {
        console.log('[Socket] Grupo eliminado:', payload);
        
        // Validar payload
        if (!payload || !payload.id_chat) {
          console.warn('[Socket] Payload inválido para GRUPO_ELIMINADO:', payload);
          return;
        }
        
        const { id_chat, nombre_grupo } = payload;
        
        // Si el usuario está viendo este chat, redirigir a la lista de chats
        const chatActivo = getChatActivo();
        if (chatActivo && chatActivo.id_chat === id_chat) {
          console.log('[Socket] Redirigiendo a lista de chats porque el grupo activo fue eliminado');
          setIdChatActivo(null);
        }
        
        // Remover el chat de la lista de chats grupales
        removeChatGrupal(id_chat);
        console.log(`[Socket] Grupo "${nombre_grupo}" eliminado y removido de la lista`);
        
      } catch (error) {
        console.error('[Socket] Error al manejar grupo eliminado:', error);
      }
    };

    socket.on(TipoEvento.GRUPO_ELIMINADO, handleGrupoEliminado);
    
    return () => {
      socket.off(TipoEvento.GRUPO_ELIMINADO, handleGrupoEliminado);
    };
  }, []); // Array vacío - las funciones del store son estables
};