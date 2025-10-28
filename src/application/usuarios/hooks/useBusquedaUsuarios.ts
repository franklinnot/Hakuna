import { useState, useEffect } from 'react';
import { UsuariosService } from '../usuarios.service';
import type { IUsuarioResponse } from '../usuarios.responses';

export const useBusquedaUsuarios = () => {
  const [busqueda, setBusqueda] = useState('');
  const [usuariosBusqueda, setUsuariosBusqueda] = useState<IUsuarioResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

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

  const limpiarBusqueda = () => {
    setBusqueda('');
    setUsuariosBusqueda([]);
  };

  return {
    busqueda,
    setBusqueda,
    usuariosBusqueda,
    loading,
    limpiarBusqueda,
    tieneBusquedaActiva: busqueda.trim().length >= 2
  };
};