import { MensajesService } from '../mensajes.service';
import { useAuthStore } from '../../auth/hooks/useAuthStore';
import { IMensajeResponse } from '../mensajes.responses';

export const useMensajesService = () => {
  const { setChatsPrivados, setChatsGrupales, chatsPrivados, chatsGrupales } =
    useAuthStore();

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

  return {
    getMensajesPrivados,
    getMensajesGrupales,
    getMensajes,
  };
};
