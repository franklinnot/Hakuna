import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../application/auth/hooks/useAuthStore';
import { TipoChats } from '../../../../shared/domain/enums';
import { Input } from '../../../../shared/presentation/components/ui/input';
import { ChatsGrupales } from './components/chats-grupales/chats-grupales';
import { ChatsPrivados } from './components/chats-privados/chats-privados';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { InputChange } from '../../../../shared/presentation/html.types';
import { useMensajesService } from '../../../../application/mensajes/hooks/useMensajesService';

export const HistorialChats = () => {
  const tipoChatsActivo = useAuthStore((state) => state.tipoChatsActivo);
  const [termBusqueda, setTermBusqueda] = useState('');
  const { getMensajes } = useMensajesService();

  useEffect(() => {
    getMensajes();
  }, []);

  return (
    <div
      className="size-full bg-gray-800 p-5 rounded-2xl flex flex-col 
      gap-5 max-sm:max-w-[280px] w-full sm:w-[320px] md:w-[350px] lg:w-[380px]"
    >
      <div className="block w-full relative">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-3 
          top-1/2 size-5 -translate-y-1/2 text-gray-400"
        />
        <Input
          placeholder="Buscar..."
          value={termBusqueda}
          onChange={(e: InputChange) => setTermBusqueda(e.target.value)}
          className="pl-10 py-6 border-gray-400"
        />
      </div>

      {tipoChatsActivo === TipoChats.PRIVADO ? (
        <ChatsPrivados />
      ) : (
        <ChatsGrupales />
      )}
    </div>
  );
};
