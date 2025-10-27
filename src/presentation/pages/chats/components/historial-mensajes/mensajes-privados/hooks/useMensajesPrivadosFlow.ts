import { AppStore } from '../../../../../../../application/store/app.store';
import { useRef, useState, useLayoutEffect, useMemo } from 'react';
import { IMensajeResponse } from '../../../../../../../domain/responses/mensajes.responses';
import { ICrearArchivo } from '../../../../../../../infraestructure/rest/mensajes/mensajes.dtos';
import { IChatPrivadoResponse } from '../../../../../../../domain/responses/chats.responses';
import { IUsuarioResponse } from '../../../../../../../domain/responses/usuarios.responses';
import { useSendMensajePrivado } from '../../../../../../../application/use-cases/mensajes/useSendMensajePrivado';
import { ErrorResponse } from '../../../../../../../application/response';

export const useMensajesPrivadosFlow = (
  chat: IChatPrivadoResponse,
  usuario: IUsuarioResponse,
) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [archivos, setArchivos] = useState<ICrearArchivo[] | undefined>();
  const { sendMensajePrivado } = useSendMensajePrivado();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<ErrorResponse>(null);

  // obtener mensajes directamente del store (reactivo)
  const historial = AppStore(
    (s) =>
      s.chatsPrivados?.find((c) => c.id_chat === chat.id_chat)
        ?.historial_mensajes ?? [],
  );

  // filtrar duplicados y ordenar
  const mensajes = useMemo(() => {
    const map = new Map<string, IMensajeResponse>();
    historial.forEach((m) => {
      if (m.id_mensaje) map.set(m.id_mensaje, m); // usa id único
    });
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [historial]);

  // desplazamiento fluido al fondo tras render de nuevo mensaje
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

  const handleSend = async (descripcion: string) => {
    const trimmed = descripcion.trim();
    if (!trimmed && !archivos?.length) return;

    setIsSending(true);
    setError(null);

    try {
      await sendMensajePrivado(chat, usuario, trimmed, archivos);
    } catch (err) {
      console.error('Error en handleSend', err);
      setError({ message: 'Error al enviar el mensaje' });
    } finally {
      setTimeout(() => {
        setArchivos(undefined);
        setIsSending(false);
      }, 100);
    }
  };

  return {
    mensajes,
    archivos,
    setArchivos,
    handleSend,
    scrollRef,
    isSending,
    error,
  };
};
