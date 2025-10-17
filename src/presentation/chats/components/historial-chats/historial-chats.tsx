import { useState } from 'react';
import { useAuthStore } from '../../../../application/auth/hooks/useAuthStore';
import { TipoChats } from '../../../../shared/domain/enums';
import { Input } from '../../../../shared/presentation/components/ui/input';
import { ChatsGrupales } from './components/chats-grupales/chats-grupales';
import { ChatsPrivados } from './components/chats-privados/chats-privados';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { InputChange } from '../../../../shared/presentation/html.types';

export const HistorialChats = () => {
  const tipoChatsActivo = useAuthStore((state) => state.tipoChatsActivo);
  const [termBusqueda, setTermBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      className="size-full bg-gray-800 p-5 rounded-2xl 
    flex flex-col gap-5 max-w-[400px]"
    >
      <div className="block w-full relative">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5
          -translate-y-1/2 text-gray-400"
        />
        <Input
          placeholder="Buscar..."
          value={termBusqueda}
          onChange={(e: InputChange) => setTermBusqueda(e.target.value)}
          disabled={isLoading}
          className="pl-10 py-6 border-gray-400"
          required
        />
      </div>
      {tipoChatsActivo == TipoChats.PRIVADO ? (
        <ChatsPrivados />
      ) : (
        <ChatsGrupales />
      )}
    </div>
  );
};
