import { useEffect, useRef } from 'react';
import { IChatGrupalResponse } from '../../../../../../../domain/responses/chats.responses';
import { IUsuarioResponse } from '../../../../../../../domain/responses/usuarios.responses';
import { IMensajeResponse } from '../../../../../../../domain/responses/mensajes.responses';
import { EstadoEnvioMensaje, TipoArchivo } from '../../../../../../../domain/enums';
import { FotoPerfil } from '../../../../../../components/foto-perfil';
import { AppStore } from '../../../../../../../application/store/app.store';

interface BodyMensajesGrupalesProps {
  chat: IChatGrupalResponse;
  usuario: IUsuarioResponse;
}

export const BodyMensajesGrupales = ({
  chat,
  usuario,
}: BodyMensajesGrupalesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Obtener mensajes del store global
  const mensajesDelStore = AppStore((s) => {
    const chatActual = s.chatsGrupales.find(c => c.id_chat === chat.id_chat);
    return chatActual?.historial_mensajes || [];
  });

  // cuando cambie el chat, scroll al fondo
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight ?? 0,
        behavior: 'smooth',
      });
    }, 50);
  }, [chat.id_chat]);

  // cuando mensajes cambian, scroll al final (solo si hay mensajes)
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight ?? 0,
        behavior: 'smooth',
      });
    }, 80);
  }, [mensajesDelStore]);

  // helper: ordenar por createdAt ascendente (oldest first)
  const ordenar = (arr: IMensajeResponse[]) =>
    arr
      .slice()
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

  // Función para obtener el nombre del usuario que envió el mensaje
  const getNombreUsuario = (id_usuario: string) => {
    if (id_usuario === usuario.id_usuario) return 'Tú';
    const integrante = chat.integrantes.find(
      (i) => i.id_usuario === id_usuario,
    );
    return integrante?.nombre || 'Usuario desconocido';
  };

  // Función para obtener la foto del usuario que envió el mensaje
  const getFotoUsuario = (id_usuario: string) => {
    if (id_usuario === usuario.id_usuario) return usuario.link_foto;
    const integrante = chat.integrantes.find(
      (i) => i.id_usuario === id_usuario,
    );
    return integrante?.link_foto || null;
  };

  return (
    <main
      ref={scrollRef}
      className="flex-1 flex flex-col p-4 overflow-y-auto bg-gray-50"
    >
      {mensajesDelStore.length === 0 ? (
        <p className="text-center text-gray-400 italic mt-10">
          No hay mensajes aún.
        </p>
      ) : (
        // renderizamos mensajes ya ordenados (más antiguos arriba)
        ordenar(mensajesDelStore).map((m) => {
          const esMio = m.id_usuario === usuario.id_usuario;
          const estadoEnvio = m.estado_envio;
          const nombreUsuario = getNombreUsuario(m.id_usuario);
          const fotoUsuario = getFotoUsuario(m.id_usuario);

          return (
            <div
              key={m.id_mensaje}
              className={`flex w-full mb-3 ${
                esMio ? 'justify-end' : 'justify-start'
              }`}
            >
              {!esMio && (
                <FotoPerfil
                  link_foto={fotoUsuario}
                  nombre={nombreUsuario}
                  verPerfil={false}
                  className="size-8 flex-shrink-0 mr-2 mt-1"
                />
              )}

              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-sm ${
                  esMio
                    ? 'bg-indigo-500 text-white rounded-tr-none'
                    : 'bg-gray-200 text-gray-800 rounded-tl-none'
                }`}
              >
                {!esMio && (
                  <p
                    className={`text-xs font-semibold mb-1 ${
                      esMio ? 'text-indigo-200' : 'text-gray-600'
                    }`}
                  >
                    {nombreUsuario}
                  </p>
                )}

                {m.descripcion && (
                  <p className="whitespace-pre-wrap break-words">
                    {m.descripcion}
                  </p>
                )}

                {m.archivos?.length ? (
                  <div className="mt-2 flex flex-col gap-2">
                    {m.archivos.map((a) => {
                      const isImage = a.tipo_archivo === TipoArchivo.IMAGEN;
                      const isAudio = a.tipo_archivo === TipoArchivo.AUDIO;
                      const canOpen = !!a.link;
                      const nombre = a.nombre || `${a.tipo_archivo}.${a.extension}`;

                      if (isImage && canOpen) {
                        return (
                          <a
                            key={a.id_archivo}
                            href={a.link!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block overflow-hidden rounded-md border border-gray-300 bg-white"
                          >
                            <img
                              src={a.link!}
                              alt={nombre}
                              className="max-h-40 w-auto object-cover"
                            />
                          </a>
                        );
                      }

                      if (isAudio && canOpen) {
                        return (
                          <audio
                            key={a.id_archivo}
                            controls
                            src={a.link!}
                            className="w-56 rounded-lg"
                          />
                        );
                      }

                      return (
                        <a
                          key={a.id_archivo}
                          href={canOpen ? a.link! : '#'}
                          target={canOpen ? '_blank' : undefined}
                          rel={canOpen ? 'noopener noreferrer' : undefined}
                          download
                          onClick={(e) => {
                            if (!canOpen) e.preventDefault();
                          }}
                          className={`text-xs flex items-center gap-2 px-3 py-2 rounded-md border ${
                            esMio
                              ? 'border-indigo-400 bg-indigo-600/10 text-indigo-100'
                              : 'border-gray-300 bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span>📎</span>
                          <span className="truncate max-w-[200px]">{nombre}</span>
                          {!canOpen && (
                            <span className="opacity-70">(no disponible)</span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                ) : null}

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
                      {estadoEnvio === EstadoEnvioMensaje.SENDING && '⏳'}
                      {estadoEnvio === EstadoEnvioMensaje.SENT && '✅'}
                      {estadoEnvio === EstadoEnvioMensaje.ERROR && '⚠️'}
                    </span>
                  )}
                </div>
              </div>

              {/* No mostrar avatar propio en chats grupales */}
            </div>
          );
        })
      )}
    </main>
  );
};