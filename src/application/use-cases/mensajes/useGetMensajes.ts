import { MensajesService } from '../../../infraestructure/rest/mensajes/mensajes.service';
import { AppStore } from '../../store/app.store';
import { IMensajeResponse } from '../../../domain/responses/mensajes.responses';
import type { ErrorResponse } from '../../response';
import {
  IChatGrupalResponse,
  IChatPrivadoResponse,
} from '../../../domain/responses/chats.responses';

export const useGetMensajes = () => {
  const { setChatsPrivados, setChatsGrupales } = AppStore();

  const getUltimoMensaje = (
    mensajes: IMensajeResponse[],
  ): IMensajeResponse | null =>
    mensajes?.length
      ? mensajes.reduce((a, b) => (b.createdAt > a.createdAt ? b : a))
      : null;

  const getMensajes = async (
    setError: (e: ErrorResponse) => void,
    chatsPrivados: IChatPrivadoResponse[],
    chatsGrupales: IChatGrupalResponse[],
  ) => {
    setError(null);

    try {
      if (!chatsPrivados.length && !chatsGrupales.length) {
        console.warn('getMensajes: no hay chats cargados aún.');
        return;
      }

      const nuevosPrivados = await Promise.all(
        chatsPrivados.map(async (chat) => {
          if (chat.historial_mensajes?.length) return chat;
          const resp = await MensajesService.getMensajesPrivados(chat.id_chat);
          if (resp.success && resp.data)
            return {
              ...chat,
              historial_mensajes: resp.data,
              ultimo_mensaje: getUltimoMensaje(resp.data),
            };
          return chat;
        }),
      );
      setChatsPrivados(nuevosPrivados);

      const nuevosGrupales = await Promise.all(
        chatsGrupales.map(async (chat) => {
          if (chat.historial_mensajes?.length) return chat;
          const resp = await MensajesService.getMensajesGrupales(chat.id_chat);
          if (resp.success && resp.data)
            return {
              ...chat,
              historial_mensajes: resp.data,
              ultimo_mensaje: getUltimoMensaje(resp.data),
            };
          return chat;
        }),
      );
      setChatsGrupales(nuevosGrupales);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
      setError('No se pudieron cargar los mensajes.');
    }
  };

  return { getMensajes };
};
