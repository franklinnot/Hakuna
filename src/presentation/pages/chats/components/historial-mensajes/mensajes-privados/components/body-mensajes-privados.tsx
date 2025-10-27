import {
  ClockIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useMensajesPrivadosFlow } from '../hooks/useMensajesPrivadosFlow';
import { MensajesPrivadosProps } from '../mensajes-privados';
import { EstadoEnvioMensaje } from '../../../../../../../domain/enums';

export const BodyMensajesPrivados = ({ chat, usuario }: MensajesPrivadosProps) => {
  const { mensajes, scrollRef } = useMensajesPrivadosFlow(chat, usuario);

  return (
    <main
      ref={scrollRef}
      className="flex-1 flex flex-col p-4 overflow-y-auto bg-gray-50"
    >
      {mensajes.length === 0 ? (
        <p className="text-center text-gray-400 italic mt-10">
          No hay mensajes aún.
        </p>
      ) : (
        mensajes.map((m) => {
          const esMio = m.id_usuario === usuario.id_usuario;
          const isSending = m.estado_envio === EstadoEnvioMensaje.SENDING;
          const isError = m.estado_envio === EstadoEnvioMensaje.ERROR;

          return (
            <div
              key={m.id_mensaje}
              className={clsx(
                'message-appear flex w-full mb-2 transition-transform duration-300',
                esMio ? 'justify-end' : 'justify-start',
              )}
            >
              <div
                className={clsx(
                  'max-w-[75%] px-3 py-2 rounded-2xl shadow-sm whitespace-pre-wrap break-words',
                  esMio ? 'rounded-tr-none' : 'rounded-tl-none',
                  esMio
                    ? isError
                      ? 'bg-red-500 text-white'
                      : isSending
                      ? 'bg-indigo-300 text-indigo-50'
                      : 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-800',
                )}
              >
                {m.descripcion && <p>{m.descripcion}</p>}

                <div className="flex items-center justify-end gap-2 mt-1 text-[10px]">
                  <span
                    className={clsx(
                      esMio ? 'text-indigo-200' : 'text-gray-500',
                    )}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {esMio && (
                    <span aria-hidden>
                      {m.estado_envio === EstadoEnvioMensaje.SENDING && (
                        <ClockIcon className="size-1.5" />
                      )}
                      {m.estado_envio === EstadoEnvioMensaje.SENT && (
                        <CheckIcon className="size-1.5" />
                      )}
                      {m.estado_envio === EstadoEnvioMensaje.ERROR && (
                        <ExclamationTriangleIcon className="size-1.5" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </main>
  );
};
