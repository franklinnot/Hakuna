import { AppStore } from '../../store/app.store';
import { disconnectSocket } from '../../../infraestructure/socket/socket.client';

export const useCerrarSesion = () => {
  const { logout } = AppStore();

  // desconectar socket al cerrar sesión
  const cerrarSesion = () => {
    disconnectSocket();
    logout();
  };

  return { cerrarSesion };
};
