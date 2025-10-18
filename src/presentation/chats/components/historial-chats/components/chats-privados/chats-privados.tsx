// ChatsPrivados.tsx (modificado)
import { useAuthStore } from '../../../../../../application/auth/hooks/useAuthStore';
import { IChatPrivadoResponse } from '../../../../../../application/chats/chats.responses';
import { ChatPrivadoCard } from './components/chat-privado-card';

export const ChatsPrivados = () => {
  const chatsPrivados = useAuthStore((s) => s.chatsPrivados) ?? [];
  const chatsTemporales = useAuthStore((s) => s.chatsPrivadosTemporales) ?? [];
  const usuario = useAuthStore((state) => state.usuario);

  const setChatPrivadoActivo = useAuthStore(
    (state) => state.setChatPrivadoActivo,
  );

  // merge: evitar duplicados por id_chat o usuarioB.id_usuario
  const merged = (() => {
    const map = new Map<
      string,
      IChatPrivadoResponse | Partial<IChatPrivadoResponse>
    >();
    // agregar temporales primero para que se vean arriba
    for (const t of chatsTemporales) {
      if (!t.id_chat) continue;
      map.set(t.id_chat, t);
    }
    for (const c of chatsPrivados) {
      if (!c.id_chat) continue;
      // si existe temporal para mismo usuarioB, preferir el real (si coincide por usuario)
      const conflict = Array.from(map.values()).find(
        (v) =>
          v.usuarioB?.id_usuario &&
          v.usuarioB.id_usuario === c.usuarioB?.id_usuario,
      );
      if (conflict && conflict.id_chat?.startsWith('temp-')) {
        // reemplazamos temporal por real
        map.delete(conflict.id_chat);
      }
      map.set(c.id_chat, c);
    }
    return Array.from(map.values()) as IChatPrivadoResponse[];
  })();

  const onSelectChat = (
    chat: IChatPrivadoResponse | Partial<IChatPrivadoResponse>,
  ) => {
    setChatPrivadoActivo(chat as IChatPrivadoResponse);
  };

  return (
    <div className="overflow-y-auto size-full">
      {merged.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">
          No tienes chats privados aún.
        </p>
      ) : (
        merged.map((chat) => (
          <ChatPrivadoCard
            key={chat.id_chat}
            chat={chat as IChatPrivadoResponse}
            onClick={(c) => onSelectChat(c)}
            usuarioA={usuario!}
          />
        ))
      )}
    </div>
  );
};
