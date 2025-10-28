import { useMemo } from 'react';
import type { IUsuarioResponse } from '../../../../../../../../../../domain/responses/usuarios.responses';
import { useGetContactosFrecuentes } from '../../../../../../../../../../application/use-cases/usuarios/useGetContactosFrecuentes';

export const useContactosFrecuentesFlow = (
  setIsLoading: (v: boolean) => void,
) => {
  const { chatsRecientes } = useGetContactosFrecuentes(setIsLoading);

  // Extrae los usuarios únicos y ordenados según la última conversación
  const usuariosFrecuentes = useMemo<IUsuarioResponse[]>(() => {
    const vistos = new Set<string>();
    const lista: IUsuarioResponse[] = [];

    for (const chat of chatsRecientes) {
      const user = chat.usuarioB;
      if (user && !vistos.has(user.id_usuario.toString())) {
        vistos.add(user.id_usuario);
        lista.push(user);
      }
    }

    return lista;
  }, [chatsRecientes]);

  return {
    usuariosFrecuentes,
    chatsRecientes,
  };
};
