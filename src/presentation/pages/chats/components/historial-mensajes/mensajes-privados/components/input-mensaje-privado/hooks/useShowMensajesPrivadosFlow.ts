import { useRef, useLayoutEffect, useMemo } from 'react';
import { AppStore } from '../../../../../../../../../application/store/app.store';
import { IMensajeResponse } from '../../../../../../../../../domain/responses/mensajes.responses';
import { IChatPrivadoResponse } from '../../../../../../../../../domain/responses/chats.responses';

export const useShowMensajesPrivadosFlow = (chat: IChatPrivadoResponse) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // obtener mensajes directamente del store (reactivo)
  const historial = AppStore(
    (s) =>
      s.chatsPrivados?.find((c) => c.id_chat === chat.id_chat)
        ?.historial_mensajes ?? [],
  );

  // filtrar duplicados y ordenar cronológicamente
  const mensajes = useMemo(() => {
    const map = new Map<string, IMensajeResponse>();
    historial.forEach((m) => {
      if (m.id_mensaje) map.set(m.id_mensaje, m);
    });
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [historial]);

  // auto-scroll al último mensaje
  useLayoutEffect(() => {
    if (mensajes.length && scrollRef.current) {
      const el = scrollRef.current;
      requestAnimationFrame(() => {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth',
        });
      });
    }
  }, [mensajes.length]);

  return { mensajes, scrollRef };
};
