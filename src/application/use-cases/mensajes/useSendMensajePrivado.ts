import { MensajesService } from '../../../infraestructure/rest/mensajes/mensajes.service';
import { AppStore } from '../../store/app.store';
import { IMensajePrivadoResponse } from '../../../domain/responses/mensajes.responses';
import { IChatPrivadoResponse } from '../../../domain/responses/chats.responses';
import { IUsuarioResponse } from '../../../domain/responses/usuarios.responses';
import { ICrearArchivo } from '../../../infraestructure/rest/mensajes/mensajes.dtos';
import { Estado, EstadoEnvioMensaje } from '../../../domain/enums';
import { v4 as uuidv4 } from 'uuid';

export const useSendMensajePrivado = () => {
  const {
    addMensajeToChatPrivado,
    updateMensajePrivado,
    replaceMensajePrivadoTemporal,
  } = AppStore();

  const sendMensajePrivado = async (
    chat: IChatPrivadoResponse,
    usuario: IUsuarioResponse,
    descripcion?: string,
    archivos?: ICrearArchivo[],
  ) => {
    if (!descripcion?.trim() && !archivos?.length) return;

    // crear temporal e insertar inmediatamente
    const tempId = `temp-${uuidv4()}`;
    const tempMensaje: IMensajePrivadoResponse = {
      id_mensaje: tempId,
      id_usuario: usuario.id_usuario,
      id_chat: chat.id_chat,
      is_group: false,
      descripcion: descripcion ?? null,
      has_files: !!archivos?.length,
      createdAt: new Date(),
      archivos: [],
      estado: Estado.HABILITADO,
      estado_envio: EstadoEnvioMensaje.SENDING,
      id_usuarioB: chat.usuarioB.id_usuario,
    };

    addMensajeToChatPrivado(chat.id_chat, tempMensaje);

    try {
      // enviar mensaje al servidor
      const resp = await MensajesService.enviarMensajePrivado({
        id_usuarioB: chat.usuarioB.id_usuario,
        descripcion,
        archivos,
      });

      if (!resp.success || !resp.data) {
        // marcar temporal como error
        updateMensajePrivado(tempId, {
          estado_envio: EstadoEnvioMensaje.ERROR,
        } as IMensajePrivadoResponse);
        return;
      }

      const serverMsg = resp.data as IMensajePrivadoResponse;

      // reemplazar temporal por mensaje real
      replaceMensajePrivadoTemporal(chat.id_chat, tempId, {
        ...serverMsg,
        estado_envio: EstadoEnvioMensaje.SENT,
      } as IMensajePrivadoResponse);
    } catch (err) {
      console.error('Error enviando mensaje:', err);
      updateMensajePrivado(tempId, {
        estado_envio: EstadoEnvioMensaje.ERROR,
      } as IMensajePrivadoResponse);
    }
  };

  return { sendMensajePrivado };
};
