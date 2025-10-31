import { useState, useEffect } from 'react';
import { UsuariosService } from '../../../infraestructure/rest/usuarios/usuarios.service';
import type { IUsuarioResponse } from '../../../domain/responses/usuarios.responses';

export const useBuscarUsuarios = (
  setIsLoading: (v: boolean) => void,
  delay = 300,
) => {
  const [busqueda, setBusqueda] = useState('');
  const [usuarios, setUsuarios] = useState<IUsuarioResponse[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = window.setTimeout(async () => {
      const query = busqueda.trim();

      if (query.length < 2) {
        setUsuarios([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await UsuariosService.findAllByNombreOUsername(query);
        const data = res?.data || [];
        // orden alfabético
        data.sort((a, b) =>
          a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }),
        );
        setUsuarios(data);
      } catch (error) {
        console.error('Error buscando usuarios:', error);
        setUsuarios([]);
      } finally {
        setIsLoading(false);
      }
    }, delay);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [busqueda, delay, setIsLoading]);

  const limpiarBusqueda = () => {
    setBusqueda('');
    setUsuarios([]);
  };

  return {
    busqueda,
    setBusqueda,
    usuarios,
    limpiarBusqueda,
  };
};