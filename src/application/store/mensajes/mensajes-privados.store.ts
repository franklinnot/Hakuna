import { StateCreator } from 'zustand';
import { IAppStore } from '../app.store.interface';
import { IChatPrivadoResponse } from '../../../domain/responses/chats.responses';

type IMensajesPrivadosStore = Pick<
  IAppStore,
  | 'addMensajeToChatPrivado'
  | 'updateMensajePrivado'
  | 'replaceMensajePrivadoTemporal'
>;

export const MensajesPrivadosStore: StateCreator<
  IAppStore,
  [],
  [],
  IMensajesPrivadosStore
> = (set) => ({
  addMensajeToChatPrivado: (id_chat, nuevoMensaje) =>
    set((state) => {
      const chats = state.chatsPrivados.map((chat) => {
        if (chat.id_chat !== id_chat) return chat;

        const yaExiste = chat.historial_mensajes.some(
          (m) => m.id_mensaje === nuevoMensaje.id_mensaje,
        );

        if (yaExiste) return chat; // no agregar si ya está

        return {
          ...chat,
          historial_mensajes: [...chat.historial_mensajes, nuevoMensaje],
          ultimo_mensaje: nuevoMensaje,
        } as IChatPrivadoResponse;
      });

      return { chatsPrivados: chats };
    }),

  updateMensajePrivado: (id_mensaje, data) =>
    set((state) => {
      const chats = state.chatsPrivados.map((chat) => {
        const historial = chat.historial_mensajes.map((m) =>
          m.id_mensaje === id_mensaje ? { ...m, ...data } : m,
        );

        const mensajeActualizado = historial.find(
          (m) => m.id_mensaje === id_mensaje,
        );

        return {
          ...chat,
          historial_mensajes: historial,
          // Si el mensaje actualizado es el último del chat, también se actualiza allí
          ultimo_mensaje:
            chat.ultimo_mensaje?.id_mensaje === id_mensaje
              ? mensajeActualizado ?? chat.ultimo_mensaje
              : chat.ultimo_mensaje,
        } as IChatPrivadoResponse;
      });

      return { chatsPrivados: chats };
    }),

  // dentro de MensajesPrivadosStore
  replaceMensajePrivadoTemporal: (oldChatId, tempMensajeId, serverMsg) =>
    set((state) => {
      const chats = state.chatsPrivados.map((chat) => {
        if (chat.id_chat !== oldChatId) return chat;

        // copiar historial para mutar sin afectar referencia
        const historial = [...(chat.historial_mensajes ?? [])];

        // evitar duplicados: si ya existe serverMsg por id, lo marcamos
        const serverIdx = historial.findIndex(
          (m) => m.id_mensaje === serverMsg.id_mensaje,
        );

        const tempIdx = historial.findIndex(
          (m) => m.id_mensaje === tempMensajeId,
        );

        if (tempIdx !== -1) {
          if (serverIdx !== -1) {
            // caso: el serverMsg ya fue insertado (por socket u otro)
            // => eliminamos sólo el temporal
            historial.splice(tempIdx, 1);
          } else {
            // reemplazar el temporal *en la misma posición* por serverMsg
            historial[tempIdx] = serverMsg;
          }
        } else {
          // no existe el temporal en este chat (raro), insertar serverMsg si no existe
          if (serverIdx === -1) {
            historial.push(serverMsg);
          }
        }

        // actualizar ultimo_mensaje si corresponde
        const ultimo = historial[historial.length - 1] ?? null;
        return {
          ...chat,
          historial_mensajes: historial,
          ultimo_mensaje: ultimo,
        } as IChatPrivadoResponse;
      });

      return { chatsPrivados: chats };
    }),
});
