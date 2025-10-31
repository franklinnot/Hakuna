import { UsuariosService } from '../../../infraestructure/rest/usuarios/usuarios.service';
import { UpdateUsuarioSchema } from '../../../infraestructure/rest/usuarios/usuarios.dtos';
import { AppStore } from '../../store/app.store';
import type { ErrorResponse } from '../../response';

export const useUpdateUsuario = () => {
  const { setUsuario } = AppStore();

  const updateUsuario = async (
    payload: Record<string, string | null | undefined>,
    setIsLoading: (v: boolean) => void,
    setError: (e: ErrorResponse) => void,
  ) => {
    setError(null);
    setIsLoading(true);

    try {
      // Validar con zod
      const result = UpdateUsuarioSchema.safeParse(payload);
      if (!result.success) {
        setError(result.error.issues.map((i) => i.message));
        return;
      }

      // Llamar al servicio REST
      const response = await UsuariosService.updateUsuario(result.data);
      if (!response.success || !response.data) {
        setError(response.error ?? 'Error al actualizar usuario.');
        setIsLoading(false);
        return;
      }

      // Actualizar usuario globalmente
      setUsuario(response.data);
    } catch (err) {
      console.error('Error en updateUsuario:', err);
      setError('No se pudo actualizar el usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUsuario };
};
