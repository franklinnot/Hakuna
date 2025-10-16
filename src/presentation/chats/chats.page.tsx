import { AuthLayout } from '../../shared/presentation/components/layouts/auth-layout';
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
        <div
          className="bg-green-500 flex items-center justify-center text-white 
        font-bold text-lg"
        >
          {/* {activeChatType === 'grupos'
            ? 'Hola! Aquí van los grupos'
            : 'Hola! Aquí van los chats privados'} */}
          Chtas
        </div>
        {/* <HistorialMensajes /> */}
        <p>Soy el historial de mensajes</p>
      </div>
    </AuthLayout>
  );
};
