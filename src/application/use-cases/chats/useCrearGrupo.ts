import { useState } from 'react';
import { ChatsService } from '../../../infraestructure/rest/chats/chats.service';
import { AppStore } from '../../store/app.store';

export const useCrearGrupo = () => {
  const addChatGrupal = AppStore((state) => state.addChatGrupal);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearGrupo = async (datosGrupo: {
    nombre: string;
    descripcion: string;
    foto?: string;
    integrantes: string[];
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Transformar los integrantes al formato que espera el backend
      const integrantesFormateados = datosGrupo.integrantes.map((id) => ({
        id_usuario: id,
      }));

      const datosParaAPI = {
        nombre: datosGrupo.nombre,
        descripcion: datosGrupo.descripcion,
        foto: datosGrupo.foto,
        integrantes: integrantesFormateados,
      };

      console.log('Creando grupo con datos:', datosParaAPI);

      const respuesta = await ChatsService.createChatGrupal(datosParaAPI);

      if (respuesta.success && respuesta.data) {
        console.log('Grupo creado exitosamente:', respuesta.data);
        // Agregar el nuevo grupo a la lista
        addChatGrupal(respuesta.data);
        return { success: true, data: respuesta.data };
      } else {
        const errorMsg =
          typeof respuesta.error === 'string'
            ? respuesta.error
            : 'Error al crear el grupo';
        console.error('Error al crear el grupo:', errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      const errorMsg = 'Error inesperado al crear el grupo';
      console.error('Error al crear el grupo:', error);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    crearGrupo,
    isLoading,
    error,
  };
};
