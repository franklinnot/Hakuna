import { useState } from 'react';
import { useSendMensajePrivado } from '../../../../../../../../../application/use-cases/mensajes/useSendMensajePrivado';
import { ICrearArchivo } from '../../../../../../../../../infraestructure/rest/mensajes/mensajes.dtos';
import { IChatPrivadoResponse } from '../../../../../../../../../domain/responses/chats.responses';
import { IUsuarioResponse } from '../../../../../../../../../domain/responses/usuarios.responses';
import { ErrorResponse } from '../../../../../../../../../application/response';

export const useInputMensajePrivadoFlow = (
  chat: IChatPrivadoResponse,
  usuario: IUsuarioResponse,
) => {
  const { sendMensajePrivado } = useSendMensajePrivado();
  const [archivos, setArchivos] = useState<ICrearArchivo[] | undefined>();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<ErrorResponse>(null);

  const handleSend = async (
    descripcion: string,
    archivos?: ICrearArchivo[],
  ) => {
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
      setIsSending(false);
    }
  };

  return {
    archivos,
    setArchivos,
    isSending,
    error,
    handleSend,
  };
};
