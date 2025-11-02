import { useEffect, useRef } from 'react';
import { getSocketClient } from '../../../infraestructure/socket/socket.client';
import { AppStore } from '../../store/app.store';
import { TipoEvento } from '../../../domain/enums';
import { ChatsService } from '../../../infraestructure/rest/chats/chats.service';

export const useRecibirIntegranteEliminado = () => {
  const { removeChatGrupal, updateChatGrupal, getChatActivo, setIdChatActivo } = AppStore();
  const debounceTimers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const socket = getSocketClient();

    const handleIntegranteEliminado = async (payload: {
      id_chat: string;
      miembro_eliminado: any;
      chat_actualizado?: any;
      eliminado_del_grupo?: boolean;
    }) => {
      try {
        console.log('[Socket] Integrante eliminado:', payload);
        
        // Validar payload
        if (!payload || !payload.id_chat) {
          console.warn('[Socket] Payload inválido para INTEGRANTE_ELIMINADO:', payload);
          return;
        }
        
        const { id_chat, eliminado_del_grupo, chat_actualizado } = payload;
        
        // Cancelar timer anterior para este chat si existe
        const existingTimer = debounceTimers.current.get(id_chat);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        // Crear nuevo timer con debounce de 300ms
        const newTimer = setTimeout(async () => {
          try {
            if (eliminado_del_grupo) {
              console.log('[Socket] Usuario eliminado del grupo - redirigiendo si es necesario');
              // Si el usuario actual fue eliminado y está viendo este chat, redirigir a la lista de chats
              const chatActivo = getChatActivo();
              if (chatActivo && chatActivo.id_chat === id_chat) {
                console.log('[Socket] Redirigiendo a lista de chats porque el usuario fue eliminado del chat activo');
                setIdChatActivo(null);
              }
              // No necesitamos actualizar el chat si el usuario fue eliminado
              return;
            }

            // Para otros miembros eliminados, obtener el chat actualizado del servidor
            console.log('[Socket] Actualizando chat después de eliminación de otro miembro');
            const response = await ChatsService.getChatGrupal(id_chat);
            
            if (response.success && response.data) {
              updateChatGrupal(response.data);
              console.log('[Socket] Chat grupal actualizado después de eliminación de miembro');
            } else {
              console.warn('[Socket] No se pudo obtener el chat actualizado:', response.error);
            }
          } catch (error) {
            console.error('[Socket] Error al procesar eliminación de integrante:', error);
          } finally {
            // Limpiar el timer del mapa
            debounceTimers.current.delete(id_chat);
          }
        }, 300);

        // Guardar el nuevo timer
        debounceTimers.current.set(id_chat, newTimer);
      } catch (error) {
        console.error('[Socket] Error al manejar integrante eliminado:', error);
      }
    };

    socket.on(TipoEvento.INTEGRANTE_ELIMINADO, handleIntegranteEliminado);
    
    return () => {
      socket.off(TipoEvento.INTEGRANTE_ELIMINADO, handleIntegranteEliminado);
      // Limpiar todos los timers al desmontar
      debounceTimers.current.forEach(timer => clearTimeout(timer));
      debounceTimers.current.clear();
    };
  }, []); // Array vacío - las funciones del store son estables
};