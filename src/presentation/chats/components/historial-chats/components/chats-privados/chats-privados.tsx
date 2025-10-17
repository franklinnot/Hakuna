import { useAuthStore } from '../../../../../../application/auth/hooks/useAuthStore';
import { IChatPrivadoResponse } from '../../../../../../application/chats/chats.responses';
import { ChatPrivadoCard } from './components/chat-privado-card';

export const ChatsPrivados = () => {
  const chatsPrivados = useAuthStore((s) => s.chatsPrivados);
  const usuario = useAuthStore((state) => state.usuario);

  const setChatPrivadoActivo = useAuthStore(
    (state) => state.setChatPrivadoActivo,
  );

  const onSelectChat = (chat: IChatPrivadoResponse) => {
    setChatPrivadoActivo(chat);
  };

  return (
    <div className="overflow-y-auto size-full">
      {!chatsPrivados || chatsPrivados.length == 0 ? (
        <p className="text-gray-500 text-center mt-4">
          No tienes chats privados aún.
        </p>
      ) : (
        chatsPrivados.map((chat) => (
          <ChatPrivadoCard
            key={chat.id_chat}
            chat={chat}
            onClick={(chat) => onSelectChat(chat)}
            usuarioA={usuario!}
          />
        ))
      )}
    </div>
  );
};
