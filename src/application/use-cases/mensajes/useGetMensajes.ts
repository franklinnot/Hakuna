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

  const mergeMensajes = (
    actuales: IMensajeResponse[] = [],
    nuevos: IMensajeResponse[] = [],
  ): IMensajeResponse[] => {
    const mapa = new Map<string, IMensajeResponse>();
    [...actuales, ...nuevos].forEach((m) => mapa.set(m.id_mensaje, m));
    return Array.from(mapa.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  };

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

      // --- PRIVADOS ---
      const nuevosPrivados = await Promise.all(
        chatsPrivados.map(async (chat) => {
          const resp = await MensajesService.getMensajesPrivados(chat.id_chat);
          if (resp.success && resp.data) {
            const chatActual = AppStore.getState().chatsPrivados.find(
              (c) => c.id_chat === chat.id_chat,
            );
            const historialExistente = chatActual?.historial_mensajes ?? [];
            const historialFusionado = mergeMensajes(
              historialExistente,
              resp.data,
            );

            return {
              ...chat,
              historial_mensajes: historialFusionado,
              ultimo_mensaje: getUltimoMensaje(historialFusionado),
            };
          }
          return chat;
        }),
      );
      setChatsPrivados(nuevosPrivados as IChatPrivadoResponse[]);

      // --- GRUPALES ---
      const nuevosGrupales = await Promise.all(
        chatsGrupales.map(async (chat) => {
          const resp = await MensajesService.getMensajesGrupales(chat.id_chat);
          if (resp.success && resp.data) {
            const chatActual = AppStore.getState().chatsGrupales.find(
              (c) => c.id_chat === chat.id_chat,
            );
            const historialExistente = chatActual?.historial_mensajes ?? [];
            const historialFusionado = mergeMensajes(
              historialExistente,
              resp.data,
            );

            return {
              ...chat,
              historial_mensajes: historialFusionado,
              ultimo_mensaje: getUltimoMensaje(historialFusionado),
            };
          }
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
