import { AppStore } from '../../../../../application/store/app.store';
import { TipoChats } from '../../../../../domain/enums';
import { Input } from '../../../../components/input';
import { ChatsGrupales } from './components/chats-grupales/chats-grupales';
import { ChatsPrivados } from './components/chats-privados/chats-privados';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { InputChange } from '../../../../html.types';
import { useState } from 'react';

export const HistorialChats = () => {
  const tipoChatsActivo = AppStore((state) => state.tipoChatsActivo);
  const [termBusqueda, setTermBusqueda] = useState('');

  return (
    <div
      className="size-full bg-gray-800 p-4 py-5 pb-0 rounded-2xl flex flex-col 
      gap-5 max-sm:max-w-[280px] w-full sm:w-[320px] md:w-[350px] lg:w-[380px]"
    >
      <div className="block w-full relative">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-3 
          top-1/2 size-5 -translate-y-1/2 text-gray-500"
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
