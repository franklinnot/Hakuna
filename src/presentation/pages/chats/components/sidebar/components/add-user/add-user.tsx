import { Input } from '../../../../../../components/input';
import { Button } from '../../../../../../components/button';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { Image } from '../../../../../../components/img';
import { useAddUserFlow } from './useAddUserFlow';
import { useState } from 'react';

export const AddUser = ({
  handleCloseModal,
}: {
  handleCloseModal: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { busqueda, setBusqueda, usuarios, handleSelectUser } = useAddUserFlow(
    handleCloseModal,
    setIsLoading,
  );

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        autoFocus
      />

      <div className="flex flex-col gap-2 scroll-container">
        {isLoading && <p className="text-sm text-gray-500">Buscando...</p>}

        {usuarios.map((user) => (
          <div
            key={user.id_usuario}
            className="flex items-center justify-between p-2.5 rounded-full 
            hover:bg-teal-100"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {user.link_foto ? (
                  <Image src={user.link_foto} alt="Perfil" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center 
                  bg-gray-400 text-white font-bold"
                  >
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <p className="font-semibold">{user.nombre}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>

            <Button
              className="w-10 h-10 p-0 flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                handleSelectUser(user);
              }}
            >
              <ChatBubbleLeftIcon className="h-5 w-5 pointer-events-none" />
            </Button>
          </div>
        ))}

        {!isLoading && usuarios.length === 0 && busqueda.trim() && (
          <p className="text-sm text-gray-500">No se encontraron usuarios.</p>
        )}
      </div>
    </div>
  );
};
