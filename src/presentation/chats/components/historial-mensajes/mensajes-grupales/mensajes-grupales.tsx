import { useEffect, useRef, useState } from 'react';
import { IChatGrupalResponse } from '../../../../../application/chats/chats.responses';
import { ICrearArchivo } from '../../../../../application/mensajes/mensajes.dtos';
import { IMensajeResponse } from '../../../../../application/mensajes/mensajes.responses';
import { FotoPerfil } from '../../../../../shared/presentation/components/ui/foto-perfil';
import { IUsuarioResponse } from '../../../../../application/usuarios/usuarios.responses';
import { Estado } from '../../../../../shared/domain/enums';
import {
  EllipsisVerticalIcon,
  InformationCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Modal } from '../../../../../shared/presentation/components/ui/modal/modal';
import { InformacionGrupoModal } from './informacion-grupo-modal';
import { ChatsService } from '../../../../../application/chats/chats.service';
import { useAuthStore } from '../../../../../application/auth/hooks/useAuthStore/useAuthStore';

type UIMessage = IMensajeResponse & {
  estado_envio?: 'sending' | 'sent' | 'error';
};

interface MensajesGrupalesProps {
  chat: IChatGrupalResponse;
  usuario: IUsuarioResponse;
  mensajesIniciales: IMensajeResponse[];
}

export const MensajesGrupales = ({
  chat,
  usuario,
  mensajesIniciales,
}: MensajesGrupalesProps) => {
  const [mensajes, setMensajes] = useState<UIMessage[]>(
    (mensajesIniciales || []).map((m) => ({ ...m })),
  );
  const [descripcion, setDescripcion] = useState('');
  const [archivos, setArchivos] = useState<ICrearArchivo[] | undefined>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // accion del store para actualizar historial global
  // const updateChatInStore = useAuthStore((s) => s.updateMensajesChatGrupal);
  const updateChatGrupal = useAuthStore((s) => s.updateChatGrupal);

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

    const tempId = `temp-msg-${Date.now()}`;
    const tempMensaje: UIMessage = {
      id_mensaje: tempId,
      id_usuario: usuario.id_usuario,
      id_chat: chat.id_chat,
      es_grupal: true,
      descripcion: descripcion,
      has_files: !!archivos?.length,
      createdAt: new Date(),
      archivos: [],
      estado: Estado.HABILITADO,
      estado_envio: 'sending',
    };

    setMensajes((prev) => ordenar([...prev, tempMensaje]));
    setDescripcion('');
    setArchivos(undefined);

    try {
      // Por ahora, simular el envío exitoso hasta que se implemente el endpoint
      setTimeout(() => {
        setMensajes((prev) =>
          ordenar(
            prev.map((m) =>
              m.id_mensaje === tempId
                ? ({ ...m, estado_envio: 'sent' } as UIMessage)
                : m,
            ),
          ),
        );
      }, 1000);

      // TODO: Implementar envío real cuando esté disponible el endpoint
      // const resp = await MensajesService.enviarMensajeGrupal({
      //   id_chat: chat.id_chat,
      //   descripcion: tempMensaje.descripcion || undefined,
      //   archivos,
      // });

      // if (resp.success && resp.data) {
      //   const serverMsg = resp.data as IMensajeResponse;
      //   setMensajes((prev) =>
      //     ordenar(
      //       prev.map((m) =>
      //         m.id_mensaje === tempId
      //           ? ({ ...serverMsg, estado_envio: 'sent' } as UIMessage)
      //           : m,
      //       ),
      //     ),
      //   );
      //   updateChatInStore(serverMsg.id_chat, serverMsg);
      // } else {
      //   setMensajes((prev) =>
      //     prev.map((m) =>
      //       m.id_mensaje === tempId ? { ...m, estado_envio: 'error' } : m,
      //     ),
      //   );
      // }
    } catch (err) {
      console.error('Error al enviar mensaje grupal:', err);
      setMensajes((prev) =>
        prev.map((m) =>
          m.id_mensaje === tempId ? { ...m, estado_envio: 'error' } : m,
        ),
      );
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
    console.log('Mostrar información del grupo:', chat.nombre);
    handleCloseMenu();
    setIsConfigModalOpen(true);
  };

  const handleSalirGrupo = () => {
    console.log('Salir del grupo:', chat.nombre);
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
        console.log('Grupo actualizado exitosamente');
      } else {
        console.error('Error al actualizar el grupo:', response.error);
      }
    } catch (error) {
      console.error('Error al actualizar el grupo:', error);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Quitar miembro:', memberId);
    // TODO: Implementar lógica para quitar miembro del grupo
  };

  const handleAddMember = (member: any) => {
    console.log('Añadir miembro:', member);
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
        {mensajes.length === 0 ? (
          <p className="text-center text-gray-400 italic mt-10">
            No hay mensajes aún.
          </p>
        ) : (
          // renderizamos mensajes ya ordenados (más antiguos arriba)
          ordenar(mensajes).map((m) => {
            const esMio = m.id_usuario === usuario.id_usuario;
            const estadoEnvio = (m as UIMessage).estado_envio;
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

                {esMio && (
                  <FotoPerfil
                    link_foto={usuario.link_foto}
                    nombre={usuario.nombre}
                    verPerfil={false}
                    className="size-8 flex-shrink-0 ml-2 mt-1"
                  />
                )}
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

      {/* Modal del menú de opciones */}
      <Modal
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        relativeToParent={true}
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
      </Modal>

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
