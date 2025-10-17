import { AuthLayout } from '../../shared/presentation/components/layouts/auth-layout';
import { HistorialChats } from './components/historial-chats/historial-chats';
import { HistorialMensajes } from './components/historial-mensajes/historial-mensajes';
import { Sidebar } from './components/sidebar/sidebar';

export const ChatsPage = () => {
  return (
    <AuthLayout>
      <div
        className="w-full h-full grid grid-rows-1 grid-cols-[auto_1fr_3fr] gap-4 
      p-4 bg-[var(--black-primary)]"
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Historial de chats */}
        <HistorialChats />
        {/* <HistorialMensajes /> */}
        <HistorialMensajes />
      </div>
    </AuthLayout>
  );
};
