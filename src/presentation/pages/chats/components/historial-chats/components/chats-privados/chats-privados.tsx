import { motion, AnimatePresence } from 'framer-motion';
import { useChatsPrivadosFlow } from './hooks/useChatsPrivadosFlow';
import { ChatPrivadoCard } from './components/chat-privado-card';
import { AppStore } from '../../../../../../../application/store/app.store';
import { IChatPrivadoResponse } from '../../../../../../../domain/responses/chats.responses';

export const ChatsPrivados = () => {
  const merged = useChatsPrivadosFlow(); 
  const usuario = AppStore((s) => s.usuario);
  const setIdChatActivo = AppStore((s) => s.setIdChatActivo);

  const onSelectChat = (chat: IChatPrivadoResponse) => {
    setIdChatActivo(chat.id_chat);
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
