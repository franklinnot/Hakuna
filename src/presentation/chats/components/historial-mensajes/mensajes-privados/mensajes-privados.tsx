import { useEffect, useRef, useState } from 'react';
import { IChatPrivadoResponse } from '../../../../../application/chats/chats.responses';
import { ICrearArchivo } from '../../../../../application/mensajes/mensajes.dtos';
import { IMensajeResponse } from '../../../../../application/mensajes/mensajes.responses';
import { FotoPerfil } from '../../../../../shared/presentation/components/ui/foto-perfil';
import { IUsuarioResponse } from '../../../../../application/usuarios/usuarios.responses';
import { MensajesService } from '../../../../../application/mensajes/mensajes.service';
import { useAuthStore } from '../../../../../application/auth/hooks/useAuthStore';
import { Estado } from '../../../../../shared/domain/enums';

/** UIMessage extiende IMensajeResponse con campo opcional de estado de envío */
type UIMessage = IMensajeResponse & {
  estado_envio?: 'sending' | 'sent' | 'error';
};

interface MensajesPrivadosProps {
  chat: IChatPrivadoResponse;
  usuario: IUsuarioResponse;
  mensajesIniciales: IMensajeResponse[]; // vienen del store
}

export const MensajesPrivados = ({
  chat,
  usuario,
  mensajesIniciales,
}: MensajesPrivadosProps) => {
  const [mensajes, setMensajes] = useState<UIMessage[]>(
    // inicializamos convertiendo createdAt a Date (si viene string)
    (mensajesIniciales || []).map((m) => ({ ...m })),
  );
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState<ICrearArchivo[] | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  // accion del store para actualizar historial global
  const updateChatInStore = useAuthStore(
    (s) => s.updateMensajesChatPrivado,
  );

  // cuando cambie el chat o los mensajesIniciales, reemplace el estado local
  useEffect(() => {
    setMensajes((mensajesIniciales || []).map((m) => ({ ...m })));
    // scroll al fondo tras re-render
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight ?? 0,
        behavior: 'smooth',
      });
    }, 50);
  }, [chat.id_chat, mensajesIniciales]);

  // cuando mensajes cambian, scroll al final (solo si hay mensajes)
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight ?? 0,
        behavior: 'smooth',
      });
    }, 80);
  }, [mensajes]);

  // helper: ordenar por createdAt ascendente (oldest first)
  const ordenar = (arr: UIMessage[]) =>
    arr
      .slice()
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

  // Envío optimista con estado de envío
  const handleSend = async () => {
    if (!descripcion.trim() && !archivos?.length) return;

    // construimos un mensaje temporal que cumple IMensajeResponse
    const tempId = `temp-${Date.now()}`;
    const tempMensaje: UIMessage = {
      id_mensaje: tempId,
      id_usuario: usuario.id_usuario,
      id_chat: chat.id_chat,
      es_grupal: false,
      descripcion: descripcion,
      has_files: !!archivos?.length,
      createdAt: new Date(), // Date is acceptable per interface
      archivos: null,
      estado: Estado.HABILITADO, // valor razonable temporal
      estado_envio: 'sending',
    };

    // Añadir optimista
    setMensajes((prev) => ordenar([...prev, tempMensaje]));

    // limpiar input rápido para buena UX
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

        // Reemplazar el temp por el mensaje real del servidor
        setMensajes((prev) =>
          ordenar(
            prev.map((m) =>
              m.id_mensaje === tempId
                ? ({ ...serverMsg, estado_envio: 'sent' } as UIMessage)
                : m,
            ),
          ),
        );

        // Actualizar el store global con el mensaje real (sin campo UI)
        updateChatInStore(chat.id_chat, serverMsg);
      } else {
        // marcar error en el temp
        setMensajes((prev) =>
          prev.map((m) =>
            m.id_mensaje === tempId ? { ...m, estado_envio: 'error' } : m,
          ),
        );
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setMensajes((prev) =>
        prev.map((m) =>
          m.id_mensaje === tempId ? { ...m, estado_envio: 'error' } : m,
        ),
      );
    }
  };

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
          // renderizamos mensajes ya ordenados (más antiguos arriba)
          ordenar(mensajes).map((m) => {
            const esMio = m.id_usuario === usuario.id_usuario;
            const estadoEnvio = (m as UIMessage).estado_envio;
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

                  {m.has_files && (
                    <div
                      className={`mt-1 pt-1 text-xs flex items-center gap-1 ${
                        esMio
                          ? 'border-t border-indigo-400 text-indigo-100'
                          : 'border-t border-gray-300 text-gray-600'
                      }`}
                    >
                      <span>📎</span>
                      <span>Archivo adjunto</span>
                    </div>
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
                        {estadoEnvio === 'sending' && '⏳'}
                        {estadoEnvio === 'sent' && '✅'}
                        {estadoEnvio === 'error' && '⚠️'}
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
        <div className="flex items-center flex-grow bg-gray-100 rounded-xl py-2 px-4">
          <button
            className="text-xl text-gray-500 mr-2"
            title="Adjuntar archivo"
            onClick={() => console.log('Adjuntar archivo')}
          >
            📎
          </button>

          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
          />

          <button
            className="text-xl text-gray-500 ml-2"
            title="Enviar emoji"
            onClick={() => console.log('Abrir emojis')}
          >
            🙂
          </button>
        </div>

        <button
          onClick={handleSend}
          className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md bg-indigo-500 hover:bg-indigo-600 transition-colors"
        >
          <span className="text-xl text-white">➡️</span>
        </button>
      </footer>
    </section>
  );
};
