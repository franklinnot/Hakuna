import { AppStore } from '../../../../../../../../application/store/app.store';
import { useMemo } from 'react';
import type { IChatGrupalResponse } from '../../../../../../../../domain/responses/chats.responses';

export const useChatsGrupalesFlow = () => {
  const chatsGrupales = AppStore((s) => s.chatsGrupales);

  // Ordenar chats grupales por fecha de último mensaje (más nuevo arriba)
  const sortedChatsGrupales = useMemo(() => {
    if (!chatsGrupales) return [];

    return [...chatsGrupales].sort((a, b) => {
      const fechaA = a.ultimo_mensaje
        ? new Date(a.ultimo_mensaje.createdAt).getTime()
        : 0;
      const fechaB = b.ultimo_mensaje
        ? new Date(b.ultimo_mensaje.createdAt).getTime()
        : 0;
      return fechaB - fechaA;
    }) as IChatGrupalResponse[];
  }, [chatsGrupales]);

  return sortedChatsGrupales;
};
