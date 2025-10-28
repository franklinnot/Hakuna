import { useState, useMemo } from 'react';
import { useBuscarUsuarios } from '../../../../../../../../../../application/use-cases/usuarios/useBuscarUsuarios';

export const useBuscarUsuariosFlow = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { busqueda, setBusqueda, usuarios, limpiarBusqueda } =
    useBuscarUsuarios(setIsLoading);

  const tieneBusquedaActiva = useMemo(
    () => busqueda.trim().length > 0,
    [busqueda],
  );

  return {
    busqueda,
    setBusqueda,
    usuariosBusqueda: usuarios,
    limpiarBusqueda,
    isLoading,
    tieneBusquedaActiva,
  };
};
