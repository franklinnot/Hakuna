import { useEffect, useRef, useState } from 'react';
import { IChatGrupalResponse } from '../../../../../../domain/responses/chats.responses';
import { ICrearArchivo } from '../../../../../../infraestructure/rest/mensajes/mensajes.dtos';
import { IMensajeResponse } from '../../../../../../domain/responses/mensajes.responses';
import { FotoPerfil } from '../../../../../components/foto-perfil';
import { IUsuarioResponse } from '../../../../../../domain/responses/usuarios.responses';
import { EstadoEnvioMensaje, TipoArchivo } from '../../../../../../domain/enums';
import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ModalRelativo } from '../../../../../components/modal/modal-relativo';
import { InformacionGrupoModal } from './informacion-grupo-modal';
import { ChatsService } from '../../../../../../infraestructure/rest/chats/chats.service';
import { AppStore } from '../../../../../../application/store/app.store';
import { useSendMensajeGrupal } from '../../../../../../application/use-cases/mensajes/useSendMensajeGrupal';

interface GroupMember {
  id: string;
  name: string;
  avatar: string | null;
  isAdmin: boolean;
}

interface MensajesGrupalesProps {
  chat: IChatGrupalResponse;
  usuario: IUsuarioResponse;
}

export const MensajesGrupales = ({
  chat,
  usuario,
}: MensajesGrupalesProps) => {
  // Usar el hook para enviar mensajes
  const { sendMensajeGrupal, isLoading } = useSendMensajeGrupal();
  
  // Obtener función para actualizar chat del store
  const updateChatGrupal = AppStore((s) => s.updateChatGrupal);
  
  // Obtener mensajes del store global
  const mensajesDelStore = AppStore((s) => {
    const chatActual = s.chatsGrupales.find(c => c.id_chat === chat.id_chat);
    return chatActual?.historial_mensajes || [];
  });

  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState<ICrearArchivo[] | undefined>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSend = async () => {
    if (!descripcion.trim() && !archivos?.length) return;

    await sendMensajeGrupal({
      id_chat: chat.id_chat,
      descripcion: descripcion,
      archivos: archivos,
    });

    // Limpiar campos
    setDescripcion('');
    setArchivos(undefined);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // remover el encabezado data:*;base64,
        const commaIndex = result.indexOf(',');
        resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapTipo = (f: File): TipoArchivo => {
      if (f.type.startsWith('image/')) return TipoArchivo.IMAGEN;
      if (f.type.startsWith('audio/')) return TipoArchivo.AUDIO;
      if (f.type.startsWith('video/')) return TipoArchivo.VIDEO;
      return TipoArchivo.DOCUMENTO;
    };

    try {
      const list: ICrearArchivo[] = await Promise.all(
        files.map(async (f) => ({
          nombre: f.name,
          tipoArchivo: mapTipo(f),
          b64: await fileToBase64(f),
        })),
      );

      setArchivos(list);
    } catch (err) {
      console.error('Error leyendo archivos:', err);
    } finally {
      // limpiar el input para poder volver a seleccionar el mismo archivo si se desea
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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

  // Funciones del menú
  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleInfoGrupo = () => {
    handleCloseMenu();
    setIsConfigModalOpen(true);
  };

  const handleSalirGrupo = () => {
    handleCloseMenu();
    // TODO: Implementar confirmación y lógica para salir del grupo
  };

  const handleCloseConfigModal = () => {
    setIsConfigModalOpen(false);
  };

  const handleUpdateGroup = async (
    name: string,
    description: string,
    photo?: string | null,
  ) => {
    try {
      const datosActualizacion: {
        nombre?: string;
        descripcion?: string;
        foto?: string | null;
      } = {};

      // Solo incluir los campos que han cambiado
      if (name !== chat.nombre) {
        datosActualizacion.nombre = name;
      }
      if (description !== chat.descripcion) {
        datosActualizacion.descripcion = description;
      }
      if (photo !== chat.link_foto) {
        datosActualizacion.foto = photo;
      }

      // Si no hay cambios, no hacer nada
      if (Object.keys(datosActualizacion).length === 0) {
        return;
      }

      const response = await ChatsService.updateChatGrupal(
        chat.id_chat,
        datosActualizacion,
      );

      if (response.success && response.data) {
        // Actualizar el store con los nuevos datos
        updateChatGrupal(response.data);
      } else {
        console.error('Error al actualizar el grupo:', response.error);
      }
    } catch (error) {
      console.error('Error al actualizar el grupo:', error);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    // TODO: Implementar lógica para quitar miembro del grupo
  };

  const handleAddMember = (member: GroupMember) => {
    // TODO: Implementar lógica para añadir miembro al grupo
  };

  return (
    <section className="flex flex-col w-full h-full rounded-3xl overflow-hidden shadow-xl bg-white">
      {/* HEADER */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-200 flex-shrink-0">
        <FotoPerfil
          link_foto={chat.link_foto}
          nombre={chat.nombre}
          verPerfil={false}
          className="size-10 flex-shrink-0"
        />
        <div className="flex flex-col flex-1">
          <span className="font-semibold text-gray-800 text-lg">
            {chat.nombre}
          </span>
          <span className="text-sm text-gray-400">
            {chat.cantidad_integrantes} integrantes
          </span>
        </div>

        {/* Botón de menú de tres puntos */}
        <button
          ref={menuButtonRef}
          onClick={handleToggleMenu}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
          title="Opciones del grupo"
        >
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
        </button>
      </header>

      {/* BODY */}
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

      {/* FOOTER */}
      <footer className="flex items-center gap-3 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center flex-grow bg-gray-100 rounded-xl py-2 px-4">
          <button
            className="text-xl text-gray-500 mr-2"
            title="Adjuntar archivo"
            onClick={handleAttachClick}
          >
            📎
          </button>

          {/* input oculto para selección de archivos */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
            onChange={handleFilesSelected}
            className="hidden"
          />

          {archivos?.length ? (
            <span className="mr-2 text-xs text-gray-600 bg-gray-200 rounded-md px-2 py-1 flex items-center gap-1">
              {archivos.length} archivo{archivos.length > 1 ? 's' : ''} listo(s)
              <button
                className="ml-1 text-gray-500 hover:text-gray-700"
                title="Quitar adjuntos"
                onClick={() => setArchivos(undefined)}
              >
                ✖
              </button>
            </span>
          ) : null}

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
            onClick={() => {/* TODO: Implementar selector de emojis */}}
          >
            🙂
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={isLoading}
          className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          <span className="text-xl text-white">
            {isLoading ? '⏳' : '➡️'}
          </span>
        </button>
      </footer>

      {/* Modal del menú de opciones */}
      <ModalRelativo
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        parentRef={menuButtonRef as React.RefObject<HTMLElement>}
        position="right"
      >
        <div className="py-2 min-w-[200px]">
          <button
            onClick={handleInfoGrupo}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <InformationCircleIcon className="h-5 w-5 text-gray-600" />
            <span className="text-gray-800 font-medium">Info del grupo</span>
          </button>

          <button
            onClick={handleSalirGrupo}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-500 font-medium">Salir del grupo</span>
          </button>
        </div>
      </ModalRelativo>

      {/* Modal de configuración del grupo */}
      <InformacionGrupoModal
        isOpen={isConfigModalOpen}
        onClose={handleCloseConfigModal}
        groupName={chat.nombre}
        groupDescription={chat.descripcion || ''}
        groupPhoto={chat.link_foto}
        members={chat.integrantes.map((integrante) => ({
          id: integrante.id_usuario,
          name: integrante.nombre,
          avatar: integrante.link_foto,
          isAdmin: integrante.is_admin,
        }))}
        onUpdateGroup={handleUpdateGroup}
        onRemoveMember={handleRemoveMember}
        onAddMember={handleAddMember}
      />
    </section>
  );
};
