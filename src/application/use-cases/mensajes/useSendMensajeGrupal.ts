import { useState } from 'react';
import { MensajesService } from '../../../infraestructure/rest/mensajes/mensajes.service';
import { AppStore } from '../../store/app.store';
import { IMensajeResponse } from '../../../domain/responses/mensajes.responses';
import { ICrearArchivo, EnviarMensajeGrupalDto } from '../../../infraestructure/rest/mensajes/mensajes.dtos';
import { Estado, EstadoEnvioMensaje } from '../../../domain/enums';

interface SendMensajeGrupalParams {
  id_chat: string;
  descripcion?: string;
  archivos?: ICrearArchivo[];
}

export const useSendMensajeGrupal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    addMensajeToChatGrupal,
    updateMensajeGrupal,
    replaceMensajeGrupalTemporal,
    updateChatGrupal,
    usuario,
    chatsGrupales,
  } = AppStore();

  const sendMensajeGrupal = async (params: SendMensajeGrupalParams) => {
    const { id_chat, descripcion, archivos } = params;
    
    // Validaciones iniciales
    if (!usuario) {
      setError('Usuario no autenticado');
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    if (!id_chat?.trim()) {
      setError('ID de chat requerido');
      return { success: false, error: 'ID de chat requerido' };
    }
    
    if (!descripcion?.trim() && !archivos?.length) {
      setError('Mensaje o archivos requeridos');
      return { success: false, error: 'Mensaje o archivos requeridos' };
    }

    setError(null);

    setIsLoading(true);

    // crear temporal e insertar inmediatamente
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const tempMensaje: IMensajeResponse = {
      id_mensaje: tempId,
      id_usuario: usuario.id_usuario,
      id_chat: id_chat,
      is_group: true,
      descripcion: descripcion ?? null,
      has_files: !!archivos?.length,
      createdAt: new Date(),
      archivos: [],
      estado: Estado.HABILITADO,
      estado_envio: EstadoEnvioMensaje.SENDING,
    };

    addMensajeToChatGrupal(id_chat, tempMensaje);

    try {
      // enviar mensaje al servidor
      const dto: EnviarMensajeGrupalDto = {
        descripcion,
        archivos,
      };
      const resp = await MensajesService.enviarMensajeGrupal(id_chat, dto);

      if (!resp.success || !resp.data) {
        let errorMsg = 'Error al enviar mensaje';
        
        if (resp.error) {
          if (typeof resp.error === 'string') {
            errorMsg = resp.error;
          } else if (Array.isArray(resp.error)) {
            errorMsg = resp.error.join(', ');
          } else if (typeof resp.error === 'object') {
            errorMsg = JSON.stringify(resp.error);
          }
        }
        
        setError(errorMsg);
        // marcar temporal como error
        updateMensajeGrupal(tempId, {
          ...tempMensaje,
          estado_envio: EstadoEnvioMensaje.ERROR,
        });
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }

      const serverMsg = resp.data;

      // reemplazar temporal por mensaje real
      replaceMensajeGrupalTemporal(id_chat, tempId, {
        ...serverMsg,
        estado_envio: EstadoEnvioMensaje.SENT,
      });

      // actualizar el último mensaje del chat - necesitamos obtener el chat actual
      const chatActual = chatsGrupales.find(c => c.id_chat === id_chat);
      if (chatActual) {
        updateChatGrupal({
          ...chatActual,
          ultimo_mensaje: serverMsg,
        });
      }
      
      setIsLoading(false);
      return { success: true, data: serverMsg };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error inesperado al enviar mensaje';
      console.error('Error enviando mensaje grupal:', err);
      setError(errorMsg);
      
      updateMensajeGrupal(tempId, {
        ...tempMensaje,
        estado_envio: EstadoEnvioMensaje.ERROR,
      });
      
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  return { sendMensajeGrupal, isLoading, error };
};