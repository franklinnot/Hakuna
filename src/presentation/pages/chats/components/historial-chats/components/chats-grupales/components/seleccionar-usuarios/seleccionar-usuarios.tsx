import { Input } from '../../../../../../../../components/input';
import { Button } from '../../../../../../../../components/button';
import { FotoPerfil } from '../../../../../../../../components/foto-perfil';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSeleccionUsuarios } from '../../hooks/useSeleccionUsuariosFlow';
import type { IUsuarioResponse } from '../../../../../../../../../domain/responses/usuarios.responses';
import { useState } from 'react';
import { useBuscarUsuariosFlow } from './hooks/useBuscarUsuariosFlow';
import { useContactosFrecuentesFlow } from './hooks/useContactosFrecuentesFlow';

interface SeleccionarUsuariosProps {
  onSiguiente: (usuarios: IUsuarioResponse[]) => void;
  usuariosSeleccionados: IUsuarioResponse[];
  setUsuariosSeleccionados: (usuarios: IUsuarioResponse[]) => void;
  miembrosExistentes?: string[]; // IDs de usuarios que ya están en el grupo
  variant?: 'light' | 'dark';
}

export const SeleccionarUsuarios = ({
  onSiguiente,
  usuariosSeleccionados,
  setUsuariosSeleccionados,
  miembrosExistentes = [],
  variant = 'light',
}: SeleccionarUsuariosProps) => {
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);

  // Flow hooks
  const {
    busqueda,
    setBusqueda,
    usuariosBusqueda,
    isLoading: loadingBusqueda,
    tieneBusquedaActiva,
  } = useBuscarUsuariosFlow();

  const { usuariosFrecuentes } = useContactosFrecuentesFlow(setIsLoadingGlobal);

  const { estaEnGrupo, estaSeleccionado, toggleUsuario } = useSeleccionUsuarios(
    {
      miembrosExistentes,
      usuariosSeleccionados,
      setUsuariosSeleccionados,
    },
  );

  const handleSiguiente = () => {
    if (usuariosSeleccionados.length > 0) {
      onSiguiente(usuariosSeleccionados);
    }
  };

  const usuariosParaMostrar = tieneBusquedaActiva
    ? usuariosBusqueda
    : usuariosFrecuentes;

  const loading = loadingBusqueda || isLoadingGlobal;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Barra de búsqueda */}
      <div className={`p-4 border-b ${variant === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="relative">
          <MagnifyingGlassIcon
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${variant === 'dark' ? 'text-gray-300' : 'text-gray-400'}`}
          />
          <Input
            type="text"
            placeholder="Buscar contactos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={`pl-10 ${variant === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-50 border-gray-200'}`}
          />
        </div>
      </div>

      {/* Usuarios seleccionados */}
      {usuariosSeleccionados.length > 0 && (
        <div className={`p-4 border-b ${variant === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex flex-wrap gap-2">
            {usuariosSeleccionados.map((usuario) => (
              <div
                key={usuario.id_usuario}
                className="flex items-center gap-2 bg-[var(--green-primary)] 
                g-opacity-10 rounded-full px-3 py-1 border border-[var(--green-primary)] 
                border-opacity-30"
              >
                <FotoPerfil
                  link_foto={usuario.link_foto}
                  nombre={usuario.nombre}
                  className="w-6 h-6"
                />
                <span className={`text-sm font-medium ${variant === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                  {usuario.nombre}
                </span>
                <button
                  onClick={() => toggleUsuario(usuario as IUsuarioResponse)}
                  className="text-[var(--green-primary)] hover:text-red-500 
                  transition-colors"
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
        <div className={`${variant === 'dark' ? 'px-4 py-2 bg-gray-800' : 'px-4 py-2 bg-gray-50'}`}>
          <p className={`text-sm font-medium ${variant === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {tieneBusquedaActiva ? 'Resultados de búsqueda' : 'Contactos'}
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-4 animate-pulse ${variant === 'dark' ? 'bg-transparent' : ''}`}
              >
                <div className={`w-12 h-12 rounded-full ${variant === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <div className={`h-4 rounded w-3/4 mb-1 ${variant === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className={`h-3 rounded w-1/2 ${variant === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lista de usuarios */}
        {!loading && (
          <div>
            {usuariosParaMostrar.length === 0 ? (
              <div className={`text-center py-8 ${variant === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                <p className="text-sm">
                  {tieneBusquedaActiva
                    ? 'No se encontraron usuarios'
                    : 'No hay usuarios disponibles'}
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
                        ? variant === 'dark'
                          ? 'bg-gray-700 cursor-not-allowed opacity-60'
                          : 'bg-gray-50 cursor-not-allowed opacity-60'
                        : seleccionado
                        ? variant === 'dark'
                          ? 'bg-[var(--green-primary)]/10 hover:bg-[var(--green-primary)]/20 cursor-pointer'
                          : 'bg-green-50 hover:bg-green-100 cursor-pointer'
                        : variant === 'dark'
                          ? 'hover:bg-gray-700 cursor-pointer'
                          : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <FotoPerfil
                      link_foto={usuario.link_foto}
                      nombre={usuario.nombre}
                      className="w-12 h-12"
                    />

                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${variant === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                        {usuario.nombre}
                      </p>
                      <p className={`text-sm truncate ${variant === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        @{usuario.username}
                      </p>
                    </div>

                    {yaEstaEnGrupo ? (
                      <span className={`text-xs font-medium ${variant === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Ya está en el grupo
                      </span>
                    ) : seleccionado ? (
                      <div
                        className="w-6 h-6 bg-[var(--green-primary)] rounded-full 
                        flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 
                            0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 
                            011.414 0z"
                            clipRule="evenodd"
                          />
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
        <div className={`p-4 border-t ${variant === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
          <Button
            onClick={handleSiguiente}
            className="w-full bg-[var(--green-primary)] hover:bg-[var(--green-dark)] 
            text-white py-3 rounded-lg font-medium"
          >
            Siguiente ({usuariosSeleccionados.length})
          </Button>
        </div>
      )}
    </div>
  );
};
