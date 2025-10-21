import { useEffect, useRef, useState } from 'react';
import { IMensajeResponse } from '../mensajes.responses';
import { ICrearArchivo } from '../mensajes.dtos';
import { MensajesService } from '../mensajes.service';
import { useAuthStore } from '../../auth/hooks/useAuthStore';
import { IChatPrivadoResponse } from '../../chats/chats.responses';
import { IUsuarioResponse } from '../../usuarios/usuarios.responses';
import { Estado } from '../../../shared/domain/enums';
import { ChatsService } from '../../chats/chats.service';

export type UIMessage = IMensajeResponse & {
  estado_envio?: 'sending' | 'sent' | 'error';
};

export const useMensajesFlow = (
  chat: IChatPrivadoResponse,
  usuario: IUsuarioResponse,
  mensajesIniciales: IMensajeResponse[],
) => {
  const [mensajes, setMensajes] = useState<UIMessage[]>(
    (mensajesIniciales || []).map((m) => ({ ...m })),
  );
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState<ICrearArchivo[] | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const replaceTempChat = useAuthStore((s) => s.replaceTempChat);
  const updateChatInStore = useAuthStore((s) => s.updateMensajesChatPrivado);

  // --- helpers
  const ordenar = (arr: UIMessage[]) =>
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

  // --- efectos
  useEffect(() => {
    setMensajes((mensajesIniciales || []).map((m) => ({ ...m })));
    scrollToBottom(false);
  }, [chat.id_chat, mensajesIniciales]);

  useEffect(() => {
    if (mensajes.length) scrollToBottom();
  }, [mensajes]);

  // --- envío
  const handleSend = async () => {
    if (!descripcion.trim() && !archivos?.length) return;

    const tempId = `temp-msg-${Date.now()}`;
    const tempMensaje: UIMessage = {
      id_mensaje: tempId,
      id_usuario: usuario.id_usuario,
      id_chat: chat.id_chat,
      es_grupal: false,
      descripcion,
      has_files: !!archivos?.length,
      createdAt: new Date(),
      archivos: null,
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
                ? ({ ...serverMsg, estado_envio: 'sent' } as UIMessage)
                : m,
            ),
          ),
        );

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
          updateChatInStore(serverMsg.id_chat, serverMsg);
        }
      } else {
        setMensajes((prev) =>
          prev.map((m) =>
            m.id_mensaje === tempId ? { ...m, estado_envio: 'error' } : m,
          ),
        );
      }
    } catch {
      setMensajes((prev) =>
        prev.map((m) =>
          m.id_mensaje === tempId ? { ...m, estado_envio: 'error' } : m,
        ),
      );
    }
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
