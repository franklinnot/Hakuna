import { useEffect, useRef, useState } from 'react';
import { IMensajeResponse } from '../../../../../../application/mensajes/mensajes.responses';
import { ICrearArchivo } from '../../../../../../application/mensajes/mensajes.dtos';
import { IChatPrivadoResponse } from '../../../../../../application/chats/chats.responses';
import { IUsuarioResponse } from '../../../../../../application/usuarios/usuarios.responses';
import { useMensajesService, IMensajeResponseWithState } from '../../../../../../application/mensajes/hooks/useMensajesService';

export const useMensajesPrivadosFlow = (
  chat: IChatPrivadoResponse,
  usuario: IUsuarioResponse,
  mensajesIniciales: IMensajeResponse[],
) => {
  const [mensajes, setMensajes] = useState<IMensajeResponseWithState[]>(() =>
    (mensajesIniciales || []).map((m) => ({ ...m })),
  );
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState<ICrearArchivo[] | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { enviarMensajePrivado } = useMensajesService();

  const ordenar = (arr: IMensajeResponseWithState[]) =>
    arr
      .slice()
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

  const scrollToBottom = (smooth = true) => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight ?? 0,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }, 60);
  };

  useEffect(() => {
    setMensajes((mensajesIniciales || []).map((m) => ({ ...m })));
    scrollToBottom(false);
  }, [chat.id_chat, mensajesIniciales]);

  useEffect(() => {
    if (mensajes.length) scrollToBottom();
  }, [mensajes]);

  const handleSend = async () => {
    await enviarMensajePrivado(
      chat,
      usuario,
      descripcion,
      archivos,
      setMensajes,
      setDescripcion,
      setArchivos,
      ordenar,
    );
  };

  return {
    mensajes: ordenar(mensajes),
    descripcion,
    setDescripcion,
    archivos,
    setArchivos,
    handleSend,
    scrollRef,
  };
};
