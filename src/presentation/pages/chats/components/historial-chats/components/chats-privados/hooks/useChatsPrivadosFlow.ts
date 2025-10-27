import { AppStore } from '../../../../../../../../application/store/app.store';
import { useMemo } from 'react';
import type { IChatPrivadoResponse } from '../../../../../../../../domain/responses/chats.responses';

export const useChatsPrivadosFlow = () => {
  const chatsPrivados = AppStore((s) => s.chatsPrivados);

  // Combinar y ordenar chats
  const mergedAndSorted = useMemo(() => {
    const map = new Map<
      string,
      IChatPrivadoResponse | Partial<IChatPrivadoResponse>
    >();

    for (const c of chatsPrivados) {
      if (!c.id_chat || c.historial_mensajes.length == 0) continue;

      const conflict = Array.from(map.values()).find(
        (v) =>
          v.usuarioB?.id_usuario &&
          v.usuarioB.id_usuario === c.usuarioB?.id_usuario,
      );

      if (conflict && conflict.id_chat?.startsWith('temp-')) {
        map.delete(conflict.id_chat);
      }

      map.set(c.id_chat, c);
    }

    // Ordenar por fecha de último mensaje (más nuevo arriba)
    return Array.from(map.values()).sort((a, b) => {
      const fechaA = a.ultimo_mensaje
        ? new Date(a.ultimo_mensaje.createdAt).getTime()
        : 0;
      const fechaB = b.ultimo_mensaje
        ? new Date(b.ultimo_mensaje.createdAt).getTime()
        : 0;
      return fechaB - fechaA;
    }) as IChatPrivadoResponse[];
  }, [chatsPrivados]);

  return mergedAndSorted;
};
