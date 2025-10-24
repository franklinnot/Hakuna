import { MensajesService } from '../mensajes.service';
import { useAuthStore } from '../../auth/hooks/useAuthStore/useAuthStore';
import { IMensajeResponse } from '../mensajes.responses';
import { ICrearArchivo } from '../mensajes.dtos';
import { IChatPrivadoResponse } from '../../chats/chats.responses';
import { IUsuarioResponse } from '../../usuarios/usuarios.responses';
import { ChatsService } from '../../chats/chats.service';
import { Estado } from '../../../shared/domain/enums';

export type IMensajeResponseWithState = IMensajeResponse & {
  estado_envio?: 'sending' | 'sent' | 'error';
};

export const useMensajesService = () => {
  const {
    setChatsPrivados,
    setChatsGrupales,
    chatsPrivados,
    chatsGrupales,
    replaceTempChat,
    updateMensajesChatPrivado,
  } = useAuthStore();

  const getUltimoMensaje = (data: IMensajeResponse[]) => {
    return data.reduce((prev, curr) => {
      return new Date(prev.createdAt) > new Date(curr.createdAt) ? prev : curr;
    }, data[0]);
  };

  // cargar mensajes privados de todos los chats
  const getMensajesPrivados = async () => {
    try {
      const nuevos = await Promise.all(
        chatsPrivados!.map(async (chat) => {
          if (chat.historial_mensajes?.length) return chat; // ya cargado
          const resp = await MensajesService.getMensajesPrivados(chat.id_chat);
          if (resp.success && resp.data) {
            return {
              ...chat,
              historial_mensajes: resp.data,
              ultimo_mensaje: getUltimoMensaje(resp.data),
            };
          }
          return chat;
        }),
      );
      setChatsPrivados(nuevos);
    } catch (err) {
      console.warn('Error cargando mensajes privados:', err);
    }
  };

  //  cargar mensajes grupales
  const getMensajesGrupales = async () => {
    try {
      const nuevos = await Promise.all(
        chatsGrupales!.map(async (chat) => {
          if (chat.historial_mensajes?.length) return chat;
          const resp = await MensajesService.getMensajesGrupales(chat.id_chat);
          if (resp.success && resp.data) {
            return {
              ...chat,
              historial_mensajes: resp.data,
              ultimo_mensaje: getUltimoMensaje(resp.data),
            };
          }
          return chat;
        }),
      );
      setChatsGrupales(nuevos);
    } catch (err) {
      console.warn('Error cargando mensajes grupales:', err);
    }
  };

  // carga todos los mensajes
  const getMensajes = async () => {
    const privadosIncompletos = chatsPrivados!.some(
      (c) => !c.historial_mensajes?.length,
    );
    const grupalesIncompletos = chatsGrupales!.some(
      (c) => !c.historial_mensajes?.length,
    );

    if (!privadosIncompletos && !grupalesIncompletos) return;
    if (privadosIncompletos) await getMensajesPrivados();
    if (grupalesIncompletos) await getMensajesGrupales();
  };

  const enviarMensajePrivado = async (
    chat: IChatPrivadoResponse,
    usuario: IUsuarioResponse,
    descripcion: string,
    archivos: ICrearArchivo[] | undefined,
    setMensajes: React.Dispatch<
      React.SetStateAction<IMensajeResponseWithState[]>
    >,
    setDescripcion: (v: string) => void,
    setArchivos: (v: ICrearArchivo[] | undefined) => void,
    ordenar: (arr: IMensajeResponseWithState[]) => IMensajeResponseWithState[],
  ) => {
    if (!descripcion.trim() && !archivos?.length) return;

    const tempId = `temp-msg-${Date.now()}`;
    const tempMensaje: IMensajeResponseWithState = {
      id_mensaje: tempId,
      id_usuario: usuario.id_usuario,
      id_chat: chat.id_chat,
      es_grupal: false,
      descripcion,
      has_files: !!archivos?.length,
      createdAt: new Date(),
      archivos: [],
      estado: Estado.HABILITADO,
      estado_envio: 'sending',
    };

    setMensajes((prev) => ordenar([...prev, tempMensaje]));
    setDescripcion('');
    setArchivos(undefined);

    try {
      const resp = await MensajesService.enviarMensajePrivado({
        id_usuarioB: chat.usuarioB.id_usuario,
        descripcion: tempMensaje.descripcion || undefined,
        archivos,
      });

      if (resp.success && resp.data) {
        const serverMsg = resp.data as IMensajeResponse;

        setMensajes((prev) =>
          ordenar(
            prev.map((m) =>
              m.id_mensaje === tempId
                ? ({
                    ...serverMsg,
                    estado_envio: 'sent',
                  } as IMensajeResponseWithState)
                : m,
            ),
          ),
        );

        // Si el chat era temporal, reemplazarlo por el real
        if (
          chat.id_chat?.toString().startsWith('temp-') &&
          serverMsg.id_chat &&
          serverMsg.id_chat !== chat.id_chat
        ) {
          const respChat = await ChatsService.getChatPrivado(serverMsg.id_chat);
          if (respChat.success && respChat.data)
            replaceTempChat(chat.id_chat, respChat.data);
          else
            replaceTempChat(chat.id_chat, {
              id_chat: serverMsg.id_chat,
              usuarioB: chat.usuarioB,
              historial_mensajes: [serverMsg],
              ultimo_mensaje: serverMsg,
            } as IChatPrivadoResponse);
        } else {
          updateMensajesChatPrivado(serverMsg.id_chat, serverMsg);
        }
      } else {
        // Error en respuesta
        setMensajes((prev) =>
          prev.map((m) =>
            m.id_mensaje === tempId ? { ...m, estado_envio: 'error' } : m,
          ),
        );
      }
    } catch {
      // Error de red o excepción
      setMensajes((prev) =>
        prev.map((m) =>
          m.id_mensaje === tempId ? { ...m, estado_envio: 'error' } : m,
        ),
      );
    }
  };

  return {
    getMensajesPrivados,
    getMensajesGrupales,
    getMensajes,
    enviarMensajePrivado,
  };
};
