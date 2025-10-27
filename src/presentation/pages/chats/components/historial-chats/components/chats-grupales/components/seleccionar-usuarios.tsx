import { useState, useEffect } from 'react';
import { Button } from '../../../../../../../components/button';
import { Input } from '../../../../../../../components/input';
import { FotoPerfil } from '../../../../../../../components/foto-perfil';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon
} from '@heroicons/react/24/outline';
import { UsuariosService } from '../../../../../../../../infraestructure/rest/usuarios/usuarios.service';
import { ChatsService } from '../../../../../../../../infraestructure/rest/chats/chats.service';
import { IUsuarioResponse } from '../../../../../../../../domain/responses/usuarios.responses';
import { IChatPrivadoResponse } from '../../../../../../../../domain/responses/chats.responses';
import { UsuarioSeleccionado } from '../types';

interface SeleccionarUsuariosProps {
  onSiguiente: (usuarios: UsuarioSeleccionado[]) => void;
  usuariosSeleccionados: UsuarioSeleccionado[];
  setUsuariosSeleccionados: (usuarios: UsuarioSeleccionado[]) => void;
  miembrosExistentes?: string[]; // IDs de usuarios que ya están en el grupo
}

export const SeleccionarUsuarios = ({ onSiguiente, usuariosSeleccionados, setUsuariosSeleccionados, miembrosExistentes = [] }: SeleccionarUsuariosProps) => {
  const [busqueda, setBusqueda] = useState('');
  const [usuariosBusqueda, setUsuariosBusqueda] = useState<IUsuarioResponse[]>([]);
  const [todosLosUsuarios, setTodosLosUsuarios] = useState<IUsuarioResponse[]>([]);
  const [chatsRecientes, setChatsRecientes] = useState<IChatPrivadoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  // Cargar chats recientes y todos los usuarios al montar el componente
  useEffect(() => {
    const fetchChatsRecientes = async () => {
      try {
        const response = await ChatsService.getChatsPrivados();
        if (response.success && response.data) {
          const chatsOrdenados = response.data.sort((a, b) => {
            const fechaA = a.ultimo_mensaje?.createdAt || a.createdAt;
            const fechaB = b.ultimo_mensaje?.createdAt || b.createdAt;
            return new Date(fechaB).getTime() - new Date(fechaA).getTime();
          });
          setChatsRecientes(chatsOrdenados.slice(0, 10));
        }
      } catch (error) {
        console.error('Error cargando chats recientes:', error);
      } finally {
        setLoadingChats(false);
      }
    };

    const fetchTodosLosUsuarios = async () => {
      try {
        // Usar una búsqueda con un término muy común para obtener muchos usuarios
        const response = await UsuariosService.findAllByNombreOUsername('a');
        if (response.success && response.data) {
          setTodosLosUsuarios(response.data);
        }
      } catch (error) {
        console.error('Error cargando todos los usuarios:', error);
      } finally {
        setLoadingUsuarios(false);
      }
    };

    fetchChatsRecientes();
    fetchTodosLosUsuarios();
  }, []);

  // Búsqueda de usuarios con debounce
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(async () => {
      if (busqueda.trim().length >= 2) {
        setLoading(true);
        try {
          const response = await UsuariosService.findAllByNombreOUsername(busqueda.trim());
          if (response.success && response.data) {
            setUsuariosBusqueda(response.data);
          }
        } catch (error) {
          console.error('Error buscando usuarios:', error);
          setUsuariosBusqueda([]);
        } finally {
          setLoading(false);
        }
      } else {
        setUsuariosBusqueda([]);
      }
    }, 300);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [busqueda]);

  const estaEnGrupo = (idUsuario: string) => {
    return miembrosExistentes.includes(idUsuario);
  };

  const toggleUsuario = (usuario: IUsuarioResponse) => {
    // No permitir seleccionar usuarios que ya están en el grupo
    if (estaEnGrupo(usuario.id_usuario)) {
      return;
    }

    const usuarioData: UsuarioSeleccionado = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      username: usuario.username,
      link_foto: usuario.link_foto,
    };

    const yaEstaSeleccionado = usuariosSeleccionados.some(u => u.id_usuario === usuario.id_usuario);
    
    if (yaEstaSeleccionado) {
      setUsuariosSeleccionados(usuariosSeleccionados.filter(u => u.id_usuario !== usuario.id_usuario));
    } else {
      setUsuariosSeleccionados([...usuariosSeleccionados, usuarioData]);
    }
  };

  const estaSeleccionado = (idUsuario: string) => {
    return usuariosSeleccionados.some(u => u.id_usuario === idUsuario);
  };

  const handleSiguiente = () => {
    if (usuariosSeleccionados.length > 0) {
      onSiguiente(usuariosSeleccionados);
    }
  };

  // Combinar usuarios de manera inteligente
  const usuariosParaMostrar = (() => {
    if (busqueda.trim().length >= 2) {
      // Si hay búsqueda activa, mostrar solo resultados de búsqueda
      return usuariosBusqueda;
    } else {
      // Si no hay búsqueda, combinar contactos frecuentes y todos los usuarios
      const contactosFrecuentes = chatsRecientes.map(chat => chat.usuarioB);
      const idsContactosFrecuentes = new Set(contactosFrecuentes.map(u => u.id_usuario));
      
      // Filtrar usuarios que no están en contactos frecuentes
      const otrosUsuarios = todosLosUsuarios.filter(u => !idsContactosFrecuentes.has(u.id_usuario));
      
      // Combinar: primero contactos frecuentes, luego otros usuarios
      return [...contactosFrecuentes, ...otrosUsuarios];
    }
  })();

  return (
    <div className="w-full h-full flex flex-col">
      {/* Barra de búsqueda */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar contactos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Usuarios seleccionados */}
      {usuariosSeleccionados.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {usuariosSeleccionados.map((usuario) => (
              <div
                key={usuario.id_usuario}
                className="flex items-center gap-2 bg-[var(--green-primary)] bg-opacity-10 rounded-full px-3 py-1 border border-[var(--green-primary)] border-opacity-30"
              >
                <FotoPerfil
                  link_foto={usuario.link_foto}
                  nombre={usuario.nombre}
                  className="w-6 h-6"
                />
                <span className="text-sm font-medium text-gray-800">
                  {usuario.nombre}
                </span>
                <button
                  onClick={() => toggleUsuario(usuario as IUsuarioResponse)}
                  className="text-[var(--green-primary)] hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="flex-1 overflow-y-auto">
        {/* Título de sección */}
        <div className="px-4 py-2 bg-gray-50">
          <p className="text-sm font-medium text-gray-600">
            {busqueda.trim().length >= 2 ? 'Resultados de búsqueda' : 'Contactos'}
          </p>
        </div>

        {/* Loading state */}
        {(loading || loadingChats || loadingUsuarios) && (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lista de usuarios */}
        {!loading && !loadingChats && !loadingUsuarios && (
          <div>
            {usuariosParaMostrar.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">
                  {busqueda.trim().length >= 2 
                    ? 'No se encontraron usuarios' 
                    : 'No hay usuarios disponibles'
                  }
                </p>
              </div>
            ) : (
              usuariosParaMostrar.map((usuario) => {
                const seleccionado = estaSeleccionado(usuario.id_usuario);
                const yaEstaEnGrupo = estaEnGrupo(usuario.id_usuario);
                
                return (
                  <div
                    key={usuario.id_usuario}
                    onClick={() => toggleUsuario(usuario)}
                    className={`flex items-center gap-3 p-4 transition-colors ${
                      yaEstaEnGrupo 
                        ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                        : seleccionado 
                          ? 'bg-green-50 hover:bg-green-100 cursor-pointer' 
                          : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <FotoPerfil
                      link_foto={usuario.link_foto}
                      nombre={usuario.nombre}
                      className="w-12 h-12"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {usuario.nombre}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        @{usuario.username}
                      </p>
                    </div>

                    {yaEstaEnGrupo ? (
                      <span className="text-xs text-gray-500 font-medium">
                        Ya está en el grupo
                      </span>
                    ) : seleccionado ? (
                      <div className="w-6 h-6 bg-[var(--green-primary)] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Botón Siguiente */}
      {usuariosSeleccionados.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <Button
            onClick={handleSiguiente}
            className="w-full bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white py-3 rounded-lg font-medium"
          >
            Siguiente ({usuariosSeleccionados.length})
          </Button>
        </div>
      )}
    </div>
  );
};