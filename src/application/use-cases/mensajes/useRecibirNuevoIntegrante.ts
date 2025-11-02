import { useEffect, useRef } from 'react';
import { getSocketClient } from '../../../infraestructure/socket/socket.client';
import { AppStore } from '../../store/app.store';
import { TipoEvento } from '../../../domain/enums';
import { ChatsService } from '../../../infraestructure/rest/chats/chats.service';

export const useRecibirNuevoIntegrante = () => {
  const { updateChatGrupal, addChatGrupal } = AppStore();
  const debounceTimers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const socket = getSocketClient();

    const handleNuevoIntegrante = async (payload: {
      id_chat: string;
      nuevo_miembro: any;
      chat_actualizado: any;
    }) => {
      console.log('[Socket] Nuevo integrante agregado:', payload);
      
      // Cancelar timer anterior para este chat si existe
      const existingTimer = debounceTimers.current.get(payload.id_chat);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Crear nuevo timer con debounce de 300ms
      const newTimer = setTimeout(async () => {
        try {
          // Obtener el chat actualizado desde el servidor
          const response = await ChatsService.getChatGrupal(payload.id_chat);
          
          if (response.success && response.data) {
            // Verificar si el chat ya existe en la lista local
            const chatsGrupales = AppStore.getState().chatsGrupales;
            const chatExiste = chatsGrupales.some(chat => chat.id_chat === payload.id_chat);
            
            if (chatExiste) {
              // Actualizar el chat existente
              updateChatGrupal(response.data);
              console.log('[Socket] Chat grupal actualizado con nuevo integrante');
            } else {
              // Añadir el nuevo chat a la lista
              addChatGrupal(response.data);
              console.log('[Socket] Nuevo chat grupal añadido:', response.data.nombre);
            }
          }
        } catch (error) {
          console.error('[Socket] Error al actualizar chat después de nuevo integrante:', error);
        } finally {
          // Limpiar el timer del mapa
          debounceTimers.current.delete(payload.id_chat);
        }
      }, 300);

      // Guardar el nuevo timer
      debounceTimers.current.set(payload.id_chat, newTimer);
    };

    socket.on(TipoEvento.NUEVO_INTEGRANTE, handleNuevoIntegrante);
    
    return () => {
      socket.off(TipoEvento.NUEVO_INTEGRANTE, handleNuevoIntegrante);
      // Limpiar todos los timers al desmontar
      debounceTimers.current.forEach(timer => clearTimeout(timer));
      debounceTimers.current.clear();
    };
  }, []); // Array vacío - las funciones del store son estables
};