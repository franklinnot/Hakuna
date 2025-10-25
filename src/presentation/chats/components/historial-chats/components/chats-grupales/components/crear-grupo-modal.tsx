import { useState } from 'react';
import { SeleccionarUsuarios } from './seleccionar-usuarios';
import { ConfigurarGrupoModal } from './configurar-grupo-modal';
import type { IUsuarioResponse } from '../../../../../../../application/usuarios/usuarios.responses';

interface CrearGrupoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCrearGrupo?: (datosGrupo: {
    nombre: string;
    descripcion: string;
    foto?: string;
    integrantes: string[];
  }) => void;
}

type Paso = 'seleccionar-usuarios' | 'configurar-grupo';

export const CrearGrupoModal = ({ isOpen, onClose, onCrearGrupo }: CrearGrupoModalProps) => {
  const [pasoActual, setPasoActual] = useState<Paso>('seleccionar-usuarios');
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<IUsuarioResponse[]>([]);
  
  // Estados para la configuración del grupo (persisten durante toda la sesión)
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [descripcionGrupo, setDescripcionGrupo] = useState('');
  const [fotoGrupo, setFotoGrupo] = useState<string | null | undefined>(undefined);

  const handleSiguientePaso = (usuarios: IUsuarioResponse[]) => {
    setUsuariosSeleccionados(usuarios);
    setPasoActual('configurar-grupo');
  };

  const handleVolverPaso = () => {
    setPasoActual('seleccionar-usuarios');
  };

  const handleCrearGrupo = (datosGrupo: {
    nombre: string;
    descripcion: string;
    foto?: string;
    integrantes: string[];
  }) => {
    onCrearGrupo?.(datosGrupo);
  };

  const handleCloseModal = () => {
    // Resetear todos los estados cuando se cierre el modal
    setPasoActual('seleccionar-usuarios');
    setUsuariosSeleccionados([]);
    setNombreGrupo('');
    setDescripcionGrupo('');
    setFotoGrupo(undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {pasoActual === 'seleccionar-usuarios' && (
        <div className="h-[500px] flex flex-col">
          <SeleccionarUsuarios
            onSiguiente={handleSiguientePaso}
            usuariosSeleccionados={usuariosSeleccionados}
            setUsuariosSeleccionados={setUsuariosSeleccionados}
          />
        </div>
      )}
      
      {pasoActual === 'configurar-grupo' && (
        <ConfigurarGrupoModal
          isOpen={true}
          usuarios={usuariosSeleccionados}
          onClose={handleCloseModal}
          onVolver={handleVolverPaso}
          onCrearGrupo={handleCrearGrupo}
          nombreGrupo={nombreGrupo}
          setNombreGrupo={setNombreGrupo}
          descripcionGrupo={descripcionGrupo}
          setDescripcionGrupo={setDescripcionGrupo}
          fotoGrupo={fotoGrupo}
          setFotoGrupo={setFotoGrupo}
        />
      )}
    </>
  );
};