import { useState } from 'react';
import type { IUsuarioResponse } from '../usuarios.responses';

interface UseSeleccionUsuariosProps {
  miembrosExistentes?: string[];
  usuariosSeleccionados?: IUsuarioResponse[];
  setUsuariosSeleccionados?: (usuarios: IUsuarioResponse[]) => void;
}

export const useSeleccionUsuarios = ({ 
  miembrosExistentes = [], 
  usuariosSeleccionados: usuariosExternos,
  setUsuariosSeleccionados: setUsuariosExternos
}: UseSeleccionUsuariosProps = {}) => {
  const [usuariosInternosSeleccionados, setUsuariosInternosSeleccionados] = useState<IUsuarioResponse[]>([]);
  
  // Usar estado externo si se proporciona, sino usar estado interno
  const usuariosSeleccionados = usuariosExternos ?? usuariosInternosSeleccionados;
  
  // Función helper para actualizar el estado
  const actualizarUsuarios = (nuevosUsuarios: IUsuarioResponse[] | ((prev: IUsuarioResponse[]) => IUsuarioResponse[])): void => {
    if (setUsuariosExternos) {
      // Para estado externo, calcular el valor si es una función
      const valor = typeof nuevosUsuarios === 'function' ? nuevosUsuarios(usuariosSeleccionados) : nuevosUsuarios;
      setUsuariosExternos(valor);
    } else {
      // Para estado interno, usar directamente
      setUsuariosInternosSeleccionados(nuevosUsuarios);
    }
  };

  const estaEnGrupo = (idUsuario: string): boolean => {
    return miembrosExistentes.includes(idUsuario);
  };

  const estaSeleccionado = (idUsuario: string): boolean => {
    return usuariosSeleccionados.some(u => u.id_usuario === idUsuario);
  };

  const toggleUsuario = (usuario: IUsuarioResponse): void => {
    // No permitir seleccionar usuarios que ya están en el grupo
    if (estaEnGrupo(usuario.id_usuario)) {
      return;
    }

    const yaEstaSeleccionado = estaSeleccionado(usuario.id_usuario);
    
    if (yaEstaSeleccionado) {
      actualizarUsuarios(prev => prev.filter(u => u.id_usuario !== usuario.id_usuario));
    } else {
      actualizarUsuarios(prev => [...prev, usuario]);
    }
  };

  const removerUsuario = (idUsuario: string): void => {
    actualizarUsuarios(prev => prev.filter(u => u.id_usuario !== idUsuario));
  };

  const limpiarSeleccion = (): void => {
    actualizarUsuarios([]);
  };

  return {
    usuariosSeleccionados,
    setUsuariosSeleccionados: actualizarUsuarios,
    estaEnGrupo,
    estaSeleccionado,
    toggleUsuario,
    removerUsuario,
    limpiarSeleccion,
    tieneSeleccionados: usuariosSeleccionados.length > 0
  };
};