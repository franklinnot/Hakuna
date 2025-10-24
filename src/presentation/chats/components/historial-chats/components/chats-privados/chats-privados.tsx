import { motion, AnimatePresence } from 'framer-motion';
import { useChatsPrivadosFlow } from './hooks/useChatsPrivadosFlow';
import { ChatPrivadoCard } from './components/chat-privado-card';
import { useAuthStore } from '../../../../../../application/auth/hooks/useAuthStore/useAuthStore';
import type { IChatPrivadoResponse } from '../../../../../../application/chats/chats.responses';

export const ChatsPrivados = () => {
  const merged = useChatsPrivadosFlow(); 
  const usuario = useAuthStore((s) => s.usuario);
  const setChatPrivadoActivo = useAuthStore((s) => s.setChatPrivadoActivo);

  const onSelectChat = (chat: IChatPrivadoResponse) => {
    setChatPrivadoActivo(chat);
  };

  return (
    <div className="overflow-y-auto size-full px-1 py-2">
      {merged.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">
          No tienes chats privados aún.
        </p>
      ) : (
        <AnimatePresence>
          {merged.map((chat) => (
            <motion.div
              key={chat.id_chat}
              layout // animar los reordenamientos
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            >
              <ChatPrivadoCard
                chat={chat}
                onClick={() => onSelectChat(chat)}
                usuarioA={usuario!}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};
