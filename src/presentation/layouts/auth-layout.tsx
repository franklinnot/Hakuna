import { useEffect } from 'react';
import { useSocketListener } from '../../infraestructure/socket/useSocketListener';
import { connectSocket } from '../../infraestructure/socket/socket.client';
import { AppStore } from '../../application/store/app.store';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  useSocketListener();
  useEffect(() => {
    const token = AppStore.getState().token;
    // conectarse al socket
    connectSocket(token ?? '');
  }, []);
  return <div className="w-full h-full">{children}</div>;
};
