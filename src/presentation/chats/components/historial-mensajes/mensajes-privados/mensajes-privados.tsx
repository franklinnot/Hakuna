import {
  ClockIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid';
import { useMensajesFlow } from '../../../../../application/mensajes/hooks/useMensajesFlow';
import { FotoPerfil } from '../../../../../shared/presentation/components/ui/foto-perfil';
import { IChatPrivadoResponse } from '../../../../../application/chats/chats.responses';
import { IUsuarioResponse } from '../../../../../application/usuarios/usuarios.responses';
import { IMensajeResponse } from '../../../../../application/mensajes/mensajes.responses';

interface MensajesPrivadosProps {
  chat: IChatPrivadoResponse;
  usuario: IUsuarioResponse;
  mensajesIniciales: IMensajeResponse[];
}

export const MensajesPrivados = ({
  chat,
  usuario,
  mensajesIniciales,
}: MensajesPrivadosProps) => {
  const { mensajes, descripcion, setDescripcion, handleSend, scrollRef } =
    useMensajesFlow(chat, usuario, mensajesIniciales);

  return (
    <section className="flex flex-col w-full h-full rounded-3xl overflow-hidden shadow-xl bg-white">
      {/* HEADER */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-200 flex-shrink-0">
        <FotoPerfil
          link_foto={chat.usuarioB.link_foto}
          nombre={chat.usuarioB.nombre}
          verPerfil={false}
          className="size-10 flex-shrink-0"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-lg">
            {chat.usuarioB.nombre}
          </span>
          <span className="text-sm text-gray-400">
            @{chat.usuarioB.username}
          </span>
        </div>
      </header>

      {/* BODY */}
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
            return (
              <div
                key={m.id_mensaje}
                className={`flex w-full mb-2 ${
                  esMio ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-sm ${
                    esMio
                      ? 'bg-indigo-500 text-white rounded-tr-none'
                      : 'bg-gray-200 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {m.descripcion && (
                    <p className="whitespace-pre-wrap break-words">
                      {m.descripcion}
                    </p>
                  )}
                  <div className="flex items-center justify-end gap-2 mt-1 text-[10px]">
                    <span
                      className={`${
                        esMio ? 'text-indigo-200' : 'text-gray-500'
                      }`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {esMio && (
                      <span aria-hidden>
                        {m.estado_envio === 'sending' && (
                          <ClockIcon className="size-1.5" />
                        )}
                        {m.estado_envio === 'sent' && (
                          <CheckIcon className="size-1.5" />
                        )}
                        {m.estado_envio === 'error' && (
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

      {/* FOOTER */}
      <footer className="flex items-center gap-3 p-4 border-t border-gray-200 bg-white">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow bg-gray-100 rounded-xl px-4 py-2 focus:outline-none text-gray-800"
        />
        <button
          onClick={handleSend}
          className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md bg-indigo-500 hover:bg-indigo-600 transition-colors"
        >
          <span className="text-xl">
            <PaperAirplaneIcon className='size-4 text-indigo-50'/>
          </span>
        </button>
      </footer>
    </section>
  );
};
