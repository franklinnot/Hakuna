import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../application/auth/hooks/useAuthStore';
import { TipoChats } from '../../../../shared/domain/enums';
import { Input } from '../../../../shared/presentation/components/ui/input';
import { ChatsGrupales } from './components/chats-grupales/chats-grupales';
import { ChatsPrivados } from './components/chats-privados/chats-privados';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { InputChange } from '../../../../shared/presentation/html.types';
import { ChatsService } from '../../../../application/chats/chats.service';
import { MensajesService } from '../../../../application/mensajes/mensajes.service';
import { SkeletonChatsList } from '../../../../shared/presentation/components/ui/skeleton-chats-list';
import { IChatGrupalResponse } from '../../../../application/chats/chats.responses';

export const HistorialChats = () => {
  const tipoChatsActivo = useAuthStore((state) => state.tipoChatsActivo);
  const [termBusqueda, setTermBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setChatsPrivados = useAuthStore((s) => s.setChatsPrivados);
  const setChatsGrupales = useAuthStore((s) => s.setChatsGrupales);

  // cargar chats
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (tipoChatsActivo === TipoChats.PRIVADO) {
          const response = await ChatsService.getChatsPrivados();
          if (response.success && response.data) {
            setChatsPrivados(response.data);
          }
        } else {
          const response = await ChatsService.getChatsGrupales();
          if (response.success && response.data) {
            setChatsGrupales(response.data);
            preloadMensajesGrupales(response.data);
          }
        }
      } catch (err) {
        console.error('Error cargando chats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tipoChatsActivo]);

  // carga en segundo plano los mensajes de cada chat grupal
  const preloadMensajesGrupales = async (chats: IChatGrupalResponse[]) => {
    const updatedChats = await Promise.all(
      chats.map(async (chat) => {
        try {
          const resp = await MensajesService.getMensajesGrupales(chat.id_chat);
          if (resp.success && resp.data) {
            return { ...chat, historial_mensajes: resp.data };
          }
        } catch {
          console.warn(`Error cargando mensajes grupales de ${chat.id_chat}`);
        }
        return chat;
      }),
    );
    setChatsGrupales(updatedChats);
  };

  return (
    <div className="size-full bg-gray-800 p-5 rounded-2xl flex flex-col gap-5 w-full max-w-[450px]">
      {/* buscador */}
      <div className="block w-full relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar..."
          value={termBusqueda}
          onChange={(e: InputChange) => setTermBusqueda(e.target.value)}
          disabled={isLoading}
          className="pl-10 py-6 border-gray-400"
          required
        />
      </div>

      {/* 💬 Lista de chats */}
      {isLoading ? (
        <SkeletonChatsList />
      ) : tipoChatsActivo === TipoChats.PRIVADO ? (
        <ChatsPrivados />
      ) : (
        <ChatsGrupales />
      )}
    </div>
  );
};
